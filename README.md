#  Documentación - Observatorio competencias digitales

Una réplica del sitio "Observatorio competencias digitales" construida con **Next.js 14 (App Router)**, **React 18**, **MongoDB** y **Tailwind CSS**.

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
11. [Registro de Cambios](#registro-de-cambios)

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
Observatorio competencias digitales/
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
│   ├── Banner.jsx               # Encabezado: franja con logo + menú turquesa
│   ├── Signature.jsx            # Firma del desarrollador en la consola
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
│   ├── articles.js              # Campos APA, slugs únicos y consulta de artículos publicados
│   └── citations.js             # Generación de referencias APA
├── hooks/                        # React Hooks personalizados
│   └── useCardsPerView.js       # Calcula columnas responsive
├── utils/                        # Funciones auxiliares
│   ├── authors.js               # Separación de autores (sin dependencias)
│   └── slugify.js               # Generador de slugs
└── public/                       # Archivos estáticos
    ├── logos/cite.png           # Logo institucional del banner
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
- `eslint@8` + `eslint-config-next@14.2.15` - Linting (`npm run lint`)

### 2. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/observatorio_cite?retryWrites=true&w=majority
MONGODB_DB=observatorio_cite

# Autenticación JWT (obligatoria: sin ella el login responde 500)
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
| `author` | [String] | Lista de autores (requerido). Ver [separación de autores](#separación-de-autores) |
| `description` | String | Descripción breve (requerido) |
| `content` | String | Contenido completo (requerido) |
| `category` | String | Categoría (requerido) |
| `slug` | String | Identificador URL amigable (requerido, **único**) |
| `published` | Boolean | Estado de publicación (default: false). Con `false` el artículo es un borrador y solo lo ve el admin |
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
| `limit` | number | Registros por página (default: 6, máximo 100; 1000 para el admin) |
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

Los visitantes solo reciben artículos publicados (`published` distinto de `false`); con sesión de admin también se incluyen los borradores.
El resultado se guarda en caché 1 hora con la etiqueta `articles`, que se invalida al crear, editar o borrar un artículo.

### POST /api/articles

Crear un nuevo artículo (requiere autenticación de admin).

- El slug se genera a partir del título; si ya existe se agrega `-2`, `-3`, etc.
- Si falla la validación responde `400` con el detalle; cualquier otro error responde `500` con un mensaje genérico (el detalle solo queda en el log del servidor).

**Body:**

```json
{
  "title": "Título del Artículo",
  "author": "García, J.; López, M.",
  "description": "Descripción breve",
  "content": "Contenido completo",
  "category": "Tecnología",
  "typeOfComponent": "article",
  "dateOfPublication": "2024-01-15",
  "imageUrl": "https://...",
  "journalName": "Revista Científica",
  "volume": "15",
  "issue": "3",
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

### GET /api/articles/[id]

Obtiene un artículo por su `_id` o por su slug. Los borradores responden `404` salvo para el admin.

### PUT/DELETE /api/articles/[id]

Actualizar o eliminar un artículo específico. Requiere una sesión de admin válida: el JWT de la cookie se verifica con `getAdminSession()`; sin él responden `401`.
Al editar, el slug se conserva para no romper enlaces ya compartidos.

### GET /api/categories

Obtiene las categorías de los artículos publicados (caché de 1 hora con la etiqueta `articles`).

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

Guarda el JWT en la cookie `sesion_token` (`httpOnly`, `sameSite: lax`, `secure` en producción, 24 h).

**Errores:**

| Código | Motivo |
|--------|--------|
| `400` | Faltan el correo o la contraseña, o no son texto |
| `401` | Correo o contraseña incorrectos |
| `429` | 5 intentos fallidos desde la misma IP en 15 minutos |
| `500` | Falta `JWT_SECRET` o error interno |

> El límite de intentos se guarda en memoria del servidor. En Vercel cada instancia lleva su propia cuenta, así que es una protección básica.

### POST /api/logout

Cierra la sesión del usuario (elimina la cookie).

---

##  Componentes React

### Banner.jsx

Encabezado de todas las páginas: franja gris con el logo institucional (`public/logos/cite.png`) y barra turquesa con el menú. Reemplaza al antiguo `Header.jsx`.

**Props:** Ninguno

**Características:**
- En pantallas `xl` (≥ 1280px) el menú es horizontal y centrado; en pantallas menores se convierte en menú hamburguesa
- Admite submenús desplegables (hover en escritorio, clic en móvil); se cierran con clic fuera o con `Escape`

**MENU:** para agregar o cambiar opciones edita solo esta lista. Un elemento con `sub` despliega un submenú.

```javascript
[
  { t: "Inicio", href: "/" },
  { t: "Quiénes somos", href: "/quienes-somos" },
  { t: "Informes y estadísticas", href: "/informes-estadisticas" },
  { t: "Línea del tiempo", href: "/linea-tiempo" },
  { t: "Recursos informativos", href: "/recursos-informativos" },
  // Ejemplo con submenú:
  // { t: "Conócenos", sub: [{ t: "Historia", href: "/conocenos/historia" }] },
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
- Búsqueda del artículo publicado por slug (`getPublishedArticleBySlug` de `lib/articles.js`)
- Muestra la fecha de publicación (o la de alta si no tiene)
- Genera citación APA automáticamente
- Calcula tiempo de lectura
- Muestra imagen principal
- Renderiza contenido en párrafos
- Permite volver a la biblioteca (`/recursos-informativos`)
- La página (`app/articles/[slug]/page.jsx`) genera título, descripción y Open Graph propios con `generateMetadata`

**Manejo de Errores:**
- Si el artículo no existe → muestra mensaje de error
- Si falla la conexión → muestra error de base de datos

---

### ArticleAPA.jsx

Bloque de citación APA con botones de copiar.

La cita se muestra siempre como texto plano. No usar `dangerouslySetInnerHTML`: la cita contiene datos de la BD y permitiría inyectar código.

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
- Título, autores (separados por punto y coma: `Pérez, J.; López, M.`)
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

### lib/articles.js

| Exportación | Descripción |
|-------------|-------------|
| `APA_FIELDS` | Lista única de campos de citación APA |
| `pickApaFields(body)` | Toma del body solo los campos APA, como texto limpio |
| `createUniqueSlug(title, excludeId?)` | Slug a partir del título que no exista en la BD (`-2`, `-3`...) |
| `getPublishedArticleBySlug(slug)` | Artículo publicado por slug; con `cache()` de React para no consultar dos veces en el mismo render |

### utils/authors.js

#### Separación de autores

**Función: `parseAuthors(input): string[]`**

Se usa al guardar (POST/PUT) y al generar la cita, para que los autores siempre se separen igual.

- Separador recomendado: **punto y coma** → `"Pérez, J.; López, M."`
- También acepta comas sin romper el formato `Apellido, N.` → `"Pérez, J., López, M."`
- Si recibe un arreglo lo devuelve limpio

```javascript
parseAuthors("Pérez, J.; López, M.")           // → ["Pérez, J.", "López, M."]
parseAuthors("María Rodríguez, Ana Martínez")   // → ["María Rodríguez", "Ana Martínez"]
parseAuthors("Brito Contreras, M. G.")          // → ["Brito Contreras, M. G."]
```

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
- Autores corporativos se preservan: la palabra clave ("universidad", "instituto", "centro"...) debe ser la primera palabra o el nombre debe contener " de " (así "Juan Centro López" sigue siendo persona)
- Si el recurso no indica editorial o institución se usa `DEFAULT_PUBLISHER` ("Observatorio de Competencias Digitales")
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

Si falta el grado se usa "Tesis"; si falta la institución se omite.

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

# Linting (ESLint con next/core-web-vitals)
npm run lint
```

---

##  Consideraciones Importantes

### Seguridad

1. **Variables de Entorno**: Nunca comitees `.env.local` con datos sensibles
2. **JWT**: Mantén `JWT_SECRET` seguro y único por ambiente
3. **Contraseñas**: Las contraseñas se hashean con bcryptjs antes de guardar
4. **Rutas protegidas**: Toda ruta que modifique datos debe validar el JWT con `getAdminSession()`; revisar solo que exista la cookie no es suficiente
5. **Errores**: Las respuestas 500 llevan un mensaje genérico; el detalle va solo a `console.error`
6. **HTML**: No insertar datos de la BD con `dangerouslySetInnerHTML`
7. **CORS**: Configura CORS según sea necesario en producción

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
- [ ] Sistema de favoritos/guardados
- [ ] Búsqueda full-text indexada
- [ ] Analytics y estadísticas de uso
- [ ] Multi-idioma (i18n)
- [ ] Cambiar `<img>` por `<Image />` de Next (avisos de `npm run lint`)
- [ ] Límite de intentos de login compartido entre instancias (Redis o BD)

---

## Registro de Cambios

### Octubre 2026

**Seguridad**
- `PUT` y `DELETE /api/articles/[id]` validan el JWT con `getAdminSession()`; antes bastaba con que existiera una cookie `sesion_token` con cualquier valor
- La cita APA se muestra como texto; se quitó `dangerouslySetInnerHTML` de `ArticleAPA.jsx`, que permitía inyectar código
- Login: límite de 5 intentos fallidos por IP cada 15 minutos, validación de que correo y contraseña sean texto, error claro si falta `JWT_SECRET` y cookie con `sameSite: lax`
- `limit` en `GET /api/articles` tiene un máximo (100 público, 1000 admin)
- Los errores 500 ya no devuelven el mensaje interno al cliente

**Errores corregidos**
- `GET /api/articles/[id]` fallaba siempre porque no importaba `unstable_cache`
- Crear o borrar un artículo no actualizaba la lista hasta 1 hora después; ahora las cachés usan la etiqueta `articles` y se invalidan con `revalidateTag`
- Los borradores (`published: false`) se mostraban al público
- `slug` ahora es único y se generan slugs `-2`, `-3`... para títulos repetidos
- El campo `issue` (número de revista) no existía en el esquema y se perdía; ahora se guarda y tiene su propio campo en el formulario
- Los autores se separaban con coma al crear y con punto y coma al editar; ahora ambos usan `parseAuthors`
- Citas APA: las tesis sin grado o institución mostraban `undefined`; se corrigió el nombre "Obsevatorio competenciad digitales"; un apellido como "Centro" ya no se toma como institución
- Página de artículo: muestra la fecha de publicación, "Volver a recursos" lleva a `/recursos-informativos` y ya no falla si el artículo no tiene contenido

**Interfaz y SEO**
- Nuevo `Banner.jsx` con el logo institucional; reemplaza a `Header.jsx` en todas las páginas
- Cada artículo tiene título, descripción y Open Graph propios (`generateMetadata`)

**Mantenimiento**
- ESLint configurado (`.eslintrc.json`); `npm run lint` funciona
- Eliminadas dependencias sin uso (`mongodb`, `typescript`, `@types/react`, `@types/node`) y el script `seed`, cuyo archivo no existía
- Eliminado `Header.jsx`; `Signaturee.jsx` renombrado a `Signature.jsx`
- Campos APA centralizados en `lib/articles.js`

---

