# Electrolux-assessment-task-nodejs-app

## Application
Node.js Sample Application

## Objective

This repository demonstrates a CI/CD pipeline using GitHub Actions that:

- Builds the application
- Runs automated tests
- Builds a Docker image
- Pushes the image to Amazon ECR
- Deploys to two Pre-Production (PPR) environments on AWS EC2
- Performs automated health checks after deployment

Developer
     │
     ▼
GitHub Repository
     │
     ▼
GitHub Actions
     │
     ├── Build
     ├── Test
     ├── Docker Build
     ├── Push Image → Amazon ECR
     │
     ▼
AWS EC2
 ├── PPR1 Container (Port 5000)
 │      │
 │      └── Health Check
 │
 └── PPR2 Container (Port 5001)
        │
        └── Health Check