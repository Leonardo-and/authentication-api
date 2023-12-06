# Authentication API CRUD

## Description
It has 4 functionalities such as login, register, get all and delete a user. If a new account is created, an email will be sent to the email used.
The JWT is used when someone tries to get all user or delete an user.
Note: The project isn't completed. Many errors can be seen.

### Routes
- **POST** `/user/register` : Register a new user;
- **POST** `/user/login` : Log in user and return a bearer token;
- **GET** `/users` : Return all users if the token is sent on request header and the user haves an ADMIN role;
- **DELETE** `/users` : Delete an user by id if the token is sent on request and the user haves an ADMIN role.

## Technologies
- Node.js
- ExpressJS
- Prisma (MySQL ORM)
- JWT

## How to run the project
- Clone the repository
- Open on a terminal
- `npm install` Install the "node_modules"
- `npm run start` Start the API