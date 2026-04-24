run:
	mvn -T 1C -DskipTests package
	java -jar $(firstword $(wildcard target/*.jar))

clean:
	mvn clean

test:
	mvn test

docker:
	git pull origin main
	docker compose up -d --build

clear_docker:
	docker container prune -f
	docker image prune -a -f
	docker volume prune -f
	docker network prune -f
	docker builder prune -a -f