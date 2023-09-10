# base image
FROM node:18.17.0-bullseye-slim as base

# Set Enviroments
ENV EnvLoader Docker
ENV PATH /app/node_modules/.bin:$PATH
ENV MONGO_URL "mongodb://mongomaster:27017"
ENV PORT 3000
ENV DB_NAME "NodeewebCore"
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


FROM base as build

# Copy packege json and package lock
COPY package.json yarn.lock ./

# Install Packages
RUN yarn install

# Copy modules
COPY . .

# Build
RUN yarn build

# Post Build
RUN yarn post:build

# Replace Packages with Production one
RUN rm -rf node_modules && \
    yarn install --production && \
    yarn cache clean --force 

FROM base as production
ENV NODE_ENV "production"

# Copy packages
COPY --from=build /app/node_modules ./node_modules

# Copy Scripts
COPY ./scripts /app/scripts

# Copy Build Files
COPY --from=build /app/dist /app/package.json /app/tsconfig.json ./

# Copy Docker EntryPoint
COPY ./docker/docker-entrypoint-pro.sh /usr/local/bin

# user
# USER node

ENTRYPOINT ["docker-entrypoint-pro.sh" ]
CMD ["node","start"]