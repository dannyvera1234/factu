# Imagen base de Node.js para construir la aplicación Angular
FROM node:18 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias y construye la aplicación
RUN npm install
RUN npm run build -- --configuration production