## Deploy
### Create Docker Image
- go to root directory

- run docker image command

```bash
docker image build --target {pro or dev} -t {customer tag name} -f shop/Dockerfile .

# example:
# docker image build --target semi-pro -t nodeeweb-shop:1.0.0 -f shop/Dockerfile .
```