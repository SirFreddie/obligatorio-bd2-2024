# Dana Castroman, Gonzalo Paz, Rodrigo Luque

# Probar el proyecto usando docker

1. Verificar que existe el archivo .env en el root del proyecto. En caso de no tenerlo solicitarlo al grupo.
2. Tener instalado Docker.
3. Ejecutar el comendo `docker-compose run -d`

# Instalacion del Proyecto

1. Descargar el proyecto o clonarlo.
2. Descargar e instalar Docker.
3. Verificar que existe el archivo .env en los archivos. En caso de no tenerlo solicitarlo al grupo.
4. Para instalar la DB abrir la consola ubicados en el proyecto y ejecutar el comando `docker-compose up -d`. Esto creara un contenedor de Docker.
5. Instalar las dependencias del `cliente` y del `servidor` usando el comando `npm i`.
6. Una vez instaladas la DB y ambos proyectos ejecutar el servidor ubicados en el proyecto `obligatorio-bd2-2024-server` usando el comando `npm run dev`.
7. Para ejecutar el cliente, ubicarse en la terminal en el proyecto `obligatorio-bd2-2024-client` y ejecutar el comando `npm run start`.

## Funcionamiento

El cliente o front-end programado en Angular realiza llamados a la API que se encuentra en el servidor de Node.js y el cual a su vez se conecta a la instancia de la base de datos. De este modo toda la aplicacion se encuentra comunicada.
El front realiza llamados a la API del servidor, y el servidor realiza consultas directamente a la DB.
