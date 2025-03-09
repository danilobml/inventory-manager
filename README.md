# Inventory Manager - REST API for managing a product inventory, built with NodeJs - Express (TypeScript) and Prisma.

## Tooling:

- Framework: NodeJs Express (TypeScript)
- Security: Helmet and Hpp
- ORM: Prisma
- Validation: Zog
- Auth: JWT and Bcrypt
- Sqlite DB (in the container)
- Containerization: Docker and docker-compose
- Linting/codecheck: Prettier + ES Lint
- Precommit hooks: Husky
- Jest and supertest for unit and integration tests

## Design:

- MVC Design Pattern
- Object Oriented Programming (OOP)
- SOLID principles applied

## Run Locally:

(If you have Docker installed, if not refer to: https://docs.docker.com/desktop)

- Clone repository: git clone https://github.com/danilobml/inventory-manager.git (if using HTTPS, check for SSH)
- Run in your local prompt, at the project root folder, the command: docker-compose up -d
- Register a new user, or login with an existing one (at the respective routes described below)
- Copy the token that comes in the response body of either and paste it in any new requests to the other routes, adding the header "Authorization": "Bearer [token]"

## Routes:

### Auth:

- POST: http://localhost:3001/api/v1/auth/register -> signin/register new user (body: {"email": string, "password": string (min 6 chars)})
- POST: http://localhost:3001/api/v1/auth/login -> login user (body: {"email": string, "password": string})

### Product:

- GET: http://localhost:3001/api/v1/products -> lists all products
- GET: http://localhost:3001/api/v1/products/{id} -> gets one product
- POST: http://localhost:3001/api/v1/products -> creates one product (body: {"name": string, "price": float})
- POST: http://localhost:3001/api/v1/products/{id}/buy -> buys (increases stock) of that product (body: {"amount": integer})
- POST: http://localhost:3001/api/v1/products/{id}/sell -> sells (decreases stock) of that product (body: {"amount": integer})
- POST: http://localhost:3001/api/v1/products/{id}/assign-department -> assigns a departmentId of an existing department - check below how to create one (body: {"departmentId": string})
- PUT: http://localhost:3001/api/v1/products/{id} -> updates one product (body: {"name": string [optional], "price": float [optional]})
- DELETE: http://localhost:3001/api/v1/products/{id} -> removes product from inventory

### Department

- GET: http://localhost:3001/api/v1/departments -> lists all departments
- GET: http://localhost:3001/api/v1/departments/{id}/products -> lists all products pertaining to one department
- POST: http://localhost:3001/api/v1/departments -> creates one department (body: {"name": string [unique]})
- PUT: http://localhost:3001/api/v1/departments/{id} -> updates one department (body: {"name": string})
- DELETE: http://localhost:3001/api/v1/departments/{id} -> removes department
