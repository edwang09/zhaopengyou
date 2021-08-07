#!/bin/bash
	
docker pull edwang09/zhaopengyou_frontend && docker pull edwang09/zhaopengyou_backend
docker container stop zhaopengyou_frontend && docker container rm zhaopengyou_frontend && docker container stop zhaopengyou_backend && docker container rm zhaopengyou_backend 
docker network create zpy
docker run -d --network zpy --network-alias backend --name=zhaopengyou_backend -p 3000:3000 edwang09/zhaopengyou_backend && docker run -d --network zpy --network-alias frontend --name=zhaopengyou_frontend -p 80:80 edwang09/zhaopengyou_frontend
