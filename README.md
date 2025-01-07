# Rllop site

The site is created using [Docusaurus](https://docusaurus.io/docs), a React-based static-site generator for fast, interactive sites, ideal for documentation, blogs, or personal projects.

Run locally with:
`npm run start`

Build locally with:
`npm run build`

Build a docker container with:
`docker build --no-cache . --file Dockerfile-local --tag rllopdev/rllopsite:`dockerlocal``

Then run it:
`docker run -p 80:80 rllopdev/rllopsite:`dockerlocal``

CI/CD is prepared using the Github Actions: [.github/workflows/build-deploy-docker.yml ](https://github.com/ricardllop/rllopsite/blob/main/.github/workflows/build-deploy-docker.yml).
