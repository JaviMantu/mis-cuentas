// work/006: la interfaz la decide el dispositivo (capacidad de entrada), no solo el ancho.
// La misma regla vive, sin imports, en el script inline de index.html para evitar el destello inicial.
export const UIS = ['desktop', 'mobile'];
export const DESKTOP_MIN = 900;

export function uiFor({ hover, fine, width, override }) {
  if (UIS.includes(override)) return override;
  return hover && fine && width >= DESKTOP_MIN ? 'desktop' : 'mobile';
}
