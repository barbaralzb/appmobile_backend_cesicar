# Usa una imagen oficial de Node.js como base
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código de tu proyecto al contenedor
COPY . .

# Comando para ejecutar las pruebas unitarias (ajusta según tu configuración)
CMD ["npm", "test"]