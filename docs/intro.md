---
sidebar_position: 1
---

# How is this hosted

## INTRODUCTION

As I am not mainly a frontend developer, you will notice that this website is not the most impresive. My goal with this website was only to have a personal CV that I can update from time to time with my experiences.

And as well a place to document my personal devOps related projects.

## CURRENT HOSTING

Current hosting is just done with github pages. https://pages.github.com/ (Free and fast)

## TO DO 
### Setup kubernetes cluster
Choose a cheap provider for a small eks cluster: Initial plan: https://www.civo.com/kubernetes (check if infra as code is posible)

### Deploy the website as a pod in the cluster
The website is ready to be built as a container and be deployed in a kubernetes cluster. Still to-do the kubernetes setup. And this will be the main content of this **#How is this hosted page**

### Setup a CI/CD pipeline for the website
Setup a CI/CD pipeline for the website, probably github actions and ArgoCD + helm deploy.

