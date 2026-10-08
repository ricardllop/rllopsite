# The site is static files, so it is built on the architecture of the machine running
# the build (no emulation). Only the final nginx image is arm64.
FROM --platform=$BUILDPLATFORM node:24-alpine AS builder

ARG DOCUSAURUS_CONF_URL='https://ricardllop.com'
ARG DOCKER_IMAGE_TAG='ga-tag'

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM --platform=linux/arm64 nginx:mainline-alpine-slim

COPY nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
