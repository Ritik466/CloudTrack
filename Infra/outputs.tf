output "ec2_public_ip" {
    value = aws_instance.app.public_ip
}

output "backend_ecr_url" {
    value = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_url" {
    value = aws_ecr_repository.frontend.repository_url
}

output "rds_endpoint" {
    value = var.enable_rds ? aws_db_instance.postgres[0].address : null
}

output "rds_port" {
    value = var.enable_rds ? aws_db_instance.postgres[0].port : null
}

output "s3_bucket_name" {
    value = var.enable_s3 ? aws_s3_bucket.uploads[0].bucket : null
}
