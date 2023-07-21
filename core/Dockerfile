# base image
FROM node:18.17.0-bullseye-slim as base

# user
USER node

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
ENV STATIC_SERVER false
ENV SHARED_PATH ./shared

# Expose All Ports
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=1m --timeout=15s --retries=3 --start-period=2m \
    CMD curl -fk http://localhost:${PORT}/health || exit 1

# Change Work directory
WORKDIR /app


FROM base as build

# Copy packege json and package lock
COPY --chown=node package.json yarn.lock ./

# Install Packages
RUN yarn install

# Copy modules
COPY --chown=node . .

# Build
RUN yarn build

# Replace Packages with Production one
RUN rm -rf node_modules && \
    yarn install --production && \
    yarn cache clean --force 

FROM base as production
ENV NODE_ENV "production"

# Copy packages
COPY --chown=node --from=build /app/node_modules ./node_modules

# Copy Build Files
COPY --chown=node --from=build /app/dist /app/package.json /app/tsconfig.json ./

# Copy Docker EntryPoint
COPY --chown=node ./docker/docker-entrypoint-pro.sh /usr/local/bin

ENTRYPOINT ["docker-entrypoint-pro.sh" ]
CMD ["node","start"]