
NAME = turtlebot
TAG = latest
SERVICE_NAME = turtlebot
REGISTRY = gcr.io/mangasoup-4500a
PRODUCT_NAME = mangasoup

run:
	-tsc
	-node ./dist/app.js

dev-start:
	-ts-node ./src/app.ts

run-dev:
	-nodemon

compose:
	docker compose -f docker-compose.yml -p ${PRODUCT_NAME} up --build --remove-orphans

stop:
	docker compose -p ${PRODUCT_NAME} down

build:
	-docker build -t ${SERVICE_NAME}:${TAG} .

release-build:
	-docker tag ${SERVICE_NAME}:${TAG} ${REGISTRY}/${SERVICE_NAME}:${TAG}

push:
	-docker push ${REGISTRY}/${SERVICE_NAME}:latest

buildx: 
	-docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 --tag ${REGISTRY}/${SERVICE_NAME}:${TAG} --push ./
	
apply:
	-kubectl apply -f ./manifests/
