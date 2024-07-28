FROM nginx:mainline-alpine-slim

# Copying built assets from builder
COPY /build /usr/share/nginx/html