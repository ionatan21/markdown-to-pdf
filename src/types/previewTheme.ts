export interface PreviewTheme {
  fontFamily: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  colors: {
    heading: string;
    body: string;
    table: string;
  };
}

export const DEFAULT_PREVIEW_THEME: PreviewTheme = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: 16,
  textAlign: 'left',
  colors: {
    heading: '#111827',
    body: '#111827',
    table: '#111827',
  },
};
