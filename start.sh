#!/bin/bash

# rutas a los directorios de backend y frontend
backend_dir="$(pwd)/backend"
frontend_dir="$(pwd)/frontend"

# deteccion del SO
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    gnome-terminal -- bash -c "cd $backend_dir && pipenv run flask run; exec bash" &
    gnome-terminal -- bash -c "cd $frontend_dir && npm run build && serve -s build; exec bash" &

elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e "tell application \"Terminal\" to do script \"cd $backend_dir && pipenv run flask run\""
    osascript -e "tell application \"Terminal\" to do script \"cd $frontend_dir && npm run build && serve -s build\""

elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start cmd.exe /k "cd $backend_dir && pipenv run flask run"
    start cmd.exe /k "cd $frontend_dir && npm run build && serve -s build"

else
    echo "Sistema operativo no soportado."
fi
