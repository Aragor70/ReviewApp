# Review-App (name pending)

Fueled by:

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Version to implement a server side of application.

## Functionality specification

- A user can create an account and log in;

## Technical Specification

- A README file with setup instructions.
- Clean code (of course).

- A git repository with clean commit history.
- Good REST practices.

## Usage

Rename "config/config.env.example" to "config/config.env" and "config/postgres.env.example" to "config/postgres.env" and update environment settings to your own.

## Install dependencies

### Withought Docker:

```
npm install && npm install -g ts-node
```

Run App in development environment

```
npm run dev
```

### With Docker:

Bring up the server and database with:

```
docker-compose up server
```

install server npm dependencies localy if you need with:

```
docker-compose --rm run npmServer [install] or [your command]
```

shutdown server & database:

```
docker-compose down
```

- Version prequire 1.0.0
- License MIT

created by mikey.prus@gmail.com , g.stavroulakis@gmail.com
