resource "aws_vpc" "zpyvpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "zpystaging"
  }
}
resource "aws_internet_gateway" "zpygw" {
  vpc_id = aws_vpc.zpyvpc.id

  tags = {
    Name = "zpystaging"
  }
}
resource "aws_route_table" "zpyrt" {
  vpc_id = aws_vpc.zpyvpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.zpygw.id
  }


  tags = {
    Name = "zpystaging"
  }
}
resource "aws_subnet" "zpysubnet1" {
  vpc_id            = aws_vpc.zpyvpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "zpystaging"
  }
}
resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.zpysubnet1.id
  route_table_id = aws_route_table.zpyrt.id
}
resource "aws_vpc" "mainvpc" {
  cidr_block = "10.1.0.0/16"
}

resource "aws_security_group" "allowany" {
  name        = "allow-any-traffic"
  description = "Same as default"
  vpc_id      = aws_vpc.zpyvpc.id

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    protocol    = "tcp"
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
resource "aws_network_interface" "zypnic" {
  subnet_id       = aws_subnet.zpysubnet1.id
  private_ips     = ["10.0.1.50"]
  security_groups = [aws_security_group.allowany.id]
}
resource "aws_eip" "two" {
  vpc                       = true
  network_interface         = aws_network_interface.zypnic.id
  associate_with_private_ip = "10.0.1.50"
  depends_on = [
    aws_internet_gateway.zpygw
  ]
}

resource "aws_instance" "web" {
  ami               = "ami-07fde2ae86109a2af"
  instance_type     = "t2.micro"
  availability_zone = "us-east-1a"
  key_name          = var.key_name
  network_interface {
    network_interface_id = aws_network_interface.zypnic.id
    device_index         = 0
  }
  tags = {
    Name = "zpystaging-ec2"
  }
  user_data = <<EOF
#! /bin/sh
yum update -y
amazon-linux-extras install docker
service docker start
usermod -a -G docker ec2-user
chkconfig docker on
EOF
}
