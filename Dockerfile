# syntax=docker/dockerfile:1

FROM node:24-slim AS builder

WORKDIR /app

# Dependencies first, cached separately from app code so editing src/ doesn't
# invalidate this layer.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY index.html tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts ./
COPY public ./public
COPY src ./src

# Vite inlines VITE_* variables into the bundle at build time, so the backend
# URL is baked into the image rather than read at runtime. Pass it with
# `docker build --build-arg`; src/shared/api/base.ts falls back to the
# production backend when it is empty.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


FROM nginxinc/nginx-unprivileged:1.29-alpine

# The unprivileged image renders /etc/nginx/templates/*.template through
# envsubst at startup, which is how ${PORT} reaches the config. Restrict the
# substitution to PORT so nginx's own $uri / $http_* variables survive.
ENV PORT=8080 \
    NGINX_ENVSUBST_FILTER=^PORT$

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

# The base image already runs as uid 101 (nginx), non-root.
EXPOSE 8080
