# ./backend/Dockerfile
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos de dependencias primero (para aprovechar cache)
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el resto del código del backend
COPY . .

# Puerto que expone el backend
EXPOSE 4000

# Variable de entorno recomendada
ENV NODE_ENV=production

# Comando de inicio
# Asegúrate de tener en package.json: "start": "node src/server.js"
CMD ["npm", "start"]
