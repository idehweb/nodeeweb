# base image
FROM node:18.11.0-bullseye as base

# Set Enviroments
ENV PATH /app/node_modules/.bin:$PATH
ENV ENV_LOADER Docker
ENV SERVER_NAME docker
# Remove this env to disable proxy
ENV SOCKS_URL socks://127.0.0.1:10808
ENV LOCAL_PATH /var/backups/nodeeweb 

# pre-requirements for mongoshell , mongotools
RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - \
    && apt-get install gnupg \ 
    && wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - \
    && echo "deb https://repo.mongodb.org/apt/debian/ bullseye/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list


# Install requirements
RUN apt update -y && \
    apt install -y --no-install-recommends \
    tar \
    mongodb-mongosh \
    mongodb-database-tools \
    zip \
    wget \
    && rm -rf /var/lib/apt/lists/*

ENV MAX_BACKUP_STORAGE_MB 5000

# Install V2ray
RUN mkdir -p /var/v2ray \ 
    && cd /var/v2ray \
    && wget -O v2ray.zip "https://github.com/v2fly/v2ray-core/releases/download/v4.31.0/v2ray-linux-64.zip" \
    && unzip v2ray.zip

# Change Work directory
WORKDIR /app

# Copy packege json and package lock
COPY package*.json ./

# Install production packages
RUN npm ci && npm cache clean --force


FROM base as pro
ENV NODE_ENV production
ENV CRON_EXPR "0 0 * * *"

# Copy source codes
COPY . .

# Copy Docker EntryPoint
COPY ./docker-entrypoint.sh /usr/local/bin

# Execute
ENTRYPOINT ["docker-entrypoint.sh" ]
CMD ["node", "server"]

