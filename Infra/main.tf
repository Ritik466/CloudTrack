terraform {
    required_version = ">= 1.5.0"

    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 5.0"
        }
    }
}

provider "aws" {
    region = var.aws_region
}

data "aws_availability_zones" "available" {
    state = "available"
}

data "aws_ami" "ubuntu" {
    most_recent = true
    owners      = ["099720109477"]

    filter {
        name    = "name"
        values  = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]

    }

    filter {
        name    = "virtualization-type"
        values  = ["hvm"]
        }
}

resource "aws_ecr_repository" "backend" {
    name = "cloudtrack-backend"
}

resource "aws_ecr_repository" "frontend" {
    name = "cloudtrack-frontend"
}

resource "aws_vpc" "main" {
    cidr_block           = "10.0.0.0/16"
    enable_dns_hostnames = true
    enable_dns_support   = true

    tags = {
        Name = "cloudtrack_VPC"
    }
}

resource "aws_subnet" "public" {
    vpc_id            = aws_vpc.main.id
    cidr_block        = "10.0.1.0/24"
    availability_zone = data.aws_availability_zones.available.names[0]
    map_public_ip_on_launch = true

    tags = {
        Name = "cloudtrack_public_subnet"
    }

}

resource "aws_subnet" "private_a" {
    vpc_id            = aws_vpc.main.id
    cidr_block        = "10.0.2.0/24"
    availability_zone = data.aws_availability_zones.available.names[0]

    tags = {
        Name = "cloudtrack_private_subnet_a"
    }
}

resource "aws_subnet" "private_b" {
    vpc_id            = aws_vpc.main.id
    cidr_block        = "10.0.3.0/24"
    availability_zone = data.aws_availability_zones.available.names[1]

    tags = {
        Name = "cloudtrack_private_subnet_b"
    }
}

resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.main.id

    tags = {
        Name = "cloudtrack_igw"
    }
}

resource "aws_route_table" "public" {
    vpc_id = aws_vpc.main.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.igw.id
    }

    tags = {
        Name = "cloudtrack_public_rt"
    }
}

resource "aws_route_table_association" "public" {
    subnet_id      = aws_subnet.public.id
    route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "app" {
    name = "cloudtrack_sg"
    description = "CloudTrack app security group"
    vpc_id = aws_vpc.main.id

    ingress {
        description = "SSH from my IP"
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = [var.ip_cidr_block]
    }

    ingress {
        description = "HTTP"
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        description = "Backend API"
        from_port   = 3001
        to_port     = 3001
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "cloudtrack_sg"
    }
}

resource "aws_security_group" "rds" {
    count       = var.enable_rds ? 1 : 0
    name        = "cloudtrack_rds_sg"
    description = "CloudTrack RDS security group"
    vpc_id      = aws_vpc.main.id

    ingress {
        description     = "PostgreSQL from app EC2"
        from_port       = 5432
        to_port         = 5432
        protocol        = "tcp"
        security_groups = [aws_security_group.app.id]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "cloudtrack_rds_sg"
    }
}

resource "aws_db_subnet_group" "main" {
    count      = var.enable_rds ? 1 : 0
    name       = "cloudtrack-db-subnet-group"
    subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]

    tags = {
        Name = "cloudtrack_db_subnet_group"
    }
}

resource "aws_db_instance" "postgres" {
    count                     = var.enable_rds ? 1 : 0
    identifier                = "cloudtrack-postgres"
    engine                    = "postgres"
    engine_version            = "16"
    instance_class            = "db.t3.micro"
    allocated_storage         = 20
    storage_type              = "gp2"
    db_name                   = var.db_name
    username                  = var.db_username
    password                  = var.db_password
    db_subnet_group_name      = aws_db_subnet_group.main[0].name
    vpc_security_group_ids    = [aws_security_group.rds[0].id]
    publicly_accessible       = false
    skip_final_snapshot       = true
    backup_retention_period   = 0
    deletion_protection       = false
    multi_az                  = false
    auto_minor_version_upgrade = true

    tags = {
        Name = "cloudtrack-rds"
    }
}

resource "aws_iam_role" "ec2_role" {
    name = "cloudtrack_ec2_role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Principal = {
                    Service = "ec2.amazonaws.com"
                }
            }
        ]
    })
}

resource "aws_iam_role_policy_attachment" "ecr_readonly" {
    role       = aws_iam_role.ec2_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_s3_bucket" "uploads" {
    count  = var.enable_s3 ? 1 : 0
    bucket = var.s3_bucket_name

    tags = {
        Name = "cloudtrack_uploads"
    }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
    count                   = var.enable_s3 ? 1 : 0
    bucket                  = aws_s3_bucket.uploads[0].id
    block_public_acls       = true
    block_public_policy     = true
    ignore_public_acls      = true
    restrict_public_buckets = true
}

resource "aws_iam_role_policy" "s3_access" {
    count = var.enable_s3 ? 1 : 0
    name  = "cloudtrack_s3_access"
    role  = aws_iam_role.ec2_role.id

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect = "Allow"
                Action = [
                    "s3:GetObject",
                    "s3:PutObject"
                ]
                Resource = "${aws_s3_bucket.uploads[0].arn}/*"
            },
            {
                Effect = "Allow"
                Action = [
                    "s3:ListBucket"
                ]
                Resource = aws_s3_bucket.uploads[0].arn
            }
        ]
    })
}

resource "aws_iam_instance_profile" "ec2_profile" {
    name = "cloudtrack_ec2_profile"
    role = aws_iam_role.ec2_role.name
}

resource "aws_key_pair" "deployer" {
    key_name   = "cloudtrack_key"
    public_key = var.public_key
}

resource "aws_instance" "app" {
    ami                     = data.aws_ami.ubuntu.id
    instance_type           = var.instance_type
    subnet_id               = aws_subnet.public.id
    vpc_security_group_ids = [aws_security_group.app.id]
    key_name                = aws_key_pair.deployer.key_name
    iam_instance_profile    = aws_iam_instance_profile.ec2_profile.name

user_data = <<-EOF
    #!/bin/bash
    set -eux
    apt-get update
    apt-get install -y docker.io awscli curl
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ubuntu
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL https://github.com/docker/compose/releases/download/v2.39.1/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
EOF


    tags = {
        Name = "CloudTrack_ec2"
    }
}
