#  Documentación - Observatorio CITE

Una réplica del sitio "Observatorio CITE" construida con **Next.js 14 (App Router)**, **React 18**, **MongoDB** y **Tailwind CSS**.

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Configuración Inicial](#configuración-inicial)
4. [Bases de Datos y Modelos](#bases-de-datos-y-modelos)
5. [APIs y Rutas](#apis-y-rutas)
6. [Componentes React](#componentes-react)
7. [Hooks Personalizados](#hooks-personalizados)
8. [Utilidades](#utilidades)
9. [Autenticación](#autenticación)
10. [Sistema de Citación APA](#sistema-de-citación-apa)

---

##  Descripción General

Este proyecto es una plataforma web para gestionar y consultar artículos, libros, tesis y otros recursos informativos. Incluye:

- **Lectura de recursos**: Búsqueda y filtrado de artículos por categoría, autor, año, tipo
- **Panel de administración**: Crear, editar y eliminar recursos (protegido por autenticación)
- **Citaciones en APA 7**: Generación automática de referencias bibliográficas
- **Responsive Design**: Interfaz adaptable a dispositivos móviles

---

## Estructura del Proyecto

```
observatorio-cite/
├── app/                          # Rutas de Next.js (App Router)
│   ├── api/
│   │   ├── articles/            # CRUD de artículos
│   │   │   ├── route.js         # GET/POST artículos
│   │   │   └── [id]/route.js    # GET/PUT/DELETE por ID
│   │   ├── categories/route.js  # Categorías disponibles
│   │   ├── login/route.js       # Autenticación
│   │   └── logout/route.js      # Cierre de sesión
│   ├── admin/
│   │   ├── layout.js            # Layout del panel admin
│   │   └── page.jsx             # Panel de administración
│   ├── articles/[slug]/
│   │   ├── page.jsx             # Detalle de artículo
│   │   ├── error.jsx            # Error boundary
│   │   └── loading.jsx          # Skeleton loader
│   ├── linea-tiempo/page.jsx    # Timeline
│   ├── recursos-informativos/page.jsx # Biblioteca
│   ├── login/page.jsx           # Login
│   ├── layout.js                # Layout raíz
│   └── page.js                  # Página principal
├── components/                   # Componentes React reutilizables
│   ├── Header.jsx               # Encabezado con navegación
│   ├── Hero.jsx                 # Sección héroe
│   ├── Library.jsx              # Biblioteca de recursos
│   ├── DocumentCard.jsx         # Tarjeta de documento
│   ├── AdminForm.jsx            # Formulario de admin
│   ├── AdminTable.jsx           # Tabla de artículos
│   ├── ArticleDetail.jsx        # Detalles del artículo
│   ├── ArticleAPA.jsx           # Bloque de citación APA
│   ├── ArticleHeader.jsx        # Encabezado de artículo
│   ├── LibraryFilters.jsx       # Filtros de búsqueda
│   ├── LibraryPagination.jsx    # Paginación
│   └── ... más componentes
├── models/                       # Esquemas de Mongoose
│   ├── Article.js               # Modelo de artículos
│   └── Admin.js                 # Modelo de administradores
├── lib/                          # Utilidades y configuración
│   ├── mongodb.js               # Conexión a MongoDB (caché)
│   ├── auth.js                  # Verificación de sesión JWT
│   └── citations.js             # Generación de referencias APA
├── hooks/                        # React Hooks personalizados
│   └── useCardsPerView.js       # Calcula columnas responsive
├── utils/                        # Funciones auxiliares
│   └── slugify.js               # Generador de slugs
└── public/                       # Archivos estáticos
    └── logo_cite_letras.svg     # Logo
```

---

## Configuración Inicial

### 1. Instalación de Dependencias

```bash
npm install
```

**Dependencias principales:**
- `next@14.2.15` - Framework React
- `mongoose@9.8.0` - ODM para MongoDB
- `bcryptjs@3.0.3` - Encriptación de contraseñas
- `jose@6.2.10` - Manejo de JWT
- `framer-motion@13.1.0` - Animaciones
- `tailwindcss@3.4.13` - Estilos

### 2. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/observatorio_cite?retryWrites=true&w=majority
MONGODB_DB=observatorio_cite

# Autenticación JWT
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura

# Entorno
NODE_ENV=development
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 4. Construir para Producción

```bash
npm run build
npm start
```

---

## Bases de Datos y Modelos

### Modelo: Article

**Archivo:** `models/Article.js`

Define la estructura de artículos con campos para diferentes tipos de recursos (artículos, libros, tesis, informes, ponencias, recursos educativos).

**Campos principales:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `title` | String | Título del recurso (requerido) |
| `author` | [String] | Lista de autores (requerido) |
| `description` | String | Descripción breve (requerido) |
| `content` | String | Contenido completo (requerido) |
| `category` | String | Categoría (requerido) |
| `slug` | String | Identificador URL amigable (requerido) |
| `published` | Boolean | Estado de publicación (default: false) |
| `typeOfComponent` | String | Tipo de recurso (enum) |
| `dateOfPublication` | Date | Fecha de publicación (requerido) |
| `imageUrl` | String | URL de imagen principal |

**Campos para Citación APA:**

```
Para Revistas Científicas:
- journalName: Nombre de la revista
- volume: Volumen
- issue: Número de la revista
- pages: Páginas

Para Libros:
- publisher: Editorial
- edition: Edición

Para Tesis:
- degree: Grado académico
- institution: Institución

Para Informes:
- reportNumber: Número de reporte
- institution: Institución

Para Congresos:
- conferenceName: Nombre del congreso
- location: Ubicación

Para Recursos Educativos:
- materialType: Tipo de material

Compartido:
- doiOrUrl: DOI o URL persistente
```

**Valores Válidos para `typeOfComponent`:**

```javascript
[
  "article",
  "book",
  "thesis",
  "report",
  "journal_article",
  "educational_resource",
  "conference_paper",
  "other"
]
```

### Modelo: Admin

**Archivo:** `models/Admin.js`

Define la estructura de usuarios administradores.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `email` | String | Email único (requerido, única) |
| `password` | String | Contraseña encriptada (requerido) |
| `role` | String | Rol del usuario (default: "ADMIN") |
| `timestamps` | - | Fechas de creación y actualización |

---

##  APIs y Rutas

### GET /api/articles

Obtiene artículos con filtros y paginación.

**Parámetros de Query:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `q` | string | Búsqueda de texto en título, descripción, categoría, autor |
| `category` | string | Filtrar por categoría exacta |
| `author` | string | Filtrar por autor (búsqueda parcial) |
| `year` | number | Filtrar por año de publicación |
| `typeOfComponent` | string | Filtrar por tipo de recurso |
| `page` | number | Número de página (default: 1) |
| `limit` | number | Registros por página (default: 6) |
| `sort` | string | Ordenamiento: `recent`, `oldest`, `title_asc`, `title_desc` |

**Ejemplo:**

```bash
GET /api/articles?q=inteligencia&category=Tecnología&year=2024&page=1&limit=10
```

**Respuesta:**

```json
{
  "data": [
    {
      "_id": "123abc",
      "title": "Inteligencia Artificial",
      "author": ["García, J."],
      "category": "Tecnología",
      "slug": "inteligencia-artificial",
      ...
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 5
}
```

### POST /api/articles

Crear un nuevo artículo (requiere autenticación de admin).

**Body:**

```json
{
  "title": "Título del Artículo",
  "author": ["García, Juan", "López, María"],
  "description": "Descripción breve",
  "content": "Contenido completo",
  "category": "Tecnología",
  "typeOfComponent": "article",
  "dateOfPublication": "2024-01-15",
  "imageUrl": "https://...",
  "journalName": "Revista Científica",
  "volume": "15",
  "pages": "10-25"
}
```

**Respuesta (201):**

```json
{
  "_id": "123abc",
  "title": "Título del Artículo",
  "slug": "titulo-del-articulo",
  ...
}
```

### PUT/DELETE /api/articles/[id]

Actualizar o eliminar un artículo específico (requiere autenticación).

### GET /api/categories

Obtiene todas las categorías disponibles.

**Respuesta:**

```json
{
  "data": ["Tecnología", "Educación", "Investigación", ...]
}
```

### POST /api/login

Autentica un usuario y genera un token JWT.

**Body:**

```json
{
  "email": "admin@example.com",
  "password": "contraseña123"
}
```

**Respuesta (200):**

```json
{
  "success": true
}
```

Sets a cookie `sesion_token` with the JWT.

### POST /api/logout

Cierra la sesión del usuario (elimina la cookie).

---

##  Componentes React

### Header.jsx

Encabezado sticky con navegación responsive.

**Props:** Ninguno

**Características:**
- Menú responsive (desktop y móvil)
- Logo del CITE
- Enlaces de navegación

**NAV_ITEMS:**

```javascript
[
  { label: "Inicio", href: "/" },
  { label: "Quiénes somos", href: "/quienes-somos" },
  { label: "Informes y estadísticas", href: "/informes-estadisticas" },
  { label: "linea del tiempo", href: "/linea-tiempo" },
  { label: "Recursos informativos", href: "/recursos-informativos" }
]
```

---

### Library.jsx

Componente principal de la biblioteca con búsqueda, filtros y paginación.

**Props:** Ninguno (Client Component)

**Estado:**
- `query` - Texto de búsqueda actual (input)
- `search` - Búsqueda realizada
- `category` - Categoría seleccionada
- `author` - Autor seleccionado
- `year` - Año seleccionado
- `typeFilter` - Tipo de recurso
- `sort` - Criterio de ordenamiento
- `currentPage` - Página actual
- `documentos` - Lista de artículos
- `loading` - Indicador de carga
- `error` - Mensaje de error

**Flujo:**
1. Carga categorías de `/api/categories`
2. Al cambiar filtros, llama `/api/articles` con parámetros
3. Renderiza DocumentCard para cada artículo
4. Muestra paginación si hay múltiples páginas

---

### DocumentCard.jsx

Tarjeta individual de documento.

**Props:**

```typescript
{
  id: string,
  slug: string,
  title: string,
  author: string | string[],
  description: string,
  category: string,
  dateOfPublication: string,
  imageUrl?: string,
  typeOfComponent?: string
}
```

**Render:**
- Imagen del recurso (si existe)
- Título
- Categoría
- Descripción
- Autor y fecha
- Botón "Ver más"

---

### ArticleDetail.jsx

Componente que renderiza los detalles completos de un artículo.

**Props:**

```typescript
{
  slug: string  // Slug del artículo
}
```

**Características:**
- Búsqueda del artículo en BD por slug
- Genera citación APA automáticamente
- Calcula tiempo de lectura
- Muestra imagen principal
- Renderiza contenido en párrafos
- Permite volver a la biblioteca

**Manejo de Errores:**
- Si el artículo no existe → muestra mensaje de error
- Si falla la conexión → muestra error de base de datos

---

### ArticleAPA.jsx

Bloque de citación APA con botones de copiar.

**Props:**

```typescript
{
  citation: string  // Texto de la citación APA 7
}
```

---

### AdminForm.jsx

Formulario para crear/editar artículos en el panel admin.

**Props:**

```typescript
{
  initialData?: Article,
  onSubmit: (data) => Promise<void>,
  isLoading?: boolean
}
```

**Campos:**
- Título, autores (array)
- Descripción, contenido
- Categoría, tipo de componente
- Fecha de publicación
- Campos específicos según tipo (journal, libro, tesis, etc.)

---

### AdminTable.jsx

Tabla de artículos con opciones de editar/eliminar.

**Props:**

```typescript
{
  articles: Article[],
  onEdit: (article) => void,
  onDelete: (id) => Promise<void>,
  isLoading?: boolean
}
```

---

### LibraryFilters.jsx

Componente de filtros avanzados.

**Props:**

```typescript
{
  author: string,
  authors: string[],
  handleAuthorChange: (val) => void,
  typeFilter: string,
  resourceTypes: { id: string, label: string }[],
  handleTypeChange: (val) => void,
  category: string,
  categories: string[],
  handleCategoryChange: (val) => void,
  sort: string,
  handleSortChange: (val) => void,
  year: string,
  handleYearChange: (val) => void,
  hasActiveFilters: boolean,
  clearFilters: () => void
}
```

**Filtros Disponibles:**
- Tipo de recurso (select)
- Categoría (select)
- Autor (input)
- Año (input)
- Ordenamiento (select)
- Botón "Limpiar filtros"

---

### LibraryPagination.jsx

Componente de paginación.

**Props:**

```typescript
{
  currentPage: number,
  totalPages: number,
  setCurrentPage: (page) => void
}
```

---

## Hooks Personalizados

### useCardsPerView()

Hook que calcula el número de columnas para mostrar tarjetas según el tamaño de pantalla.

**Retorna:** `number` (1, 2 o 3)

**Breakpoints:**
- Mobile: 1 columna (< 640px)
- Tablet: 2 columnas (640px - 1023px)
- Desktop: 3 columnas (≥ 1024px)

**Uso:**

```jsx
const cardsPerView = useCardsPerView();

return (
  <div className={`grid grid-cols-${cardsPerView}`}>
    {/* tarjetas */}
  </div>
);
```

---

## Utilidades

### slugify.js

**Función: `createSlug(title: string): string`**

Convierte un título en un slug URL-friendly.

**Ejemplos:**

```javascript
createSlug("Inteligencia Artificial") 
// → "inteligencia-artificial"

createSlug("¿Qué es la IA?") 
// → "que-es-la-ia"

createSlug("Café-Résumé 2024") 
// → "cafe-resume-2024"
```

**Proceso:**
1. Convierte a minúsculas
2. Elimina acentos (NFD normalization)
3. Remueve caracteres especiales
4. Reemplaza espacios con guiones
5. Elimina guiones duplicados

---

##  Autenticación

### lib/auth.js

**Función: `getAdminSession()`**

Verifica la sesión del administrador extrayendo y validando el JWT.

**Retorna:**
- `null` si no hay sesión válida
- `{ id, email, role }` si la sesión es válida

**Proceso:**
1. Lee la cookie `sesion_token`
2. Verifica que exista la variable `JWT_SECRET`
3. Valida el JWT usando `jwtVerify`
4. Verifica que el rol sea "ADMIN"
5. Retorna el payload o null

**Uso:**

```javascript
import { getAdminSession } from "@/lib/auth";

export async function POST(request) {
  const session = await getAdminSession();
  
  if (!session) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }
  
  // Lógica protegida
}
```

---

## Sistema de Citación APA

### lib/citations.js

Generación automática de referencias bibliográficas en formato APA 7.

#### Función: `formatAuthors(authorsInput)`

Formatea autores al estándar APA 7.

**Entrada:**
- String con autores separados por comas o punto y coma
- Array de strings
- Nombre de institución

**Salida:** String con autores formateados

**Ejemplos:**

```javascript
formatAuthors("Juan García López")
// → "García López, J."

formatAuthors("María Rodríguez, Ana Martínez")
// → "Rodríguez, M. & Martínez, A."

formatAuthors("Pedro García, Juan López, Ana Martínez")
// → "García, P., López, J., & Martínez, A."

formatAuthors("Universidad Autónoma de Querétaro")
// → "Universidad Autónoma de Querétaro" (sin cambios)
```

**Reglas:**
- Autores corporativos (contienen: "universidad", "instituto", etc.) se preservan
- Máximo 2 autores: separa con "&"
- 3+ autores: separa con comas y "&" antes del último
- Convierte a formato "Apellido, Inicial."

#### Función: `generateAPA(article, options)`

Genera la referencia bibliográfica completa en APA 7.

**Parámetros:**

```typescript
{
  article: Article,
  options?: {
    asHtml?: boolean  // Si true, itálicas con <i>; si false, con *
  }
}
```

**Retorna:** String con la referencia APA 7 completa

**Formato según tipo de recurso:**

**Artículo de Revista Científica:**

```
Autor(es) (Año). Título del artículo. Revista Científica, vol(issue), páginas. DOI/URL
```

Ejemplo:
```
García, J. (2024). Inteligencia artificial en educación. Revista Científica, 15(3), 10-25.
```

**Libro:**

```
Autor(es) (Año). Título del libro (Edición). Editorial. DOI/URL
```

Ejemplo:
```
López, M. (2023). Machine Learning fundamentals (2da ed.). Tech Publishers.
```

**Tesis:**

```
Autor(es) (Año). Título de la tesis [Grado, Institución]. Repositorio. DOI/URL
```

Ejemplo:
```
Martínez, A. (2022). Análisis de redes neuronales [Tesis de maestría, Universidad Nacional]. DOI: 10.xxxx/xxxxx
```

**Informe/Reporte:**

```
Autor(es) (Año). Título del informe (No. de reporte). Institución. DOI/URL
```

**Ponencia/Conferencia:**

```
Autor(es) (Año). Título de la ponencia [Ponencia]. Nombre del Congreso, Ubicación. DOI/URL
```

**Recurso Educativo:**

```
Autor(es) (Año). Título del recurso [Tipo de Material]. Institución. DOI/URL
```

---

## Responsive Design

El proyecto usa Tailwind CSS con los siguientes breakpoints:

- **sm**: 640px (tablets pequeñas)
- **md**: 768px (tablets)
- **lg**: 1024px (laptops)
- **xl**: 1280px (desktops grandes)

**Ejemplos de uso:**

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {/* 1 columna mobile, 2 en tablet, 3 en desktop */}
</div>
```

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint

# Poblar BD (opcional)
npm run seed
```

---

##  Consideraciones Importantes

### Seguridad

1. **Variables de Entorno**: Nunca comitees `.env.local` con datos sensibles
2. **JWT**: Mantén `JWT_SECRET` seguro y único por ambiente
3. **Contraseñas**: Las contraseñas se hashean con bcryptjs antes de guardar
4. **CORS**: Configura CORS según sea necesario en producción

### Rendimiento

1. **Caché MongoDB**: La conexión se cachea en desarrollo para evitar reconexiones
2. **Lean Queries**: Se usan `.lean()` en consultas de solo lectura
3. **Paginación**: Las búsquedas se paginan (default 6 por página)

### Base de Datos

1. **Conexión**: Usa MongoDB Atlas o una instancia local
2. **Índices**: Considera crear índices en campos frecuentes de búsqueda
3. **Backups**: Implementa backups regulares en producción

---

## Próximas Mejoras Sugeridas

- [ ] Agregar pruebas unitarias (Jest)
- [ ] Implementar upload de imágenes (Cloudinary o S3)
- [ ] Agregar comentarios/reseñas en artículos
- [ ] Sistema de favoritos/guardados
- [ ] Exportar referencias en múltiples formatos (BibTeX, Chicago, etc.)
- [ ] Búsqueda full-text indexada
- [ ] Analytics y estadísticas de uso
- [ ] Multi-idioma (i18n)

---

