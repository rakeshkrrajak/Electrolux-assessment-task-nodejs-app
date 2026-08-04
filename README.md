# Electrolux-assessment-task-nodejs-app

Simple Node.js/Express app I use to demo a CI/CD pipeline that deploys the same build to two
pre-production environments on AWS.

## App

Node.js + Express, runs on port 5000.

- `/` – hello page
- `/health` – used by the health checks
- `/version` – returns the commit SHA of the running build

## Pipeline

```
push -> GitHub Actions
          build
          test
          docker build (tag = commit sha)
          scan
          push to ECR
             |
             v
        deploy PPR1  (EC2, port 5000) -> health check
             |
        manual approval
             |
             v
        deploy PPR2  (EC2, port 5001) -> health check
```

The image is built once and the same tag goes to both environments, so nothing is rebuilt
between PPR1 and PPR2. PPR1 deploys automatically, PPR2 needs an approval. If the health
check fails after a deploy, the previous image is put back.

AWS access is via GitHub OIDC, so there are no AWS keys stored in the repo.

## Run locally

```bash
npm install
npm start
curl localhost:5000/health
```

## Config

Set in GitHub Settings:

- Variables: `AWS_REGION`, `ECR_REPOSITORY`
- Secret: `AWS_ROLE_TO_ASSUME`
- Environments `ppr1` and `ppr2`: `EC2_INSTANCE_ID`, `APP_PORT`, `BASE_URL`
  (`ppr2` has required reviewers enabled – that is the approval gate)

## Notes

One EC2 instance per environment and no load balancer, so a deploy is a quick container
restart. For production I would put it behind an ALB and use ECS blue/green.
