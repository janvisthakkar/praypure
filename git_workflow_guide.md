# Git Workflow & Branching Guide

Praypure uses a multi-branch strategy to facilitate independent deployments of its components while maintaining a central integration branch.

## Branch Overview

| Branch | Purpose | Deployment Target |
| :--- | :--- | :--- |
| `main` | **Integration & Development**. The primary branch where all code is combined and tested locally. | Local Development |
| `frontend` | **Main Website Production**. Contains the optimized frontend code. | `www.praypure.com` (Vercel) |
| `admin` | **Admin Panel Production**. Contains the admin dashboard code. | `admin.praypure.com` (Vercel) |
| `backend` | **API Production**. Contains the Node.js server code. | `api.praypure.com` (AWS EC2) |

## Standard Workflow for New Developers

### 1. Starting a Feature
Always create a fresh branch from `main`:
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Committing Changes
Group your commits by component to make merging easier:
```bash
git add frontend/
git commit -m "feat: updated home page redesign"
```

### 3. Deployment Process
When a feature is ready for production:

#### Stage A: Update Main
Merge your feature into `main` and push:
```bash
git checkout main
git merge feature/your-feature-name
git push origin main
```

#### Stage B: Deploying a Component
To deploy the frontend, move the relevant changes to the `frontend` branch:
```bash
git checkout frontend
git merge main  # Or git checkout main -- frontend (to only take frontend folder)
git push origin frontend
```
*Vercel will automatically detect this push and start the build.*

## Critical Rules
1.  **Never push [.env](file:///c:/Users/Janvi%20Thakkar/OneDrive/Desktop/Praypure/admin/.env) files**: These are added to [.gitignore](file:///c:/Users/Janvi%20Thakkar/OneDrive/Desktop/Praypure/.gitignore). Always configure environment variables directly in the Vercel dashboard or on the AWS server.
2.  **Isolate Component Branches**: The `frontend` and `admin` branches should only be updated when you are ready to ship to production.
3.  **Use Descriptive Commits**: Follow the format `feat: ...`, `fix: ...`, or `docs: ...` to keep the history readable.
