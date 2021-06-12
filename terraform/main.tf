provider "aws" {
  region     = "us-east-1"
  access_key = "AKIA2QDYKCAQBXRH3Y4S"
  secret_key = "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"
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