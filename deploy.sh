 rm -rf node_modules frontend/node_modules backend/node_modules frontend/dist backend/dist backend/database/database.db backend/src/ResumeModels
 
 docker build --platform linux/amd64 -t onlineresume:latest .

 docker save onlineresume:latest | gzip | ssh -i /Users/marouane_faris/.ssh/oracle/ssh-key-2024-09-03.key ubuntu@89.168.63.99 sudo docker load

 ssh -i /Users/marouane_faris/.ssh/oracle/ssh-key-2024-09-03.key ubuntu@89.168.63.99 sudo docker restart '$(sudo docker ps -q)'