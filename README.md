# Electrolux-assessment-task-nodejs-app

Simple Node.js/Express app to demo a CI/CD pipeline that deploys the same build to two
pre-production environments using Docker Hub and GitHub Actions.

## App

Node.js + Express, runs on port 5000.

- `/` - hello page
- `/health` - used by the health checks
- `/version` - returns the commit SHA of the running build

## Pipeline

```
PR merged to main -> GitHub Actions
                       install deps
                       run tests
                       docker build (tag = commit sha)
                       trivy scan
                       push to Docker Hub
                          |
                          v
                     deploy PPR1 (port 5000) -> health check
                          |
                     manual approval
                          |
                          v
                     deploy PPR2 (port 5001) -> health check
```

The image is built once and the same tag goes to both environments, so nothing is rebuilt
between PPR1 and PPR2. PPR1 deploys automatically, PPR2 needs an approval.

## Run locally

```bash
npm install
npm start
curl localhost:5000/health
```

To run both PPR environments locally with Docker:

```bash
docker-compose up -d

# PPR1
curl localhost:5000/health

# PPR2
curl localhost:5001/health
```

## Config

Set in GitHub Settings:

**Secrets:**
- `DOCKERHUB_USERNAME` - Docker Hub username
- `DOCKERHUB_TOKEN` - Docker Hub access token (Settings > Security > New Access Token)

**Environments** `ppr1` and `ppr2`:
- `ppr1` - no required reviewers, auto-deploys
- `ppr2` - add required reviewers to enable the approval gate

## Future: AWS deployment

When moving to AWS the registry switches from Docker Hub to ECR and the deploy target
switches from the GitHub Actions runner to EC2 via SSM. The pipeline shape stays the same.

Required additions:
- Variables: `AWS_REGION`, `ECR_REPOSITORY`
- Secret: `AWS_ROLE_TO_ASSUME` (IAM role ARN, GitHub OIDC - no hardcoded keys)
- Environment variables per env: `EC2_INSTANCE_ID`, `APP_PORT`
