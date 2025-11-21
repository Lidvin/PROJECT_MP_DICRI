# ./frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiamos package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código del frontend
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# IMPORTANTE: Vite necesita host 0.0.0.0 para ser accesible desde fuera
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
