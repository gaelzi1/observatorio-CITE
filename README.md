# Observatorio CITE

Réplica del sitio "Observatorio CITE" construida con **Next.js 14 (App Router)**, **React** y **MongoDB** (solo lectura).

## Estructura

```
observatorio-cite/
├── app/
│   ├── api/documentos/route.js   # Endpoint GET que lee la colección "documentos" en MongoDB
│   ├── layout.js
│   ├── page.js                   # Página principal (Header + Hero + Biblioteca)
│   └── globals.css
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── Biblioteca.jsx            # Buscador + grid, hace fetch a /api/documentos
│   ├── DocumentCard.jsx
│   ├── PsiThumbnail.jsx
│   └── LogoMark.jsx
├── lib/mongodb.js                # Conexión reutilizable a MongoDB
├── scripts/seed.js                # Pobla la colección "documentos" con datos de ejemplo
└── .env.local.example
```

## 1. Instalar dependencias

```bash
npm install
```

## 2. Configurar MongoDB

Copia el archivo de ejemplo y coloca tu cadena de conexión real (de MongoDB Atlas o tu instancia local):

```bash
cp .env.local.example .env.local
```

Edita `.env.local`:

```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=observatorio_cite
```

## 3. (Opcional) Poblar la base de datos con datos de ejemplo

```bash
npm run seed
```

Esto crea la colección `documentos` con 4 registros de ejemplo, similares a los de la maqueta original.

Cada documento tiene esta forma:

```json
{
  "titulo": "Orientación de las Investigaciones",
  "descripcion": "Texto descriptivo...",
  "categoria": "Tecnología",
  "fecha": "2024-02-05"
}
```

Puedes agregar tus propios documentos directamente desde MongoDB Compass, Atlas, o el shell (`mongosh`) siguiendo esa misma estructura.

## 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Cómo funciona la lectura de datos

- `lib/mongodb.js` crea una conexión reutilizable (cacheada en desarrollo para evitar reconexiones en cada hot-reload).
- `app/api/documentos/route.js` expone `GET /api/documentos?q=texto`, que consulta MongoDB filtrando por título, descripción o categoría (solo lectura, no hay inserciones/updates desde el frontend).
- `components/Biblioteca.jsx` es un client component que hace `fetch` a ese endpoint cada vez que cambia el texto de búsqueda (con un pequeño debounce de 300ms).

## Siguientes pasos sugeridos

- Agregar paginación real en el endpoint (`skip`/`limit`) si la colección crece mucho.
- Subir imágenes reales por documento (por ejemplo con un campo `imagenUrl` y Next/Image).
- Agregar filtros por categoría además del buscador de texto libre.
- Desplegar en Vercel y usar MongoDB Atlas (agregar la IP de Vercel o `0.0.0.0/0` en la whitelist de red de Atlas).
