export type FieldType = 'text' | 'multiline';

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export type EditorMode = 'select' | 'draw';

export interface PdfField {
  id: string;
  name: string;
  type: FieldType;
  page: number; // 1-indexed
  // Normalised 0–1, relative to page dimensions, top-left origin
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DragState = {
  kind: 'move' | 'resize';
  fieldId: string;
  handle?: ResizeHandle;
  startMX: number;
  startMY: number;
  canvasW: number;
  canvasH: number;
  orig: PdfField;
};
