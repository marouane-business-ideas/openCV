 #!/bin/bash

 # This script can only "re-deploy". It won't work for a first time deployment
 # The backend's secrets are the ones the last deploy from GitHub wrote on the VPS (see .github/workflows/deploy.yml)

 # Exit script in case of error in a command
 set -e 
  
# I don't want the files/directories to be deployed
 rm -rf node_modules frontend/node_modules backend/node_modules frontend/build backend/dist backend/database/database.db
 
 docker build --platform linux/amd64 -t onlineresume:latest .

 # The site keeps running while the image is sent: it's only down while the container is replaced, a few seconds
 docker save onlineresume:latest | gzip | ssh ubuntu@54.39.230.66 'sudo docker load'

 # Delete no longer needed local image to save space !  
 docker image rm onlineresume:latest

 ssh ubuntu@54.39.230.66 'bash -s' < ops/deploy/replace-container.sh
