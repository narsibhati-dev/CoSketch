import { Tool } from '@/type/tool';
import { useViewportStore } from '@/stores/viewport.store';
import cuid from 'cuid';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { SelectionManager } from './SelectionManager';
import { getExistingShapes } from '@/api/canvas';
import { Eraser } from './eraser';
import type { Shape, ShapeOptions } from '@repo/types';
import { CanvasMessage } from '@/hooks/useSocket';
import { getStroke } from 'perfect-freehand';

/**
 * Main drawing engine that handles shape creation, manipulation, and rendering
 * Uses rough.js for hand-drawn style rendering
 */
export class CanvasEngine {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private rc: RoughCanvas;
  private generator: RoughGenerator;
  private sendMessage: (message: CanvasMessage) => void;

  // Current action state
  private action:
    | 'none'
    | 'moving'
    | 'drawing'
    | 'resizing'
    | 'rotating'
    | 'marquee-selecting' = 'none';

  private selectedTool: Tool = 'Selection';
  private existingShapes: Shape[] = [];
  private paths: [number, number][] = [];
  private pressures: number[] = [];
  private isDrawingFreehand: boolean = false;
  private textInput: HTMLInputElement | null = null;
  private isTextInputActive: boolean = false;

  // Stroke style configurations
  private strokeStyles = {
    solid: [],
    dashed: [10, 5],
    dotted: [2, 6],
  };

  // Roughness levels for hand-drawn style
  private roughnessLevels = {
    none: 0,
    normal: 1,
    high: 2,
  };

  // Stroke width options
  private strokeWidths = {
    thin: 1,
    medium: 2,
    thick: 4,
  };

  // Current drawing style settings
  private roughness: 'none' | 'normal' | 'high' = 'none';
  private strokeStyle: 'solid' | 'dashed' | 'dotted' = 'solid';
  private strokeWidth: 'thin' | 'medium' | 'thick' = 'thin';
  private fillStyle: 'hachure' | 'solid' | 'cross-hatch' = 'hachure';
  private fillColor: string = 'transparent';
  private strokeColor: string = 'white';
  private seed = 42;

  private roomId: string;

  private selectionManager: SelectionManager;

  // Drawing coordinates
  private x1: number = 0;
  private y1: number = 0;
  private x2: number = 0;
  private y2: number = 0;

  private eraser: Eraser | null = null;
  private isErasing: boolean = false;
  private eraserSize: number = 10;

  // Viewport state (infinite canvas)
  private zoom: number = 1;
  private panX: number = 0;
  private panY: number = 0;

  // Panning state
  private isPanning: boolean = false;
  private panLastX: number = 0;
  private panLastY: number = 0;
  private isSpaceDown: boolean = false;

  // Last eraser screen position (for redraw)
  private lastEraserScreenX: number = -1;
  private lastEraserScreenY: number = -1;

  /**
   * Initializes the drawing engine with canvas and room context
   */
  constructor(
    canvas: HTMLCanvasElement,
    roomId: string,
    sendMessage: (message: CanvasMessage) => void,
  ) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.rc = rough.canvas(canvas);
    this.generator = rough.generator();
    this.roomId = roomId;
    this.sendMessage = sendMessage;

    this.selectionManager = new SelectionManager(
      this.canvas,
      this.context,
      sendMessage,
      roomId,
    );

    this.eraser = new Eraser(this.context, this.existingShapes);

