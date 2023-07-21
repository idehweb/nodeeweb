# base image
FROM node:18.17.0-bullseye-slim as base

# Set Enviroments
ENV EnvLoader Docker
ENV PATH /app/node_modules/.bin:$PATH
ENV MONGO_URL "mongodb://mongomaster:27017"
ENV PORT 3000
ENV DB_NAME "NodeewebShop"
ENV LOG_TO_FILE true
ENV ADMIN_EMAIL "admin@nodeeweb.com"
ENV ADMIN_USERNAME "admin"
ENV ADMIN_PASSWORD "admin"
ENV STATIC_SERVER true
ENV SHARED_PATH ./shared

# Expose All Ports
EXPOSE ${PORT}

# Install curl
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Health check
HEALTHCHECK --interval=1m --timeout=15s --retries=3 --start-period=2m \
    CMD curl -fk http://localhost:${PORT}/health || exit 1

# Change Work directory
WORKDIR /app


FROM base as build-dev

# Copy packege json and package lock
COPY shop/package.json shop/yarn.lock shop/

# COPY core
COPY core /app/core

# Copy core script
RUN cd /app/core && \
    mkdir -p dist && \
    cp -r scripts dist/scripts

# Build core
RUN cd /app/core && \ 
    yarn install && \
    yarn build && \
    rm -rf node_modules

# Install Packages
RUN cd /app/shop && \
    yarn install

# Copy modules
COPY shop /app/shop

# Build
RUN cd /app/shop && \
    yarn build

# Replace Packages with Production one
RUN cd /app/shop && \ 
    rm -rf node_modules && \
    yarn install --production && \
    yarn cache clean --force

FROM base as production
ENV NODE_ENV "production"

# Copy packages
COPY --from=build-dev /app/shop/node_modules ./node_modules

# Copy Build Files
COPY --from=build-dev /app/shop/dist /app/shop/package.json /app/shop/tsconfig.json ./

# Copy Docker EntryPoint
COPY shop/docker/docker-entrypoint-pro.sh /usr/local/bin

# user
# USER node

ENTRYPOINT ["docker-entrypoint-pro.sh" ]
CMD ["node","index"]