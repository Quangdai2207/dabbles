![image](./uploads/avatars/image-1.png)
# Launches Admin By Docker
-----

- **Step 1:** `cd ./dabble-project` where is stores the whole source code and docker-compose.yml file
- **Step 2:** Use the Command to run app `docker compose up -d`.
- **Step 3:** After rerun successfully, access the `PORT 8668` with Admin UI Or `PORT 3366` test `Swagger UI`
- **Step 4:** login with `superadmin@app.com`, password `123` for test Login.
- **Step 5:** `docker compose down -v` to stop all containers

**Example:**

````bash
cd ./dabble-project
docker compose up -d 

# for build
docker compose up -d --build
````

Once the Compose run all containers, used one in the commands to check list healthy service

````bash
docker compose ps
docler compose ps | grep healthy
docker ps -a | grep healthy
docker container ls -a | grep healthy
````

Stop all and remove containers is running

````bash
docker compose down -v
# Or use command:
docker rm -f $(docker ps -aq)
# Or remove images
docker rmi -f $(docker images -aq)
````

`.env.example` you can add your values and then remove `.example`.

The current core-api server still dose not configuration for open scalable, so we can do just one the instance without
`--scale`.
When the whole containers process is done you can move on the browse 3366 or 8668

-----

# Documentation

This project mini or share images, which was based-on microservices model but they're distributed monolithic with
services:

1. [admin](./admin)
2. [server](./server)
3. [client](./client)
4. [app-migrations](./app-migrations)
5. [app-test](./apps-test)
6. [mobile](./mobile)

## Structure

```text
    dabble-project/
        ├── admin/              # Spring Boot BFF [Thymeleaf (return root index.html), Javascript, css, html]
        ├── app-migrations/     # Java migration module seeding data
        ├── apps-test/          # app test/prototype
        ├── client/             # Next.js 16 + React 19 (end-user web)
        ├── mobile/             # Flutter app
        ├── server/             # Spring Boot API + WebSocket + data integrations
        ├── uploads/            # Images upload local
        ├── docker-compose.yml  # Run services container
        └── README.md           # Documentation
```

## WorkFlows

```text
[ Web Client - Next.js :3000]   ------
                                       \                                     ---> Redis
[ Mobile App - Flutter]         -------- =>  [CoreApi - Spring Boot :3366]   ---> MySQL
                                       /                                     ---> Cassandra
[ Web Admin - BFF :8668]        ------                                      
```

## Framework and Languages

- Java, Spring Framework
- NextJS, Javascript
- Redis, MySql, Cassandra
- Dark, Flutter

## [Admin](./admin)

This is an application designed for users who are system administrators. The Admin Service is based on the concept of a
BFF (Backend-for-Frontend), which performs necessary tasks to enhance server security, as the backend is limited at
certain times due to constraints.

The Admin Service is a Single-Page Application (SPA) built using core JavaScript to simulate ReactJS, a widely adopted
technology today. This approach provides a better understanding of modern frontend concepts as well as the execution
flow of a system.

The application is organized into two separate parts, in which:

1. ### [Back-end](./admin/src/main/java/ti/dabble)

- `./java/dabble` was where stored source codes Java, which organize by backend business structure as the
  Modules, Layers, including:
    - [controllers](./admin/src/main/java/ti/dabble/controllers)
    - [apis](./admin/src/main/java/ti/dabble/apis)
    - [configurations](./admin/src/main/java/ti/dabble/configurations)
    - [models](./admin/src/main/java/ti/dabble/models)
    - [services](./admin/src/main/java/ti/dabble/services)

2. ### [Front-end](./admin/src/main/resources/static/assets)

- Frontend stored into the Resources folder, which is contains the whole source codes and applications resource,
  in which:
    - [css](./admin/src/main/resources/static/assets/css)
    - [html](./admin/src/main/resources/static/assets/html)
    - [images](./admin/src/main/resources/static/assets/images)
    - [js](./admin/src/main/resources/static/assets/js)
        - [app](./admin/src/main/resources/static/assets/js/app)
        - [pagesPath](./admin/src/main/resources/static/assets/js/pagesPath)
        - [utils](./admin/src/main/resources/static/assets/js/utils)
    - [index.html](./admin/src/main/resources/static/index.html)

- `app` where is the major business logic and stores the all files javascript for the SPA. Structure based-on
  ReactJs.
  which can be render the static html at the **html** and dynamic html. This app's structure:
    - [baseUrl](./admin/src/main/resources/static/assets/js/app/baseUrl)
    - [components](./admin/src/main/resources/static/assets/js/app/components)
    - [hooks](./admin/src/main/resources/static/assets/js/app/hooks)
    - [models](./admin/src/main/resources/static/assets/js/app/model)
    - [pages](./admin/src/main/resources/static/assets/js/app/pages)
    - [routers](./admin/src/main/resources/static/assets/js/app/routers)
    - [services](./admin/src/main/resources/static/assets/js/app/services)

- `router.js` file use for to handles RouterDom with dynamic params and none
- `routers` folder, where is use for declares routerDom to render UI corresponding and also by ROLE
- `pathsPage` is also contain the static html file paths. When you created new html at the **html** folder, you
  most always declare in this place.

## [Client](./client)

Was build by NextJs to render data for the end users.

````text
    - Next.js 16.1.6 (App Router)
    - React 19.2.4
    - TypeScript strict
    - Tailwind CSS 4 + Radix UI
    - State/data: Zustand, SWR
    - Auth/login: Google OAuth, JWT
    - Realtime: STOMP/SockJS
````

Port Default:

- `3000`

## [Server](./server)

The Core Apis server provide for Client and Admin server. It's written by Spring Boot Java. The Server was used several
technology like OAuth Authentication, Jwt, redis to store token session and cassandra non-relation DB for the message
realtime features.

````text
    - Java 17
    - Spring Boot `3.5.6`
    - Spring Web, Security, Data JPA, WebSocket
    - MySQL connector
    - Cassandra integration
    - Redis integration
    - Swagger UI (configured path `/`)
    - Extra integrations: PayPal SDK, Google API client, mail SMTP, images handler, upload
````

Port Default:

- `3366`

## [App Migration](./app-migrations)

Used single maven consist Flyway to seeding data instead Spring boot.

## [Test App](./apps-test)

Test features realtime.

## [Mobile](./mobile)

````text
    - Dart SDK ^3.10.4
    - Flutter + Riverpod
    - Dio cho networking
    - flutter_secure_storage
    - websocket client (`stomp_dart_client`)
    - dotenv config qua file .env
````
