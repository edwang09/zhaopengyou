variable "access_key" {
  
}
variable "secret_key" {
  
}
provider "aws" {
  region     = "us-east-1"
  access_key = var.access_key
  secret_key = var.secret_key
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