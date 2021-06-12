variable "key_name" {
  type        = string
  default = "main-key"
  description = "The name for ssh key, used for aws_launch_configuration"
}

variable "cluster_name" {
  type        = string
  default = "zpy-cluster"
  description = "The name of AWS ECS cluster"
}