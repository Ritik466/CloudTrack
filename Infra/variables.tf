variable "aws_region" {
    type = string
    default = "ap-south-1"
}

variable "instance_type" {
    type = string 
    default = "t2.micro"
}

variable "ip_cidr_block"{
    type = string
}

variable "public_key" {
    type = string
    sensitive = true
}

variable "enable_rds" {
    type    = bool
    default = false
}

variable "db_name" {
    type    = string
    default = "simple_demo"
}

variable "db_username" {
    type    = string
    default = "postgres"
}

variable "db_password" {
    type      = string
    default   = ""
    sensitive = true
}

variable "enable_s3" {
    type    = bool
    default = false
}

variable "s3_bucket_name" {
    type    = string
    default = ""
}
