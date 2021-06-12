variable "aws" {
  access_key = string
  secret_key = string
}


provider "aws" {
  region     = "us-east-1"
  access_key = var.aws.access_key
  secret_key = var.aws.secret_key
}

terraform {
  backend "s3" {
    bucket = "zhaopengyou-terraform-test"
    key    = "state/terraform.tfstate"
    region = "us-east-1"
  }
}
resource "aws_s3_bucket" "terraform-test" {
    bucket = "zhaopengyou-terraform-test"
  
}