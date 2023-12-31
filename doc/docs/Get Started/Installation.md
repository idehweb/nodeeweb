---
sidebar_position: 1
---

# Installation

## Developers

### 1. Install Requirements
- [MongoDB Server](https://www.mongodb.com/docs/manual/installation/) version 4.4 or higher
- [NodeJs](https://nodejs.org/en) version 18 or higher
- [Yarn](https://yarnpkg.com/) latest version

### 2. Clone Repo
clone repository from github
```bash
git clone https://github.com/idehweb/nodeeweb.git
```

### 3. Install Packages
change into directory which you want, in this example we want to install `Nodeeweb Core`
```bash
cd core
```
install packages
```bash
yarn
```

### 4. Environment variables
copy `.env` file in root directory into `.env.local` in same path
```bash
cp .env .env.local
```
fill environment variables which define in `.env.local` file 
```bash
# example of .env.local
PORT=2758
DB_NAME="NodeewebCore"
NODE_ENV="local"
LOG_TO_FILE=false
ADMIN_EMAIL="admin@nodeeweb.com"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin"
STATIC_SERVER=true
SHARED_PATH=./shared
AUTH_SECRET="my-core-auth-secret"
MONGO_URL="mongodb://127.0.0.1:27017"
NODEEWEBHUB_API_BASE_URL="https://nodeeweb.com/api/v1"
```

### 5. Run
try to run application with below commands:
```bash
# execute and watch
yarn dev

# execute
yarn start:ts
```


