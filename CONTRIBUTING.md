# How to Contribute to CloudTrack

Thanks for wanting to contribute.

## Getting Started

1. Fork the repository
2. Create a branch:
   `git checkout -b your-feature-name`
3. Make your changes
4. Commit:
   `git commit -m "Add your feature"`
5. Push your branch
6. Open a pull request

## Bug Reports

When reporting a bug, include:
- what happened
- what you expected
- reproduction steps
- browser and OS
- screenshots if possible

## Feature Requests

Please:
- use a clear title
- explain why the feature is useful
- keep the suggestion aligned with the project goals

## Development Setup

```bash
git clone https://github.com/Ritik466/CloudTrack.git
cd CloudTrack
npm run install:all
npm run db:setup
npm run dev
```

## Code Style

- keep code readable
- follow existing patterns
- add comments only where they help understanding
- test changes before submitting

## Project Structure

```text
backend/              # Express API and database scripts
frontend/             # React application
Infra/                # Terraform infrastructure files
docker-compose.yml    # Local Docker setup
docker-compose.ec2.yml
docker-compose.rds.yml
```

## Guidelines

- be respectful
- keep suggestions practical
- focus on user-facing improvements
- prefer simple solutions when possible

Happy coding.
