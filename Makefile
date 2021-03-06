PROJECT_ID=zhaopengyou
INCETANCE_TAG=zpystaging-ec2
FRONTEND_TAG=edwang09/zhaopengyou_frontend
BACKEND_TAG=edwang09/zhaopengyou_backend
FRONTEND_CONTAINER = zhaopengyou_frontend
BACKEND_CONTAINER = zhaopengyou_backend
run-local:
	docker-compose up
create-tf-backend-bucket:
	aws s3api create-bucket --bucket $(PROJECT_ID)-terraform --region us-east-1

	
ssh-cmd: 
	aws ssm send-command \
	--targets '[{"Key":"tag:Name","Values":["$(INCETANCE_TAG)"]}]' \
	--document-name "AWS-RunShellScript" \
	--comment "$(COMMENT)" \
	--parameters commands="$(CMD)" \
	--output text

ipconfig:
	make ssh-cmd CMD='ifconfig' COMMENT="ip config"

	
pull:
	make ssh-cmd COMMENT="docker pull" CMD='docker pull $(FRONTEND_TAG) && docker pull $(BACKEND_TAG) ' 
clean:
	make ssh-cmd COMMENT="docker cleanup" CMD='docker container stop $(FRONTEND_CONTAINER) && docker container rm $(FRONTEND_CONTAINER) && docker container stop $(BACKEND_CONTAINER) && docker container rm $(BACKEND_CONTAINER) ' 

network:
	make ssh-cmd COMMENT="docker network" CMD='docker network create zpy' 
run:
	make ssh-cmd COMMENT="docker run" CMD='docker run -d --network zpy --network-alias backend --name=$(BACKEND_CONTAINER) $(BACKEND_TAG) && docker run -d --network zpy --network-alias frontend --name=$(FRONTEND_CONTAINER) -p 80:80 $(FRONTEND_TAG)' 

dev:
	ENV=dev docker-compose up
dev-build:
	ENV=dev docker-compose up --build
build-dev:
	ENV=dev docker-compose build
build:
	ENV=prod docker-compose build
push:
	docker-compose push

local-pull:
	docker pull $(FRONTEND_TAG) && docker pull $(BACKEND_TAG)
local-clean:
	docker container stop $(FRONTEND_CONTAINER) && docker container rm $(FRONTEND_CONTAINER) && docker container stop $(BACKEND_CONTAINER) && docker container rm $(BACKEND_CONTAINER) 

local-network:
	docker network create zpy
local-run-backend:
	docker run --network zpy --network-alias backend --name=$(BACKEND_CONTAINER) -p 3000:3000 $(BACKEND_TAG) 
local-run-frontend:
	docker run --network zpy --network-alias frontend --name=$(FRONTEND_CONTAINER) -p 80:80 $(FRONTEND_TAG)
