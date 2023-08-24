# Usar una imagen base de Node.js
FROM node:18

# Actualizar npm
RUN npm update -g npm

# Crear el directorio /home/app en el contenedor
RUN mkdir -p /home/app

# Establecer el directorio de trabajo en el contenedor
WORKDIR /home/app

# Copiar los archivos de tu aplicación al contenedor
COPY package.json package-lock.json /home/app/

# Instalar las dependencias de tu aplicación
RUN npm install
RUN npm install bcrypt

# Copiar todos los archivos de tu aplicación al contenedor
COPY . /home/app/

RUN npm install

# Exponer el puerto en el que funciona tu aplicación (por ejemplo, 5000)
EXPOSE 8080

# Especificar el comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]