// Zoom is now managed by CanvasEngine and viewport.store.
// This hook is kept for backwards compatibility but is no longer the source of truth.
export { useViewportStore as useZoom } from '@/stores/viewport.store';