    this.init().then(() => this.initHandlers());
  }

  /**
   * Loads existing shapes from the server
   */
  private async init() {
    const shapes: Shape[] = await getExistingShapes(this.roomId);
    this.existingShapes = Array.isArray(shapes) ? shapes : [];
    this.clearCanvas();
  }

  /**
   * Sets up pointer and keyboard event handlers for drawing and selection
   */
  private initHandlers() {
    this.canvas.addEventListener('pointerdown', this.pointerDownHandler);
    this.canvas.addEventListener('pointermove', this.pointerMoveHandler);
    this.canvas.addEventListener('pointerup', this.pointerUpHandler);
    this.canvas.addEventListener('pointercancel', this.pointerUpHandler);
    this.canvas.addEventListener('pointerout', this.pointerUpHandler);
    this.canvas.addEventListener('wheel', this.wheelHandler, { passive: false });

    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
  }

  /**
   * Cleans up event listeners when the drawing engine is destroyed
   */
  destroy() {
    if (this.textInput) {
      this.textInput.remove();
    }
    this.canvas.removeEventListener('pointerdown', this.pointerDownHandler);
    this.canvas.removeEventListener('pointermove', this.pointerMoveHandler);
    this.canvas.removeEventListener('pointerup', this.pointerUpHandler);
    this.canvas.removeEventListener('pointercancel', this.pointerUpHandler);
    this.canvas.removeEventListener('pointerout', this.pointerUpHandler);
    this.canvas.removeEventListener('wheel', this.wheelHandler);

    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
  }

  /**
   * Handles key down events for modifier keys
   */
  private keyDownHandler = (event: KeyboardEvent) => {
    // Space bar for panning (grab mode)
    if (event.code === 'Space' && !this.isTextInputActive && !this.isSpaceDown) {
      event.preventDefault();
      this.isSpaceDown = true;
      this.canvas.style.cursor = 'grab';
      return;
    }

    // Zoom with keyboard shortcuts
    if (!this.isTextInputActive) {
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        this.zoomBy(1.1);
        return;
      }
      if (event.key === '-' || event.key === '_') {
        event.preventDefault();
        this.zoomBy(1 / 1.1);
        return;
      }
      if ((event.key === '0') && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        this.resetViewport();
        return;
      }
    }

    // Delete key for deleting selected shape
    if ((event.key === 'Delete' || event.key === 'Backspace') && !this.isTextInputActive) {
      this.deleteSelectedShape();
    }
  };

  private keyUpHandler = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      this.isSpaceDown = false;
      this.isPanning = false;
      // Restore cursor to default; tool effect hook in canvas.tsx will re-apply tool cursor
      this.canvas.style.cursor = 'default';
    }
  };

  private wheelHandler = (event: WheelEvent) => {
    event.preventDefault();

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (event.ctrlKey || event.metaKey) {
      // Pinch-to-zoom or ctrl+wheel zoom
      const zoomFactor = event.deltaY < 0 ? 1.08 : 1 / 1.08;
      this.zoomAt(mouseX, mouseY, zoomFactor);
    } else {
      // Pan with scroll wheel
      this.panX -= event.deltaX;
      this.panY -= event.deltaY;
      this.selectionManager.setZoom(this.zoom);
      this.notifyViewportChange();
      this.clearCanvas();
    }
  };

  /** Converts screen-space coordinates to world-space coordinates */
  private screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - this.panX) / this.zoom,
      y: (screenY - this.panY) / this.zoom,
    };
  }

  /** Zoom toward/away from a screen-space point */
  private zoomAt(screenX: number, screenY: number, factor: number) {
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 3;
    const newZoom = Math.min(Math.max(this.zoom * factor, MIN_ZOOM), MAX_ZOOM);
    // Keep the world point under the cursor fixed
    this.panX = screenX - (screenX - this.panX) * (newZoom / this.zoom);
    this.panY = screenY - (screenY - this.panY) * (newZoom / this.zoom);
    this.zoom = newZoom;
    this.selectionManager.setZoom(this.zoom);
    this.notifyViewportChange();
    this.clearCanvas();
  }

  /** Zoom toward/away from the center of the viewport */
  public zoomBy(factor: number) {
    this.zoomAt(this.canvas.width / 2, this.canvas.height / 2, factor);
  }

  /** Reset pan and zoom to default */
  public resetViewport() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.selectionManager.setZoom(1);
    this.notifyViewportChange();
    this.clearCanvas();
  }

  public getZoom(): number {
    return this.zoom;
  }

  private notifyViewportChange() {
    useViewportStore.getState().setZoom(this.zoom);
  }

  /**
   * Deletes selected shapes
   */
  private deleteSelectedShape() {
    const selectedShape = this.selectionManager.getSelectedShape();
    if (selectedShape) {
      // Remove the selected shape from existingShapes
      this.existingShapes = this.existingShapes.filter(
        shape => shape.id !== selectedShape.id,
      );

      this.sendMessage({
        type: 'canvas:erase',
        room: this.roomId,
        shapeId: selectedShape.id,
      });

      // Clear selection
      this.selectionManager.setSelectedShape(null);
      this.clearCanvas();
    }
  }

  /**
   * Creates a new ShapeOptions object for new shapes
   */
  private getShapeOptions(): ShapeOptions {
    return {
      roughness: this.roughness,
      strokeStyle: this.strokeStyle,
      strokeWidth: this.strokeWidth,
      fillStyle: this.fillStyle,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      seed: this.seed,
    };
  }

  /**
   * Converts ShapeOptions to RoughJS format
   */
  private convertToRoughOptions(options: ShapeOptions) {
    // Divide strokeWidth by zoom so strokes appear the same thickness
    // regardless of zoom level (Excalidraw-style constant visual stroke).
    return {
      roughness: this.roughnessLevels[options.roughness],
      stroke: options.strokeColor,
      strokeWidth: this.strokeWidths[options.strokeWidth] / this.zoom,
      fill: options.fillColor,
      fillStyle: options.fillStyle,
      strokeLineDash: this.strokeStyles[options.strokeStyle].map(v => v / this.zoom),
      seed: options.seed,
    };
  }

  /**
   * Handles pointer down events for drawing and selection
   */
  private pointerDownHandler = (event: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    // Middle mouse button or space+drag → pan
    if (event.button === 1 || this.isSpaceDown) {
      this.isPanning = true;
      this.panLastX = screenX;
      this.panLastY = screenY;
      this.canvas.style.cursor = 'grabbing';
      return;
    }

    const { x: worldX, y: worldY } = this.screenToWorld(screenX, screenY);
    this.x1 = worldX;
    this.y1 = worldY;

    if (this.selectedTool === 'Text') {
      this.startTextInput(event.clientX, event.clientY);
      return;
    }

    if (this.selectedTool === 'Eraser') {
      this.isErasing = true;
      this.lastEraserScreenX = screenX;
      this.lastEraserScreenY = screenY;
      this.eraseAtPoint(this.x1, this.y1);
      this.clearCanvas();
      this.drawEraserCursor(screenX, screenY);
      return;
    }

    if (this.selectedTool === 'Freehand') {
      this.isDrawingFreehand = true;
      this.paths = [[this.x1, this.y1]];
      this.pressures = [event.pressure || 0.5];
      return;
    }

    if (this.selectedTool === 'Selection') {
      // Check if clicking on text shape
      const textShape = this.existingShapes.find(
        shape =>
          shape.type === 'Text' &&
          this.x1 >= shape.x1 &&
          this.x1 <= shape.x2 &&
          this.y1 >= shape.y1 &&
          this.y1 <= shape.y2,
      );

      if (textShape) {
        this.selectionManager.setSelectedShape(textShape);
        this.action = 'moving';
        this.selectionManager.beginDrag();
        return;
      }

      // Check if clicking on rotation handle of the currently selected shape
      if (
        this.selectionManager.getSelectedShape() &&
        this.selectionManager.isNearRotationHandle(this.x1, this.y1)
      ) {
        this.action = 'rotating';
        this.selectionManager.beginRotation();
        return;
      }

      // Check if clicking on resize handle of the currently selected shape
      const handle =
        this.selectionManager.getSelectedShape() &&
        this.selectionManager.getResizeHandleAtPoint(this.x1, this.y1);

      if (handle) {
        this.action = 'resizing';
        this.selectionManager.beginResize(handle);
      } else {
        // Check if clicking on existing shape
        const shape = this.selectionManager.getShapeAtPoint(
          this.x1,
          this.y1,
          this.existingShapes,
        );

        // Get currently selected shape
        const currentlySelected = this.selectionManager.getSelectedShape();

        if (shape) {
          // Only set as selected if it's a different shape than currently selected
          if (!currentlySelected || currentlySelected.id !== shape.id) {
            this.selectionManager.setSelectedShape(shape);
          }

          this.action = 'moving';
          this.selectionManager.beginDrag();
        } else {
          // If not clicking on any shape, start marquee selection and clear current selection
          this.action = 'marquee-selecting';
          this.selectionManager.beginMarqueeSelection(this.x1, this.y1);

          // Clear selection if clicking on empty space
          if (currentlySelected) {
            this.selectionManager.setSelectedShape(null);
          }
        }
      }
    } else {
      // Begin drawing new shape
      this.action = 'drawing';
    }
  };

  /**
   * Handles pointer move events for drawing, moving, and resizing
   */
  private pointerMoveHandler = (event: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    // Handle panning
    if (this.isPanning) {
      this.panX += screenX - this.panLastX;
      this.panY += screenY - this.panLastY;
      this.panLastX = screenX;
      this.panLastY = screenY;
      this.notifyViewportChange();
      this.clearCanvas();
      return;
    }

    const { x: worldX, y: worldY } = this.screenToWorld(screenX, screenY);

    // Only handle eraser if the pointer is actually over the canvas
    if (this.selectedTool === 'Eraser') {
      const isOverCanvas =
        screenX >= 0 &&
        screenX <= this.canvas.width &&
        screenY >= 0 &&
        screenY <= this.canvas.height;

      if (isOverCanvas) {
        if (this.isErasing) {
          this.eraseAtPoint(worldX, worldY);
        }
        this.lastEraserScreenX = screenX;
        this.lastEraserScreenY = screenY;
        this.clearCanvas();
        this.drawEraserCursor(screenX, screenY);
      } else {
        this.lastEraserScreenX = -1;
        this.clearCanvas();
      }
      return;
    }

    if (this.selectedTool === 'Freehand' && this.isDrawingFreehand) {
      this.paths.push([worldX, worldY]);
      this.pressures.push(event.pressure || 0.5);
      this.clearCanvas();
      this.drawFreehandPath();
      return;
    }

    // Update cursor style based on what's under the cursor
    if (!this.isSpaceDown) {
      this.selectionManager.updateCursor(worldX, worldY);
    }

    if (this.action === 'drawing') {
      this.x2 = worldX;
      this.y2 = worldY;
      this.clearCanvas();
      this.previewShape();
    } else if (
      this.action === 'moving' &&
      this.selectionManager.getSelectedShape()
    ) {
      const deltaX = worldX - this.x1;
      const deltaY = worldY - this.y1;
      this.selectionManager.updateDrag(deltaX, deltaY);
      this.x1 = worldX;
      this.y1 = worldY;
      this.clearCanvas();
    } else if (this.action === 'resizing') {
      const deltaX = worldX - this.x1;
      const deltaY = worldY - this.y1;
      this.selectionManager.updateResize(deltaX, deltaY);
      this.x1 = worldX;
      this.y1 = worldY;
      this.clearCanvas();
    } else if (this.action === 'rotating') {
      this.selectionManager.updateRotation(worldX, worldY);
      this.clearCanvas();
    } else if (this.action === 'marquee-selecting') {
      this.selectionManager.updateMarqueeSelection(worldX, worldY);
      this.clearCanvas();
    }
  };

  /**
   * Handles pointer up events to finalize drawing, moving, or resizing
   */
  private pointerUpHandler = (event: PointerEvent) => {
    // End panning
    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.style.cursor = this.isSpaceDown ? 'grab' : 'default';
      return;
    }

    if (this.selectedTool === 'Eraser') {
      this.isErasing = false;
      this.lastEraserScreenX = -1;
      this.clearCanvas();
      return;
    }

    if (this.selectedTool === 'Freehand' && this.isDrawingFreehand) {
      this.isDrawingFreehand = false;
      if (this.paths.length > 1) {
        const newShape: Shape = {
          id: cuid(),
          type: 'Freehand',
          x1: this.paths[0][0],
          y1: this.paths[0][1],
          x2: this.paths[this.paths.length - 1][0],
          y2: this.paths[this.paths.length - 1][1],
          paths: this.paths,
          pressures: this.pressures,
          options: this.getShapeOptions(),
        };

        this.existingShapes.push(newShape);
        this.sendMessage({
          type: 'canvas:draw',
          room: this.roomId,
          data: newShape,
        });
      }
      this.paths = [];
      this.pressures = [];
      this.clearCanvas();
      return;
    }

    if (this.action === 'drawing') {
      const rect = this.canvas.getBoundingClientRect();
      const screenX = event.clientX - rect.left;
      const screenY = event.clientY - rect.top;
      const { x: worldX, y: worldY } = this.screenToWorld(screenX, screenY);
      this.x2 = worldX;
      this.y2 = worldY;
      this.drawShape();
    } else if (this.action === 'moving') {
      this.selectionManager.getSelectedShape();
      this.selectionManager.endDrag();
    } else if (this.action === 'resizing') {
      this.selectionManager.getSelectedShape();
      this.selectionManager.endResize();
    } else if (this.action === 'rotating') {
      this.selectionManager.getSelectedShape();
      this.selectionManager.endRotation();
    } else if (this.action === 'marquee-selecting') {
      this.selectionManager.completeMarqueeSelection(this.existingShapes);
    }

    this.action = 'none';
    this.clearCanvas();
  };

  /**
   * Shows a preview of the shape while drawing
   */
  private previewShape() {
    const shapeOptions = this.getShapeOptions();
    const roughOptions = this.convertToRoughOptions(shapeOptions);
    const drawable = this.generateDrawableFromShapeData(
      {
        id: 'preview',
        type: this.selectedTool,
        x1: this.x1,
        y1: this.y1,
        x2: this.x2,
        y2: this.y2,
        options: shapeOptions,
      },
      roughOptions,
    );

    // Apply viewport transform for preview rendering in world space
    this.context.save();
    this.context.translate(this.panX, this.panY);
    this.context.scale(this.zoom, this.zoom);

    if (Array.isArray(drawable)) {
      drawable.forEach(d => this.rc.draw(d));
    } else if (drawable) {
      this.rc.draw(drawable);
    }

    this.context.restore();
  }

  /**
   * Creates and adds a new shape to the canvas
   */
  private drawShape() {
    if (
      ['Rectangle', 'Diamond', 'Ellipse', 'Arrow', 'Line'].includes(
        this.selectedTool,
      )
    ) {
      if (!(this.x1 === this.x2 && this.y1 === this.y2)) {
        const newShape: Shape = {
          id: cuid(),
          type: this.selectedTool as Tool,
          x1: this.x1,
          y1: this.y1,
          x2: this.x2,
          y2: this.y2,
          rotation: 0, // Default rotation
          options: this.getShapeOptions(),
        };

        this.existingShapes.push(newShape);

        this.sendMessage({
          type: 'canvas:draw',
          room: this.roomId,
          data: newShape,
        });

        this.clearCanvas();
      }
    }
  }

  /**
   * Redraws all shapes on the canvas
   */
  private drawAllShapes() {
    this.existingShapes.forEach(shape => {
      if (shape.type === 'Freehand' && shape.paths) {
        this.context.save();
        this.context.fillStyle = shape.options.strokeColor;
        this.context.beginPath();

        const stroke = getStroke(shape.paths, {
          size:
            ((this.strokeWidths[shape.options.strokeWidth] + 1) *
            3 *
            (shape.pressures
              ? 1 +
                shape.pressures.reduce((a, b) => a + b, 0) /
                  shape.pressures.length
              : 1)) / this.zoom,
          thinning:
            0.5 +
            (shape.pressures
              ? (shape.pressures.reduce((a, b) => a + b, 0) /
                  shape.pressures.length) *
                0.5
              : 0),
          smoothing: 0.5,
          streamline: 0.5,
          simulatePressure: true,
          easing: t => t,
          start: {
            taper: 0,
            cap: true,
            easing: t => t,
          },
          end: {
            taper: 0,
            cap: true,
            easing: t => t,
          },
        });

        for (let i = 0; i < stroke.length; i++) {
          const [x, y] = stroke[i];
          if (i === 0) {
            this.context.moveTo(x, y);
          } else {
            this.context.lineTo(x, y);
          }
        }

        this.context.closePath();
        this.context.fill();
        this.context.restore();
      } else if (shape.type === 'Text' && shape.text) {
        this.context.save();
        this.context.font = '32px Comic Sans MS, cursive';
        this.context.fillStyle = shape.options.strokeColor;
        this.context.textBaseline = 'top';
        this.context.textAlign = 'left';

        // Add subtle shadow for better visibility
        this.context.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.context.shadowBlur = 2;
        this.context.shadowOffsetX = 1;
        this.context.shadowOffsetY = 1;
        this.context.fillText(shape.text, shape.x1, shape.y1);

        this.context.restore();
      } else {
        // Generate drawable from shape data using the shape's own options
        const roughOptions = this.convertToRoughOptions(shape.options);
        const drawable = this.generateDrawableFromShapeData(
          shape,
          roughOptions,
        );

        // Apply rotation if needed
        if (shape.rotation) {
          this.context.save();
          const centerX = (shape.x1 + shape.x2) / 2;
          const centerY = (shape.y1 + shape.y2) / 2;
          this.context.translate(centerX, centerY);
          this.context.rotate((shape.rotation * Math.PI) / 180);
          this.context.translate(-centerX, -centerY);
        }

        // Draw the shape
        if (Array.isArray(drawable)) {
          drawable.forEach(d => this.rc.draw(d));
        } else if (drawable) {
          this.rc.draw(drawable);
        }

        if (shape.rotation) {
          this.context.restore();
        }
      }
    });
  }

  /**
   * Generates a drawable from shape data
   */
  private generateDrawableFromShapeData(
    shape: Shape,
    options: {
      roughness: number;
      stroke: string;
      strokeWidth: number;
      fill: string;
      fillStyle: 'solid' | 'hachure' | 'cross-hatch';
      strokeLineDash: number[] | never[];
      seed: number;
    },
  ): Drawable | Drawable[] {
    switch (shape.type) {
      case 'Rectangle':
        return this.generator.rectangle(
          Math.min(shape.x1, shape.x2),
          Math.min(shape.y1, shape.y2),
          Math.abs(shape.x2 - shape.x1),
          Math.abs(shape.y2 - shape.y1),
          options,
        );
      case 'Diamond': {
        const centerX = (shape.x1 + shape.x2) / 2;
        const centerY = (shape.y1 + shape.y2) / 2;
        const width = Math.abs(shape.x2 - shape.x1);
        const height = Math.abs(shape.y2 - shape.y1);
        const points: [number, number][] = [
          [centerX, centerY - height / 2],
          [centerX + width / 2, centerY],
          [centerX, centerY + height / 2],
          [centerX - width / 2, centerY],
        ];
        return this.generator.polygon(points, options);
      }
      case 'Ellipse': {
        const centerX = (shape.x1 + shape.x2) / 2;
        const centerY = (shape.y1 + shape.y2) / 2;
        return this.generator.ellipse(
          centerX,
          centerY,
          Math.abs(shape.x2 - shape.x1),
          Math.abs(shape.y2 - shape.y1),
          options,
        );
      }
      case 'Line':
        return this.generator.line(
          shape.x1,
          shape.y1,
          shape.x2,
          shape.y2,
          options,
        );
      case 'Arrow': {
        const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
        const arrowSize = 16;
        const arrowLeftX = shape.x2 - arrowSize * Math.cos(angle - Math.PI / 6);
        const arrowLeftY = shape.y2 - arrowSize * Math.sin(angle - Math.PI / 6);
        const arrowRightX =
          shape.x2 - arrowSize * Math.cos(angle + Math.PI / 6);
        const arrowRightY =
          shape.y2 - arrowSize * Math.sin(angle + Math.PI / 6);

        return [
          this.generator.line(shape.x1, shape.y1, shape.x2, shape.y2, options),
          this.generator.line(
            shape.x2,
            shape.y2,
            arrowLeftX,
            arrowLeftY,
            options,
          ),
          this.generator.line(
            shape.x2,
            shape.y2,
            arrowRightX,
            arrowRightY,
            options,
          ),
        ];
      }
      default:
        return this.generator.rectangle(0, 0, 0, 0, options); // Fallback
    }
  }

  /**
   * Clears the canvas and redraws all shapes and selection outlines
   */
  public clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.save();

    // Apply viewport transform: translate then scale
    this.context.translate(this.panX, this.panY);
    this.context.scale(this.zoom, this.zoom);

    this.drawAllShapes();

    // Draw selection outline for selected shape
    const selectedShape = this.selectionManager.getSelectedShape();
    if (selectedShape) {
      this.selectionManager.drawSelectionOutline(selectedShape);
    }

    // Draw marquee selection if active
    this.selectionManager.drawMarqueeSelection();

    this.context.restore();

    // Draw eraser cursor in screen space (outside viewport transform)
    if (this.selectedTool === 'Eraser' && this.lastEraserScreenX >= 0) {
      this.drawEraserCursor(this.lastEraserScreenX, this.lastEraserScreenY);
    }
  }

  /**
   * Sets the current drawing tool
   */
  public setSelectedTool(tool: Tool) {
    this.selectedTool = tool;

    // When switching to Selection tool, maintain current selection
    // When switching to other tools, clear selection
    if (tool !== 'Selection') {
      this.selectionManager.setSelectedShape(null);
      this.clearCanvas();
    }
  }

  public getSelectedTool() {
    return this.selectedTool;
  }

  /**
   * Sets the stroke style (solid, dashed, dotted)
   */
  public setStrokeStyle(style: 'solid' | 'dashed' | 'dotted') {
    this.strokeStyle = style;
    this.updateSelectedShapeStyle();
  }

  /**
   * Sets the stroke width (thin, medium, thick)
   */
  public setStrokeWidth(width: 'thin' | 'medium' | 'thick') {
    this.strokeWidth = width;
    this.updateSelectedShapeStyle();
  }

  /**
   * Sets the roughness level (none, normal, high)
   */
  public setRoughness(level: 'none' | 'normal' | 'high') {
    this.roughness = level;
    this.updateSelectedShapeStyle();
  }

  /**
   * Sets the fill style (hachure, solid, cross-hatch)
   */
  public setFillStyle(style: 'hachure' | 'solid' | 'cross-hatch') {
    this.fillStyle = style;
    this.updateSelectedShapeStyle();
  }

  /**
   * Sets the stroke color
   */
  public setStrokeColor(color: string) {
    this.strokeColor = color;
    this.updateSelectedShapeStyle();
  }

  /**
   * Sets the fill color
   */
  public setFillColor(color: string) {
    this.fillColor = color;
    this.updateSelectedShapeStyle();
  }

  /**
   * Gets all shapes on the canvas
   */
  public getAllShapes() {
    return this.existingShapes;
  }

  /**
   * Gets the currently selected shape
   */
  public getSelectedShape(): Shape | null {
    return this.selectionManager.getSelectedShape();
  }

  /**
   * Updates the style of the currently selected shape
   */
  private updateSelectedShapeStyle() {
    const selectedShape = this.selectionManager.getSelectedShape();
    if (!selectedShape) return;

    // Check if any style property has actually changed
    const hasStyleChanged =
      selectedShape.options.roughness !== this.roughness ||
      selectedShape.options.strokeStyle !== this.strokeStyle ||
      selectedShape.options.strokeWidth !== this.strokeWidth ||
      selectedShape.options.fillStyle !== this.fillStyle ||
      selectedShape.options.fillColor !== this.fillColor ||
      selectedShape.options.strokeColor !== this.strokeColor;

    // Only update and send message if something changed
    if (hasStyleChanged) {
      // Update the options object with current style settings
      selectedShape.options = {
        ...selectedShape.options,
        roughness: this.roughness,
        strokeStyle: this.strokeStyle,
        strokeWidth: this.strokeWidth,
        fillStyle: this.fillStyle,
        fillColor: this.fillColor,
        strokeColor: this.strokeColor,
      };

      this.sendMessage({
        type: 'canvas:update',
        room: this.roomId,
        data: selectedShape,
      });

      this.clearCanvas();
    }
  }

  /**
   * Selects all shapes on the canvas
   */
  public selectAll() {
    if (this.existingShapes.length > 0) {
      // Just select the top-most shape (last in the array)
      const topShape = this.existingShapes[this.existingShapes.length - 1];
      this.selectionManager.setSelectedShape(topShape);
      this.clearCanvas();
    }
  }

  /**
   * Erases shapes at the specified point
   */
  private eraseAtPoint(x: number, y: number): void {
    if (!this.eraser) return;

    // Make sure eraser has the latest shapes
    this.eraser = new Eraser(this.context, this.existingShapes);
    this.eraser.setEraserSize(this.eraserSize);

    // Check each shape to see if it intersects with the eraser
    const shapesToErase: Shape[] = [];
    const remainingShapes: Shape[] = [];

    this.existingShapes.forEach(shape => {
      if (shape.type === 'Freehand' && shape.paths) {
        // For freehand shapes, check if any point is within eraser radius
        const isErased = shape.paths.some(point => {
          const distance = Math.sqrt(
            Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2),
          );
          return distance <= this.eraserSize / 2;
        });

        if (isErased) {
          shapesToErase.push(shape);
        } else {
          remainingShapes.push(shape);
        }
      } else if (shape.type === 'Text') {
        // Check if the eraser point is within the text bounds
        const isWithinText =
          x >= shape.x1 && x <= shape.x2 && y >= shape.y1 && y <= shape.y2;

        if (isWithinText) {
          shapesToErase.push(shape);
        } else {
          remainingShapes.push(shape);
        }
      } else {
        // For other shapes, use the existing eraser logic
        const currentEraser = this.eraser;
        if (currentEraser) {
          const erasedShapes = currentEraser.erase(x, y);
          const isErased = !erasedShapes.some(erased => erased.id === shape.id);

          if (isErased) {
            shapesToErase.push(shape);
          } else {
            remainingShapes.push(shape);
          }
        }
      }
    });

    // Send erase messages for each erased shape
    shapesToErase.forEach(shape => {
      this.sendMessage({
        type: 'canvas:erase',
        room: this.roomId,
        shapeId: shape.id,
      });
    });

    // Update existing shapes
    this.existingShapes = remainingShapes;

    // Redraw canvas
    this.clearCanvas();
  }

  /**
   * Draws the eraser cursor
   */
  private drawEraserCursor(x: number, y: number): void {
    this.context.save();
    this.context.strokeStyle = 'white';
    this.context.lineWidth = 1;
    // this.context.setLineDash([3, 3]); // Make the cursor more visible
    this.context.beginPath();
    this.context.arc(x, y, this.eraserSize / 2, 0, Math.PI * 2);
    this.context.stroke();
    this.context.restore();
  }

  /**
   * Sets the eraser size
   */
  public setEraserSize(size: number): void {
    this.eraserSize = size;
    if (this.eraser) {
      this.eraser.setEraserSize(size);
    }
  }

  // handle OnMessageEvent of WebSocket
  public onDrawMessage(data: Shape) {
    this.existingShapes.push(data);
    this.clearCanvas();
  }

  public OnUpdateMessage(data: Shape): void {
    const index = this.existingShapes.findIndex(shape => shape.id === data.id);
    if (index !== -1) {
      this.existingShapes[index] = { ...this.existingShapes[index], ...data };
      this.clearCanvas();
    }
  }

  public onEraseMessage(shapeId: string): void {
    const index = this.existingShapes.findIndex(shape => shape.id === shapeId);
    console.log('erase');
    if (index !== -1) {
      this.existingShapes.splice(index, 1);
      this.clearCanvas();
    }
  }

  public OnClearMessage() {
    console.log('clearCanvas');
    this.existingShapes = [];
    this.clearCanvas();
  }

  private drawFreehandPath() {
    if (this.paths.length < 2) return;

    const avgPressure =
      this.pressures.reduce((a, b) => a + b, 0) / this.pressures.length;

    const stroke = getStroke(this.paths, {
      size: (this.strokeWidths[this.strokeWidth] + 1) * 3 * (1 + avgPressure) / this.zoom,
      thinning: 0.5 + avgPressure * 0.5,
      smoothing: 0.5,
      streamline: 0.5,
      simulatePressure: true,
      easing: t => t,
      start: { taper: 0, cap: true, easing: t => t },
      end: { taper: 0, cap: true, easing: t => t },
    });

    this.context.save();
    // Apply viewport transform so in-progress freehand renders in world space
    this.context.translate(this.panX, this.panY);
    this.context.scale(this.zoom, this.zoom);
    this.context.fillStyle = this.strokeColor;
    this.context.beginPath();

    for (let i = 0; i < stroke.length; i++) {
      const [x, y] = stroke[i];
      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    }

    this.context.closePath();
    this.context.fill();
    this.context.restore();
  }

  public cleanCanvas() {
    this.existingShapes = [];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private cleanupTextInput() {
    if (!this.textInput) return;

    // Store the reference to the text input
    const textInput = this.textInput;

    // Reset the state variables first
    this.textInput = null;
    this.isTextInputActive = false;

    // Then try to remove the element if it still exists
    try {
      if (textInput.parentNode) {
        textInput.remove();
      }
    } catch (error) {
      console.warn('Error during text input cleanup:', error);
    }
  }

  private startTextInput(x: number, y: number) {
    // First, ensure any existing text input is properly cleaned up
    this.cleanupTextInput();

    // const rect =
    this.canvas.getBoundingClientRect();
    // const canvasX = x - rect.left;
    // const canvasY = y - rect.top;

    // Create new text input
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.style.position = 'absolute';
    textInput.style.left = `${x}px`;
    textInput.style.top = `${y}px`;
    textInput.style.fontFamily = 'Comic Sans MS, cursive';
    textInput.style.fontSize = '32px';
    textInput.style.background = 'transparent';
    textInput.style.border = 'none';
    textInput.style.outline = 'none';
    textInput.style.color = this.strokeColor;
    textInput.style.padding = '4px 4px';
    textInput.style.margin = '0';
    textInput.style.width = 'auto';
    textInput.style.minWidth = '50px';
    textInput.style.zIndex = '1000';
    textInput.style.cursor = 'text';
    textInput.style.borderRadius = '4px';
    textInput.style.transition = 'background-color 0.2s';

    // Add to canvas container first
    const canvasContainer = this.canvas.parentElement;
    if (!canvasContainer) return;

    canvasContainer.appendChild(textInput);
    this.textInput = textInput;
    this.isTextInputActive = true;

    // Add event listeners after the element is in the DOM
    const handleBlur = () => {
      if (textInput === this.textInput) {
        this.finishTextInput(textInput);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (textInput === this.textInput) {
          this.finishTextInput(textInput);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.cleanupTextInput();
        this.clearCanvas();
      }
    };

    textInput.addEventListener('blur', handleBlur);
    textInput.addEventListener('keydown', handleKeyDown);

    // Focus after a small delay
    setTimeout(() => {
      if (textInput === this.textInput && textInput.parentNode) {
        textInput.focus();
      }
    }, 0);
  }

  private finishTextInput(textInput: HTMLInputElement) {
    // Only proceed if this is still the current text input
    if (textInput !== this.textInput) return;

    const text = textInput.value.trim();
    if (text) {
      const rect = textInput.getBoundingClientRect();
      const canvasRect = this.canvas.getBoundingClientRect();

      // Convert screen position to world coords
      const screenX = rect.left - canvasRect.left;
      const screenY = rect.top - canvasRect.top;
      const { x: worldX, y: worldY } = this.screenToWorld(screenX, screenY);

      // Measure text width in world units (context is not scaled here so divide by zoom)
      this.context.save();
      this.context.font = '32px Comic Sans MS, cursive';
      const textWidth = this.context.measureText(text).width / this.zoom;
      this.context.restore();

      const textHeight = 40 / this.zoom;

      const newShape: Shape = {
        id: cuid(),
        type: 'Text',
        x1: worldX,
        y1: worldY,
        x2: worldX + textWidth,
        y2: worldY + textHeight,
        text: text,
        options: this.getShapeOptions(),
      };

      this.existingShapes.push(newShape);
      this.sendMessage({
        type: 'canvas:draw',
        room: this.roomId,
        data: newShape,
      });
    }

    this.cleanupTextInput();
    this.clearCanvas();
  }
}
