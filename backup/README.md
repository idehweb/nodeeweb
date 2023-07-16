## Requirements
### Local
1. install mongodump , tar
2. run `npm i`
3. fill env variables which define in `.env` file , into `.env.local` file in the root directory

### Docker
1. bind mount for local backup into `/var/backups/nodeeweb` container path
2. bind mount for v2ray config into `/etc/v2ray-config.json` container path ( if want to run local proxy server for telegram bot and etc. )
3. set credential env var when create service or container such as : `SFTP_USERNAME , SFTP_PASSWORD , SFTP_PATH , SFTP_PORT , SFTP_IP, TELEGRAM_BOT_TOKEN , TELEGRAM_CHANNEL_ID , MONGO_URL`

## Usage
- development usage run `npm run dev`
- production usage run `npm start` 

## Deploy
### Docker
#### Create Image
```bash
$ docker image build -t {TAG_NAME} .
```

#### Create Docker Service
``` bash
docker service create \
    --hostname backup --name backup \
    -e SERVER_NAME={Server name} \
    -e SFTP_USERNAME={Sftp Username} -e SFTP_PASSWORD={Sftp Password} -e SFTP_PATH="/var/backups/nodeeweb" -e SFTP_PORT={Sftp Port} -e SFTP_IP={Sftp Ip} \
    -e TELEGRAM_BOT_TOKEN={Telegram Bot ID} -e TELEGRAM_CHANNEL_ID={Telegram Bot Channel ID} \
    -e MONGO_URL={Mongo Url} \
    --mount type=bind,source=/var/backups/nodeeweb,destination=/var/backups/nodeeweb \
    --mount type=bind,source=/etc/v2ray-config.json,destination=/etc/v2ray-config.json \
    --network nodeeweb_mongonet \
    --replicas 1 --restart-condition any --restart-delay 30s --restart-max-attempts 8 --restart-window 1m30s \
    idehweb/nodeeweb-backup:0.0.3
```