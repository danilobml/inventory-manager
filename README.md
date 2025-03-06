# Inventory Manager - REST API for managing a product inventory, built with NodeJs - Express (TypeScript) and Prisma.

## Tooling:
- Framework: NodeJs Express
- Security: Helmet and Hpp
- ORM: Prisma
- Validation: Zog
- Auth: JWT and Bcrypt
- Containerization: Docker and docker-compose

## Design:
- MVC Design Pattern
- Object Oriented
- SOLID principles applied

## Run Locally:
(If you have Docker installed)
- Clone the repository
- Run in the promt, at the project root folder: docker-compose up -d

## Paths:
### Auth:
- POST: http://localhost:3001/api/v1/auth/register -> signin/register new user (body: {"email": string, "password: string (min 6 chars)"})
- POST: http://localhost:3001/api/v1/auth/login -> login user (body: {"email": string, "password: string (min 6 chars)"})

### Product:
- GET: http://localhost:3001/api/v1/products -> list all products
- GET: http://localhost:3001/api/v1/products/{id} -> gets one product
- POST: http://localhost:3001/api/v1/products -> creates one product (body: {"name": string, "price": float})
- POST: http://localhost:3001/api/v1/products/{id}/buy -> buys (increases stock) of that product (body: {"amount": integer})
- POST: http://localhost:3001/api/v1/products/{id}/sell -> buys (decreases stock) of that product (body: {"amount": integer})
- DELETE: http://localhost:3001/api/v1/products/{id} -> removes product from inventory 