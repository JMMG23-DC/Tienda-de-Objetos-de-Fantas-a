@echo off
git checkout main
git merge <"Nombre de tu rama">
git add <"nombre_del_archivo que quieres Editar o Subir al Repositorio Github">
git commit -m "Indicar comentario de Subida"
git push origin main