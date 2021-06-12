resource "aws_ecs_cluster" "zpycluster" {
  name               = var.cluster_name
  capacity_providers = [aws_ecs_capacity_provider.zpycapacityprovider.name]
  tags = {
    name       = "zpystaging"
  }
}

resource "aws_ecs_capacity_provider" "zpycapacityprovider" {
  name = "capacity-provider-test"
  auto_scaling_group_provider {
    auto_scaling_group_arn         = aws_autoscaling_group.zpyasg.arn
    managed_termination_protection = "ENABLED"

    managed_scaling {
      status          = "ENABLED"
      target_capacity = 100
    }
  }
}

# update file container-def, so it's pulling image from ecr
resource "aws_ecs_task_definition" "zpy-task-definition" {
  family                = "staging-family"
  container_definitions = file("container-definitions/container-def.json")
  network_mode          = "bridge"
  tags = {
    name       = "zpystaging"
  }
}
data "aws_ecs_task_definition" "test-task-definition" {
  task_definition                = "test"
}
resource "aws_ecs_service" "zpyservice" {
  name            = "zpy-service"
  cluster         = aws_ecs_cluster.zpycluster.id
  task_definition = aws_ecs_task_definition.zpy-task-definition.family
  desired_count   = 1
  ordered_placement_strategy {
    type  = "binpack"
    field = "cpu"
  }
#   load_balancer {
#     target_group_arn = aws_lb_target_group.lb_target_group.arn
#     container_name   = "pink-slon"
#     container_port   = 80
#   }
  # Optional: Allow external changes without Terraform plan difference(for example ASG)
#   lifecycle {
#     ignore_changes = [desired_count]
#   }
  launch_type = "EC2"
#   depends_on  = [aws_lb_listener.web-listener]
}

# resource "aws_cloudwatch_log_group" "log_group" {
#   name = "/ecs/frontend-container"
#   tags = {
#     "env"       = "dev"
#     "createdBy" = "mkerimova"
#   }
# }