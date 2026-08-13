export function createSlug(title) {
  if (!title) return "";

  const baseSlug = title
    .toLowerCase()
    .normalize("NFD") // Separa las letras de los acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .replace(/[^a-z0-9 -]/g, "") // Elimina caracteres especiales (mantiene letras, números y guiones)
    .trim()
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .replace(/-+/g, "-"); // Evita guiones dobles (ej: mi---titulo -> mi-titulo)

  // Le agregamos un código corto al final (ej: -a7b2) para evitar que dos 
  // artículos con el mismo título rompan la base de datos por duplicidad.
  const uniqueSuffix = Math.random().toString(36).substring(2, 6);
  
  return `${baseSlug}-${uniqueSuffix}`;
}