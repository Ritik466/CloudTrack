# How to Deploy CloudTrack

## Overview

CloudTrack is prepared for AWS-oriented deployment using:
- Amazon EC2 for hosting
- Amazon ECR for Docker image storage
- Amazon VPC for networking
- Amazon S3 for optional file storage
- Terraform for infrastructure provisioning
- Docker Compose for container orchestration on EC2

## Deployment Flow

1. Provision infrastructure from the `Infra/` directory with Terraform
2. Build backend and frontend Docker images
3. Push images to Amazon ECR
4. SSH into the EC2 instance
5. Run Docker Compose on EC2
6. Initialize the database
7. Test login, assignments, submissions, and downloads

## GitHub Setup

```bash
git init
git add .
git commit -m "Initial CloudTrack deployment setup"
git remote add origin https://github.com/Ritik466/CloudTrack.git
git branch -M main
git push -u origin main
```

## AWS Deployment Files

- `docker-compose.ec2.yml`: EC2 deployment with local PostgreSQL container
- `docker-compose.rds.yml`: EC2 deployment with external PostgreSQL / RDS
- `Infra/`: Terraform files for AWS resources

## Required Environment Variables

Backend / deployment variables:
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `BACKEND_IMAGE`
- `FRONTEND_IMAGE`
- `AWS_REGION`
- `S3_BUCKET` when S3 storage is enabled

## Post-Deployment Checklist

- Update frontend API base URL if the EC2 public IP changes
- Confirm Docker containers are running
- Verify database connectivity
- Test login for all roles
- Test assignment creation
- Test student submission
- Test teacher review and file download
- Test S3 upload flow if enabled

## Cost Control Notes

- Stop EC2 when not in use
- Avoid unnecessary RDS, load balancer, or NAT gateway usage
- Remove unused Docker images from ECR if needed
- Keep cloud resources minimal for demo use

## Production Notes

- Use HTTPS in production
- Use stronger session management
- Add monitoring and backups if the system becomes long-running
- Use S3 lifecycle rules if file storage grows

Good luck with deployment.
