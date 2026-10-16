 #!/bin/bash

 # This script can only "re-deploy". It won't work for a first time deployment
 # It will also not work if there's more than one running container on the VPS
 # The backend's secrets are the ones the last deploy from GitHub wrote on the VPS (see .github/workflows/deploy.yml)

 # Exit script in case of error in a command
 set -e 
  
# I don't want the files/directories to be deployed
 rm -rf node_modules frontend/node_modules backend/node_modules frontend/build backend/dist backend/database/database.db
 
 docker build --platform linux/amd64 -t onlineresume:latest .

 docker save onlineresume:latest | gzip | ssh ubuntu@54.39.230.66 'sudo docker stop $(sudo docker ps -q) && \
 sudo docker rm $(sudo docker ps -a -q) && \
 sudo docker image rm onlineresume:latest --force && sudo docker load'

 # Delete no longer needed local image to save space !  
 docker image rm onlineresume:latest

 # --dns: don't depend on the host's resolver, which some VPS hosts make unreachable from inside containers
 ssh ubuntu@54.39.230.66 'sudo docker run -d --name onlineresume \
 --restart unless-stopped --dns 8.8.8.8 --dns 1.1.1.1 \
 -p 80:80 -p 443:443 -v ./database:/app/backend/database \
 -v ./httpsEncryption:/etc/letsencrypt \
 -v ./backend.env.production.local:/app/backend/.env.production.local:ro onlineresume:latest'