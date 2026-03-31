import { CanvasMessage } from '@/hooks/useSocket';
import { Shape } from '@repo/types';

// Types of resize handles available for shapes
type ResizeHandle =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left';

// Manages shape selection, movement, and resizing on the canvas
// Single selection only - no multi-selection functionality

export class SelectionManager {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private sendMessage: (message: CanvasMessage) => void;
  private roomId: string;
  private dragDistance: number = 0;
  private zoom: number = 1;

  private selectedShape: Shape | null = null; // Currently selected shape

  private isDragging = false; // Whether a shape is being dragged
  private isResizing = false; // Whether a shape is being resized
  private isRotating = false; // Whether a shape is being rotated
  private activeHandle: ResizeHandle | null = null; // Current resize handle being used

  // For marquee selection
  private isMarqueeSelecting = false;
  private marqueeStartX = 0;
  private marqueeStartY = 0;
  private marqueeEndX = 0;
  private marqueeEndY = 0;

  // For rotation
  private rotationCenter = { x: 0, y: 0 };

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    sendMessage: (message: CanvasMessage) => void,
    roomId: string,
  ) {
    this.canvas = canvas;
    this.context = context;
    this.sendMessage = sendMessage;
    this.roomId = roomId;
  }

  public setZoom(zoom: number) {
    this.zoom = zoom;
  }

  // Checks if a point (x,y) is inside a given shape
  //  Handles different shape types (Rectangle, Diamond, Ellipse, Line, Arrow)

  private isPointInsideShape(shape: Shape, x: number, y: number): boolean {
    if (shape.type === 'Freehand' && shape.paths) {
      // For freehand shapes, check if any point is within a threshold
      const threshold = 10; // Adjust this value to change selection sensitivity
      return shape.paths.some(point => {
        const distance = Math.sqrt(
          Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2),
        );
        return distance <= threshold;
      });
    }

    // For other shapes, use the existing logic
    const minX = Math.min(shape.x1, shape.x2);
    const maxX = Math.max(shape.x1, shape.x2);
    const minY = Math.min(shape.y1, shape.y2);
    const maxY = Math.max(shape.y1, shape.y2);

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  // Returns the positions of all resize handles for a shape
  // Includes corner and edge handles

  private getResizeHandles(
    shape: Shape,
  ): Record<ResizeHandle, { x: number; y: number }> {
    const { x1, y1, x2, y2 } = shape;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return {
      'top-left': { x: Math.min(x1, x2), y: Math.min(y1, y2) },
      top: { x: midX, y: Math.min(y1, y2) },
      'top-right': { x: Math.max(x1, x2), y: Math.min(y1, y2) },
      right: { x: Math.max(x1, x2), y: midY },
      'bottom-right': { x: Math.max(x1, x2), y: Math.max(y1, y2) },
      bottom: { x: midX, y: Math.max(y1, y2) },
      'bottom-left': { x: Math.min(x1, x2), y: Math.max(y1, y2) },
      left: { x: Math.min(x1, x2), y: midY },
    };
  }

  // Finds which resize handle (if any) is at the given point, accounting for rotation

  public getResizeHandleAtPoint(x: number, y: number): ResizeHandle | null {
    if (!this.selectedShape) return null;

    const shape = this.selectedShape;
    const handles = this.getResizeHandles(shape);

    // If shape is rotated, transform the mouse coordinates
    let transformedX = x;
    let transformedY = y;

    if (shape.rotation) {
      const centerX = (shape.x1 + shape.x2) / 2;
      const centerY = (shape.y1 + shape.y2) / 2;

      // Convert rotation from degrees to radians (in reverse direction)
      const angleRad = -(shape.rotation * Math.PI) / 180;

      // Translate point to origin (center of shape)
      const translatedX = x - centerX;
      const translatedY = y - centerY;

      // Rotate point
      transformedX =
        centerX +
        translatedX * Math.cos(angleRad) -
        translatedY * Math.sin(angleRad);
      transformedY =
        centerY +
        translatedX * Math.sin(angleRad) +
        translatedY * Math.cos(angleRad);
    }

    const threshold = 6 / this.zoom;
    for (const [name, pos] of Object.entries(handles) as [
      ResizeHandle,
      { x: number; y: number },
    ][]) {
      if (
        Math.abs(transformedX - pos.x) <= threshold &&
        Math.abs(transformedY - pos.y) <= threshold
      )
        return name;
    }

    return null;
  }

  // Gets the rotation handle position for a shape

  private getRotationHandle(shape: Shape): { x: number; y: number } {
    const centerX = (shape.x1 + shape.x2) / 2;
    // const centerY = (shape.y1 + shape.y2) / 2;
    const minY = Math.min(shape.y1, shape.y2);

    // Place rotation handle above the shape (constant screen-space distance)
    return {
      x: centerX,
      y: minY - 25 / this.zoom,
    };
  }

  // Checks if a point is near the rotation handle, accounting for shape rotation

  public isNearRotationHandle(x: number, y: number): boolean {
    if (!this.selectedShape) return false;

    const shape = this.selectedShape;
    const handle = this.getRotationHandle(shape);

    // If shape is rotated, we need to transform the mouse coordinates
    if (shape.rotation) {
      const centerX = (shape.x1 + shape.x2) / 2;
      const centerY = (shape.y1 + shape.y2) / 2;

      // Convert rotation from degrees to radians (in reverse direction)
      const angleRad = -(shape.rotation * Math.PI) / 180;

      // Translate point to origin (center of shape)
      const translatedX = x - centerX;
      const translatedY = y - centerY;

      // Rotate point
      const rotatedX =
        translatedX * Math.cos(angleRad) - translatedY * Math.sin(angleRad);
      const rotatedY =
        translatedX * Math.sin(angleRad) + translatedY * Math.cos(angleRad);

      // Translate back
      const transformedX = centerX + rotatedX;
      const transformedY = centerY + rotatedY;

      return Math.hypot(transformedX - handle.x, transformedY - handle.y) <= 8 / this.zoom;
    }

    return Math.hypot(x - handle.x, y - handle.y) <= 8 / this.zoom;
  }

  // Begin rotation of the selected shape

  public beginRotation() {
    if (!this.selectedShape || this.selectedShape.type === 'Text') return;

    this.isRotating = true;
    this.rotationCenter = {
      x: (this.selectedShape.x1 + this.selectedShape.x2) / 2,
      y: (this.selectedShape.y1 + this.selectedShape.y2) / 2,
    };
  }

  // Update rotation based on mouse movement

  public updateRotation(x: number, y: number) {
    if (!this.isRotating || !this.selectedShape) return;

    // Calculate angle between center and current mouse position
    const angle = Math.atan2(
      y - this.rotationCenter.y,
      x - this.rotationCenter.x,
    );

    // Convert to degrees and normalize to 0-360
    let degrees = angle * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;

    // Update the shape rotation
    this.selectedShape.rotation = degrees;
  }

  // End rotation operation

  public endRotation() {
    this.isRotating = false;

    // Send rotation updates
    if (this.selectedShape) {
      this.sendMessage({
        type: 'canvas:update',
        room: this.roomId,
        data: this.selectedShape,
      });
    }
  }

  // Finds which shape (if any) is at the given point
  // Returns the most appropriate shape at that position, prioritizing smaller shapes
  // to handle nested shapes correctly

  public getShapeAtPoint(x: number, y: number, shapes: Shape[]): Shape | null {
    // Find all shapes containing the point
    const containingShapes = shapes.filter(shape =>
      this.isPointInsideShape(shape, x, y),
    );

    if (containingShapes.length === 0) {
      this.selectedShape = null;
      return null;
    }

    // Calculate area for each shape
    const shapesWithArea = containingShapes.map(shape => {
      const width = Math.abs(shape.x2 - shape.x1);
      const height = Math.abs(shape.y2 - shape.y1);
      const area = width * height;
      return { shape, area };
    });

    // Sort by area (ascending) and then by z-index (descending)
    shapesWithArea.sort((a, b) => {
      // If areas are significantly different, prefer the smaller one
      if (Math.abs(a.area - b.area) > 100) {
        return a.area - b.area; // Smaller area first
      }

      // Otherwise, use z-index (based on array position)
      const aIndex = shapes.indexOf(a.shape);
      const bIndex = shapes.indexOf(b.shape);
      return bIndex - aIndex; // Higher index (top) first
    });

    // Select the best match (smallest area that contains the point)
    const selectedShape = shapesWithArea[0].shape;
    this.selectedShape = selectedShape;

    // Move the shape to the end of the array (top of the stack)
    const index = shapes.indexOf(selectedShape);
    shapes.splice(index, 1);
    shapes.push(selectedShape);

    return selectedShape;
  }

  // Gets the currently selected shape

  public getSelectedShape(): Shape | null {
    return this.selectedShape;
  }

  // Sets the currently selected shape

  public setSelectedShape(shape: Shape | null) {
    if (
      this.selectedShape === shape ||
      (this.selectedShape && shape && this.selectedShape.id === shape.id)
    ) {
      return;
    }
    this.selectedShape = shape;
  }

  // Gets all currently selected shapes (in single-selection mode, returns array with 0 or 1 item)

  public getSelectedShapes(): Shape[] {
    return this.selectedShape ? [this.selectedShape] : [];
  }

  // Starts marquee selection from a point

  public beginMarqueeSelection(x: number, y: number) {
    this.isMarqueeSelecting = true;
    this.marqueeStartX = x;
    this.marqueeStartY = y;
    this.marqueeEndX = x;
    this.marqueeEndY = y;
  }

  // Updates marquee selection

  public updateMarqueeSelection(x: number, y: number) {
    if (!this.isMarqueeSelecting) return;
    this.marqueeEndX = x;
    this.marqueeEndY = y;
  }

  // Completes marquee selection and selects all shapes inside the marquee
  // Modified to prioritize smaller shapes for better nested shape handling

  public completeMarqueeSelection(shapes: Shape[]) {
    if (!this.isMarqueeSelecting) return;

    const minX = Math.min(this.marqueeStartX, this.marqueeEndX);
    const maxX = Math.max(this.marqueeStartX, this.marqueeEndX);
    const minY = Math.min(this.marqueeStartY, this.marqueeEndY);
    const maxY = Math.max(this.marqueeStartY, this.marqueeEndY);

    // Clear current selection
    this.selectedShape = null;

    // Find all shapes that intersect with marquee
    const intersectingShapes = shapes.filter(shape =>
      this.doesShapeIntersectRect(shape, minX, minY, maxX, maxY),
    );

    if (intersectingShapes.length === 0) {
      this.isMarqueeSelecting = false;
      return;
    }

    // Calculate area for each shape
    const shapesWithArea = intersectingShapes.map(shape => {
      const width = Math.abs(shape.x2 - shape.x1);
      const height = Math.abs(shape.y2 - shape.y1);
      const area = width * height;
      return { shape, area };
    });

    // Sort by area (ascending) and then by z-index (descending)
    shapesWithArea.sort((a, b) => {
      // If areas are significantly different, prefer the smaller one
      if (Math.abs(a.area - b.area) > 100) {
        return a.area - b.area; // Smaller area first
      }

      // Otherwise, use z-index (based on array position)
      const aIndex = shapes.indexOf(a.shape);
      const bIndex = shapes.indexOf(b.shape);
      return bIndex - aIndex; // Higher index (top) first
    });

    // Select the best match (smallest shape in the marquee)
    this.selectedShape = shapesWithArea[0].shape;

    this.isMarqueeSelecting = false;
  }

  // Draws the marquee selection rectangle

  public drawMarqueeSelection() {
    if (!this.isMarqueeSelecting) return;

    const minX = Math.min(this.marqueeStartX, this.marqueeEndX);
    const maxX = Math.max(this.marqueeStartX, this.marqueeEndX);
    const minY = Math.min(this.marqueeStartY, this.marqueeEndY);
    const maxY = Math.max(this.marqueeStartY, this.marqueeEndY);

    this.context.save();
    this.context.strokeStyle = '#625ee0';
    this.context.lineWidth = 1 / this.zoom;
    this.context.strokeRect(minX, minY, maxX - minX, maxY - minY);
    this.context.fillStyle = 'rgba(98, 94, 224, 0.1)';
    this.context.fillRect(minX, minY, maxX - minX, maxY - minY);
    this.context.restore();
  }

  // Checks if a shape intersects with a rectangle

  private doesShapeIntersectRect(
    shape: Shape,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
  ): boolean {
    // For simple shapes like rectangles and ellipses
    const shapeMinX = Math.min(shape.x1, shape.x2);
    const shapeMaxX = Math.max(shape.x1, shape.x2);
    const shapeMinY = Math.min(shape.y1, shape.y2);
    const shapeMaxY = Math.max(shape.y1, shape.y2);

    // Check if the rectangles overlap
    return !(
      shapeMaxX < minX ||
      shapeMinX > maxX ||
      shapeMaxY < minY ||
      shapeMinY > maxY
    );
  }

  // Starts dragging a shape

  public beginDrag() {
    this.isDragging = true;
  }

  // Updates shape position during dragging

  public updateDrag(deltaX: number, deltaY: number) {
    if (this.selectedShape && this.isDragging) {
      if (this.selectedShape.type === 'Freehand' && this.selectedShape.paths) {
        // For freehand shapes, update all points in the path
        this.selectedShape.paths = this.selectedShape.paths.map(point => [
          point[0] + deltaX,
          point[1] + deltaY,
        ]);

        // Update the shape's bounding box coordinates
        this.selectedShape.x1 += deltaX;
        this.selectedShape.y1 += deltaY;
        this.selectedShape.x2 += deltaX;
        this.selectedShape.y2 += deltaY;
      } else {
        // For other shapes, use the existing logic
        this.selectedShape.x1 += deltaX;
        this.selectedShape.y1 += deltaY;
        this.selectedShape.x2 += deltaX;
        this.selectedShape.y2 += deltaY;
      }

      // Track total distance moved
      this.dragDistance += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
  }

  // Ends dragging operation

  public endDrag() {
    this.isDragging = false;

    // Only send updates if the shape was actually moved
    if (this.selectedShape && this.dragDistance > 0) {
      this.sendMessage({
        type: 'canvas:update',
        room: this.roomId,
        data: this.selectedShape,
      });
    }

    // Reset drag distance
    this.dragDistance = 0;
  }

  // Starts resizing a shape from a specific handle

  public beginResize(handle: ResizeHandle) {
    if (this.selectedShape && this.selectedShape.type === 'Text') {
      // Don't allow resizing for Text shapes
      return;
    }
    this.isResizing = true;
    this.activeHandle = handle;
  }

  // Updates shape size during resizing
  // Handles different resize handles (corners and edges)

  public updateResize(deltaX: number, deltaY: number) {
    if (!this.selectedShape || !this.isResizing || !this.activeHandle) return;

    const shape = this.selectedShape;
    switch (this.activeHandle) {
      case 'top-left':
        shape.x1 += deltaX;
        shape.y1 += deltaY;
        break;
      case 'top':
        shape.y1 += deltaY;
        break;
      case 'top-right':
        shape.x2 += deltaX;
        shape.y1 += deltaY;
        break;
      case 'right':
        shape.x2 += deltaX;
        break;
      case 'bottom-right':
        shape.x2 += deltaX;
        shape.y2 += deltaY;
        break;
      case 'bottom':
        shape.y2 += deltaY;
        break;
      case 'bottom-left':
        shape.x1 += deltaX;
        shape.y2 += deltaY;
        break;
      case 'left':
        shape.x1 += deltaX;
        break;
    }

    this.ensureMinimumSize(shape);
  }

  // Ends resizing operation

  public endResize() {
    this.isResizing = false;
    this.activeHandle = null;

    // Send dimension updates for the resized shape
    if (this.selectedShape) {
      this.sendMessage({
        type: 'canvas:update',
        room: this.roomId,
        data: this.selectedShape,
      });
    }
  }

  // Draw the rotation handle for the selected shape

  public drawRotationHandle(shape: Shape) {
    const handle = this.getRotationHandle(shape);
    const iz = 1 / this.zoom;

    this.context.save();

    // Draw line from center to handle
    const centerX = (shape.x1 + shape.x2) / 2;
    const centerY = (shape.y1 + shape.y2) / 2;
    this.context.beginPath();
    this.context.strokeStyle = '#625ee0';
    this.context.lineWidth = iz;
    this.context.setLineDash([3 * iz, 3 * iz]);
    this.context.moveTo(centerX, centerY);
    this.context.lineTo(handle.x, handle.y);
    this.context.stroke();

    // Draw rotation handle
    this.context.beginPath();
    this.context.arc(handle.x, handle.y, 6 * iz, 0, Math.PI * 2);
    this.context.fillStyle = '#625ee0';
    this.context.fill();
    this.context.strokeStyle = '#625ee0';
    this.context.setLineDash([]);
    this.context.lineWidth = 1.5 * iz;
    this.context.stroke();

    this.context.restore();
  }

  // Enhanced version of drawing selection outline

  public drawSelectionOutline(shape: Shape) {
    const iz = 1 / this.zoom;
    const padding = 8 * iz;
    const handleHalf = 4 * iz;
    const handleSize = 8 * iz;

    if (shape.type === 'Freehand' && shape.paths) {
      const minX = Math.min(...shape.paths.map(p => p[0]));
      const maxX = Math.max(...shape.paths.map(p => p[0]));
      const minY = Math.min(...shape.paths.map(p => p[1]));
      const maxY = Math.max(...shape.paths.map(p => p[1]));

      this.context.save();
      this.context.strokeStyle = '#625ee0';
      this.context.lineWidth = iz;
      this.context.setLineDash([]);

      this.context.strokeRect(
        minX - padding,
        minY - padding,
        maxX - minX + padding * 2,
        maxY - minY + padding * 2,
      );

      const cornerHandles = [
        { x: minX - padding, y: minY - padding },
        { x: maxX + padding, y: minY - padding },
        { x: maxX + padding, y: maxY + padding },
        { x: minX - padding, y: maxY + padding },
      ];

      for (const pos of cornerHandles) {
        this.context.beginPath();
        this.context.rect(pos.x - handleHalf, pos.y - handleHalf, handleSize, handleSize);
        this.context.fillStyle = '#625ee0';
        this.context.fill();
        this.context.strokeStyle = '#625ee0';
        this.context.stroke();
      }

      this.context.restore();
      return;
    }

    if (shape.type === 'Text') {
      const { x1, y1, x2, y2 } = shape;
      const width = x2 - x1;
      const height = y2 - y1;

      this.context.save();
      this.context.strokeStyle = '#625ee0';
      this.context.lineWidth = iz;
      this.context.setLineDash([]);

      this.context.strokeRect(
        x1 - padding,
        y1 - padding,
        width + padding * 2,
        height + padding * 2,
      );

      const cornerHandles = [
        { x: x1 - padding, y: y1 - padding },
        { x: x2 + padding, y: y1 - padding },
        { x: x2 + padding, y: y2 + padding },
        { x: x1 - padding, y: y2 + padding },
      ];

      for (const pos of cornerHandles) {
        this.context.beginPath();
        this.context.rect(pos.x - handleHalf, pos.y - handleHalf, handleSize, handleSize);
        this.context.fillStyle = '#625ee0';
        this.context.fill();
        this.context.strokeStyle = '#625ee0';
        this.context.stroke();
      }

      this.context.restore();
      return;
    }

    const { x1, y1, x2, y2 } = shape;
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    this.context.save();

    if (shape.rotation) {
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      this.context.translate(centerX, centerY);
      this.context.rotate((shape.rotation * Math.PI) / 180);
      this.context.translate(-centerX, -centerY);
    }

    this.context.strokeStyle = '#625ee0';
    this.context.lineWidth = iz;
    this.context.setLineDash([]);

    if (shape.type === 'Line' || shape.type === 'Arrow') {
      const handles = [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
      ];

      for (const pos of handles) {
        this.context.beginPath();
        this.context.arc(pos.x, pos.y, 8 * iz, 0, Math.PI * 2);
        this.context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.context.fill();

        this.context.beginPath();
        this.context.arc(pos.x, pos.y, 6 * iz, 0, Math.PI * 2);
        this.context.fillStyle = '#625ee0';
        this.context.fill();
        this.context.strokeStyle = '#625ee0';
        this.context.lineWidth = 1.5 * iz;
        this.context.stroke();
      }
    } else {
      this.context.strokeRect(
        minX - padding,
        minY - padding,
        width + padding * 2,
        height + padding * 2,
      );

      const cornerHandles = [
        { x: minX - padding, y: minY - padding },
        { x: minX + width / 2, y: minY - padding },
        { x: minX + width + padding, y: minY - padding },
        { x: minX + width + padding, y: minY + height / 2 },
        { x: minX + width + padding, y: minY + height + padding },
        { x: minX + width / 2, y: minY + height + padding },
        { x: minX - padding, y: minY + height + padding },
        { x: minX - padding, y: minY + height / 2 },
      ];

      for (const pos of cornerHandles) {
        this.context.beginPath();
        this.context.rect(pos.x - handleHalf, pos.y - handleHalf, handleSize, handleSize);
        this.context.fillStyle = '#625ee0';
        this.context.fill();
        this.context.strokeStyle = '#625ee0';
        this.context.stroke();
      }

      this.drawRotationHandle(shape);
    }

    this.context.restore();
  }

  // Updates cursor style based on current interaction
  // Shows resize cursors when over handles, move cursor when over shape

  public updateCursor(x: number, y: number) {
    if (!this.selectedShape || this.selectedShape.type === 'Text') {
      this.canvas.style.cursor = 'default';
      return;
    }

    // Check if we're near the rotation handle
    if (this.isNearRotationHandle(x, y)) {
      this.canvas.style.cursor = 'grab';
      return;
    }

    const handle = this.getResizeHandleAtPoint(x, y);
    if (handle) {
      switch (handle) {
        case 'top-left':
        case 'bottom-right':
          this.canvas.style.cursor = 'nwse-resize';
          break;
        case 'top-right':
        case 'bottom-left':
          this.canvas.style.cursor = 'nesw-resize';
          break;
        case 'top':
        case 'bottom':
          this.canvas.style.cursor = 'ns-resize';
          break;
        case 'left':
        case 'right':
          this.canvas.style.cursor = 'ew-resize';
          break;
      }
    } else if (this.isPointInsideShape(this.selectedShape, x, y)) {
      this.canvas.style.cursor = 'move';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  // Ensures a shape doesn't get too small during resizing
  // Maintains minimum dimensions for better usability

  private ensureMinimumSize(shape: Shape, minSize: number = 10): void {
    if (Math.abs(shape.x2 - shape.x1) < minSize) {
      if (shape.x2 > shape.x1) {
        shape.x2 = shape.x1 + minSize;
      } else {
        shape.x2 = shape.x1 - minSize;
      }
    }
    if (Math.abs(shape.y2 - shape.y1) < minSize) {
      if (shape.y2 > shape.y1) {
        shape.y2 = shape.y1 + minSize;
      } else {
        shape.y2 = shape.y1 - minSize;
      }
    }
  }
}
