 #!/bin/bash

 # This script can only "re-deploy". It won't work for a first time deployment
 # It will also not work if there's more than one running container on the VPS

 # Exit script in case of error in a command
 set -e 
  
# I don't want the files/directories to be deployed
 rm -rf node_modules frontend/node_modules backend/node_modules frontend/dist backend/dist backend/database/database.db
 
 docker build --platform linux/amd64 -t onlineresume:latest .

 docker save onlineresume:latest | gzip | ssh -i /Users/marouane_faris/.ssh/oracle/ssh-key-2024-09-03.key ubuntu@89.168.63.99 'sudo docker stop $(sudo docker ps -q) && \
 sudo docker rm $(sudo docker ps -a -q) && \
 sudo docker image rm onlineresume:latest --force && sudo docker load'

 # Delete no longer needed local image to save space !  
 docker image rm onlineresume:latest

 # --dns: the host resolver (169.254.169.254) is unreachable from inside containers on this Oracle VPS
 ssh -i /Users/marouane_faris/.ssh/oracle/ssh-key-2024-09-03.key ubuntu@89.168.63.99 'sudo docker run -d --name onlineresume \
 --restart unless-stopped --dns 8.8.8.8 --dns 1.1.1.1 \
 -p 80:80 -p 443:443 -v ./database:/app/backend/database \
 -v ./httpsEncryption:/etc/letsencrypt onlineresume:latest'