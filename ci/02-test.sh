docker compose --env-file .env -f \
./compose-ci/docker-compose.yml -f \
./compose-ci/docker-compose-test.yml \
up -d && docker compose ps && \
docker compose --env-file .env -f \
./compose-ci/docker-compose.yml -f \
./compose-ci/docker-compose-test.yml \
down -v