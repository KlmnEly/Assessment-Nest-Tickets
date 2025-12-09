# Assessment-Nest-Tickets API

This project, created by Kelmin Miranda using NodeJS, is a NestJS-based backend service that manages the creation and tracking of tickets, users, and roles. It uses TypeORM for data persistence.

 ### Start application

##### Clone repository
```bash
git clone https://github.com/KlmnEly/Assessment-Nest-Tickets.git
```

```bash
cd Assessment-Nest-Tickets
```

##### Init Docker
```bash
docker compose up --build
```

##### Enviroment file

```
# Node.js App
APP_CONTAINER_NAME=
APP_PORT=3000
NODE_ENV=development
APP_CPU_LIMIT=0.50
APP_MEM_LIMIT=512M

# PostgreSQL
DB_CONTAINER_NAME=
POSTGRES_HOST=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_PORT=
POSTGRES_LOCAL=
DB_CPU_LIMIT=0.50
DB_MEM_LIMIT=512M

JWT_SECRET=
```

### Endpoints Swagger
Base Api is ```http://localhost:3000/api/docs```.

Create a new role
```
{
    "name": "admin"
}
```

Register a new user
```
{
    "fullname": "pablo",
    "email": "example@test.com",
    "password": "123456",
    "roleId": 1
}
```

Login
```
{
    "email": "example@test.com",
    "password": "123456
}
```

Tickets
```
{
  "title": "La impresora no funciona",
  "description": "El equipo 404 no puede imprimir documentos.",
  "priority": "HIGH",
  "customerId": 1,
  "technicianId": 2
}
```