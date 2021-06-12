PROJECT_ID=zhaopengyou
run-local:
	docker-compose up
create-tf-backend-bucket:
	aws s3api create-bucket --bucket ${PROJECT_ID}-terraform --region us-east-1
