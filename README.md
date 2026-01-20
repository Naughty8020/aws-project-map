
# Run the following command to build and start the Docker containers
docker-compose down

docker compose up --build


# To access the frontend container's bash shell, use the command below
sudo docker exec -it awsmap-app-frontend-1 bash

test