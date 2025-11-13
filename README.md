# Tienda-de-Objetos-de-Fantasia

1. Instalar React Router

npm install react-router-dom

2. Iniciar servidor de desarrollo. 

npm run dev

3. Crear un proyecto desde cero

npm run build

## Comandos Git

1. Actualizar tu repositorio local

git pull origin main

* main es una rama
* Adrian es otra rama
* Indicar que rama quieres actualizar

2. Subir tu repositorio local a Github REMOTO

git push origin main

========================================================================


1. COMANDOS
C:\Users\user\Desktop\Mysql\pgsql\bin\pg_ctl.exe start -D

C:\...\pg_ctl.exe start -D "C:\Users\user\Desktop\Mysql\pgsql\data"


ir a al arhcivo .config y cambiar el puerto a 5432

node index.js

5. EN index.js eliminar el "//" para crear las tablas, una vez creado, volver a poner "//". MIRA LA FLECHA

app.listen(PORT, async () => {
  console.log(` Servidor funcionando en el puerto: ${PORT}`);
  // await sincronizarBD(); <-----------------------------------------------------
});