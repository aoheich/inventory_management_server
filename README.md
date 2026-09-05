# Inventory Management Server

This project helps teams track their inventory, manage supplier deliveries, and monitor product stock levels. It takes basic inputs about products and movements, processing them to produce an accurate historical record of warehouse operations. There is no complicated setup required, just a straightforward system that teams can rely on.

## Installation

Follow these steps to get the project running on your local machine. 

Clone the Repository:
```bash
git clone https://github.com/aoheich/inventory_management_server
cd inventory_management_server
```

Install dependencies:
```bash
npm install
```

Configure your environment variables by creating a `.env` file in the root directory. Here is an example of the required variables:
```txt
PORT=9000
TEST_DATABASE_URL="mysql://user:password@localhost:3306/inventory_db"
ACCESS_TOKEN_KEY="your_super_secret_access_key"
REFRESH_TOKEN_KEY="your_super_secret_refresh_key"
PEPPER="your_password_pepper"
SALT="10"
```

Push the database schema:
```bash
npx prisma db push
```

Start the development server:
```bash
npm start
```

## Usage

Once the server is running, you can interact with the system using your preferred HTTP client. You must first register a user account to obtain authentication tokens. Administrative endpoints require a user to have the ADMIN role in the database.

Here is an example of registering a new account using cURL:
```bash
curl -X POST http://localhost:9000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "securepassword"}'
```

The response will include your user details along with an access token, and a refresh token will be set as an HTTP-only cookie. You will use the access token in the Authorization header for subsequent requests.

Here is an example of authenticating a request to view your user profile:
```bash
curl -X GET http://localhost:9000/api/user/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Features

* Role-based access control to secure administrative actions and sensitive data.
* Secure authentication system utilizing access tokens and HTTP-only refresh tokens.
* Complete inventory tracking for monitoring stock entering and leaving the warehouse.
* Relational data management linking products directly to their suppliers.
* Built-in pagination for retrieving large lists of products, suppliers, and transactions.

## Technologies Used

| Technology | Description |
| :--- | :--- |
| [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) | Programming Language |
| [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/) | JavaScript Runtime |
| [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/) | Web Framework |
| [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/) | Object-Relational Mapper |
| [![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)](https://mariadb.org/) | Database |

## API Documentation

### Environment Variables

The server requires the following environment variables to function correctly:
* `PORT`: The port number the server runs on.
* `TEST_DATABASE_URL`: The connection string for your MariaDB or MySQL database.
* `ACCESS_TOKEN_KEY`: The secret key used to sign JWT access tokens.
* `REFRESH_TOKEN_KEY`: The secret key used to sign JWT refresh tokens.
* `PEPPER`: An additional secret string appended to passwords before hashing.
* `SALT`: The number of salt rounds used for bcrypt password hashing.

### User Endpoints

#### POST /api/user/register
**Description**: Registers a new user and returns authentication tokens.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "mysecurepassword"
}
```

**Response**:
```json
{
  "message": "User Created Successfully",
  "data": {
    "id": 1,
    "role": "USER",
    "token_version": 1,
    "access_token": "eyJhbGciOiJIUzI1..."
  }
}
```

**Errors**:
* 400: Validation error.
* 409: User Already Exists.

#### POST /api/user/login
**Description**: Authenticates an existing user and provides new tokens.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "mysecurepassword"
}
```

**Response**:
```json
{
  "message": "User Logged In Successfully",
  "data": {
    "id": 1,
    "role": "USER",
    "token_version": 1,
    "access_token": "eyJhbGciOiJIUzI1..."
  }
}
```

**Errors**:
* 400: Validation error.
* 401: Invalid Credentials.

#### POST /api/user/refresh
**Description**: Generates a new access token using a valid refresh token cookie.

**Request**: No body required. Relies on the `refresh_token` HTTP-only cookie.

**Response**:
```json
{
  "message": "New Access Token",
  "data": "eyJhbGciOiJIUzI1..."
}
```

**Errors**:
* 400: Refresh Token Required.
* 401: Unauthorized or Invalid Token.

#### POST /api/user/logout
**Description**: Invalidates the current refresh token and clears the cookie.

**Request**: No body required. Relies on the `refresh_token` HTTP-only cookie.

**Response**:
```json
{
  "message": "Logout Successfull"
}
```

**Errors**:
* 401: Refresh Token Required or Invalid Token.

#### GET /api/user/me
**Description**: Retrieves the details of the currently authenticated user. Requires a valid access token in the Authorization header.

**Request**: No body required.

**Response**:
```json
{
  "message": "User Details Available",
  "data": {
    "id": 1,
    "role": "USER",
    "email": "user@example.com",
    "token_version": 1
  }
}
```

**Errors**:
* 401: Authorization Required.
* 404: User Not Found.

#### GET /api/user?page=1
**Description**: Retrieves a paginated list of all users. Requires ADMIN role.

**Request**: Query parameter `page` is required.

**Response**:
```json
{
  "message": "All users",
  "data": [
    {
      "id": 1,
      "role": "USER",
      "email": "user@example.com",
      "token_version": 1
    }
  ]
}
```

**Errors**:
* 400: Page field required.
* 401: Authorization Required.
* 403: Access Denied.

#### DELETE /api/user/:id
**Description**: Deletes a user by ID. Requires ADMIN role.

**Request**: Provide user ID in the URL parameter.

**Response**:
```json
{
  "message": "User Successfully Deleted"
}
```

**Errors**:
* 401: Authorization Required.
* 403: Access Denied.
* 404: User Not Found.

### Supplier Endpoints

#### POST /api/supplier
**Description**: Creates a new supplier. Requires ADMIN role.

**Request**:
```json
{
  "name": "Global Supplies Inc."
}
```

**Response**:
```json
{
  "message": "Supplier Created Successfully",
  "data": {
    "id": 1,
    "name": "Global Supplies Inc.",
    "date_created": "2023-10-25T10:00:00Z"
  }
}
```

**Errors**:
* 400: Validation error.
* 401: Authorization Required.
* 403: Access Denied.
* 409: Supplier Already Exists.

#### GET /api/supplier?page=1
**Description**: Retrieves a paginated list of suppliers. Requires authentication.

**Request**: Query parameter `page` is required.

**Response**:
```json
{
  "message": "All Supplier Details:",
  "data": {
    "suppliers": [
      {
        "id": 1,
        "name": "Global Supplies Inc.",
        "date_created": "2023-10-25T10:00:00Z"
      }
    ],
    "total": 1,
    "current_page": 1,
    "pages": 1
  }
}
```

**Errors**:
* 400: Page field required.
* 401: Authorization Required.

#### GET /api/supplier/:id
**Description**: Retrieves details of a specific supplier. Requires authentication.

**Request**: Provide supplier ID in the URL parameter.

**Response**:
```json
{
  "message": "Supplier Details:",
  "data": {
    "id": 1,
    "name": "Global Supplies Inc.",
    "date_created": "2023-10-25T10:00:00Z"
  }
}
```

**Errors**:
* 400: Validation error.
* 401: Authorization Required.
* 404: Supplier Does Not Exist.

#### PATCH /api/supplier/:id
**Description**: Updates a supplier's information. Requires ADMIN role.

**Request**:
```json
{
  "name": "Updated Supplier Name"
}
```

**Response**:
```json
{
  "message": "Supplier Updated Successfully",
  "data": {
    "id": 1,
    "name": "Updated Supplier Name",
    "date_created": "2023-10-25T10:00:00Z"
  }
}
```

**Errors**:
* 400: Validation error.
* 401: Authorization Required.
* 403: Access Denied.
* 404: Supplier Does Not Exist.
* 409: Wrong Request.

#### DELETE /api/supplier/:id
**Description**: Deletes a supplier. Cannot be deleted if associated products exist. Requires ADMIN role.

**Request**: Provide supplier ID in the URL parameter.

**Response**:
```json
{
  "message": "Supplier Successfully Deleted"
}
```

**Errors**:
* 401: Authorization Required.
* 403: Access Denied.
* 404: Supplier Does Not Exist.
* 409: Cannot Delete Supplier: Associated Products Present.

### Product Endpoints

#### POST /api/product
**Description**: Creates a new product. Requires ADMIN role.

**Request**:
```json
{
  "name": "Industrial Widget",
  "quantity": 100,
  "supplier_id": 1
}
```

**Response**:
```json
{
  "message": "Product Created Successfully",
  "data": {
    "name": "Industrial Widget",
    "supplier_id": 1,
    "quantity": 100,
    "id": 1,
    "date_created": "2023-10-25T10:00:00Z"
  }
}
```

**Errors**:
* 400: Validation error.
* 401: Authorization Required.
* 403: Access Denied.
* 404: Supplier Does Not Exist.
* 409: Product Already Exists.

#### GET /api/product?page=1
**Description**: Retrieves a paginated list of all products. Requires authentication.

**Request**: Query parameter `page` is required.

**Response**:
```json
{
  "message": "All Product Details",
  "data": {
    "products": [
      {
        "name": "Industrial Widget",
        "quantity": 100,
        "id": 1,
        "supplier_id": 1,
        "date_created": "2023-10-25T10:00:00Z",
        "supplier": {
          "id": 1,
          "name": "Global Supplies Inc."
        }
      }
    ],
    "total": 1,
    "current_page": 1,
    "pages": 1
  }
}
```

**Errors**:
* 400: Page field required.
* 401: Authorization Required.

#### GET /api/product/:id
**Description**: Retrieves specific product details. Requires authentication.

**Request**: Provide product ID in the URL parameter.

**Response**:
```json
{
  "message": "Product Details",
  "data": {
    "name": "Industrial Widget",
    "quantity": 100,
    "supplier_id": 1,
    "id": 1,
    "date_created": "2023-10-25T10:00:00Z",
    "supplier": {
      "id": 1,
      "name": "Global Supplies Inc."
    }
  }
}
```

**Errors**:
* 401: Authorization Required.
* 404: Product Not Found.

#### PATCH /api/product/:id
**Description**: Updates a product's details. Requires ADMIN role.

**Request**:
```json
{
  "name": "Updated Widget Name",
  "supplier_id": "2"
}
```

**Response**:
```json
{
  "message": "Product Updated Successfully",
  "data": {
    "name": "Updated Widget Name",
    "quantity": 100,
    "id": 1,
    "supplier_id": 2,
    "date_created": "2023-10-25T10:00:00Z",
    "supplier": {
      "id": 2,
      "name": "New Supplier Inc."
    }
  }
}
```

**Errors**:
* 400: Validation error.
* 401: Authorization Required.
* 403: Access Denied.
* 404: Product Not Found / Supplier Not Found.
* 409: Name Already Exists.

#### DELETE /api/product/:id
**Description**: Deletes a product. Cannot be deleted if transactions are associated with it. Requires ADMIN role.

**Request**: Provide product ID in the URL parameter.

**Response**:
```json
{
  "message": "Product Successfully Deleted"
}
```

**Errors**:
* 401: Authorization Required.
* 403: Access Denied.
* 404: Product Not Found.
* 409: Cannot Delete Products: Associated Transactions Present.

### Transaction Endpoints

#### POST /api/transaction
**Description**: Records a stock movement. Type can be "IN" or "OUT". Requires authentication.

**Request**:
```json
{
  "product_id": 1,
  "quantity": 50,
  "type": "OUT"
}
```

**Response**:
```json
{
  "message": "Transaction Created Successfully",
  "data": {
    "id": "cuid_string_here",
    "date_created": "2023-10-25T10:00:00Z",
    "type": "OUT",
    "product_id": 1,
    "user_id": 1,
    "quantity": 50
  }
}
```

**Errors**:
* 400: Validation error / Supplier_id cannot be provided for OUT transactions / Requested Product Quantity Is Higher Than Available Stock.
* 401: Authorization Required.
* 404: Product Not Found / Supplier Not Found.

#### GET /api/transaction?page=1
**Description**: Retrieves a paginated list of stock transactions. Requires authentication.

**Request**: Query parameter `page` is required.

**Response**:
```json
{
  "message": "All Transactions",
  "data": {
    "transactions": [
      {
        "id": "cuid_string_here",
        "date_created": "2023-10-25T10:00:00Z",
        "type": "OUT",
        "quantity": 50,
        "product_id": 1,
        "user_id": 1,
        "product": {
          "id": 1,
          "name": "Industrial Widget"
        }
      }
    ],
    "total": 1,
    "current_page": 1,
    "pages": 1
  }
}
```

**Errors**:
* 400: Page field required.
* 401: Authorization Required.

#### GET /api/transaction/:id
**Description**: Retrieves a single transaction record by ID. Requires authentication.

**Request**: Provide transaction ID in the URL parameter.

**Response**:
```json
{
  "message": "Transaction Found",
  "data": {
    "id": "cuid_string_here",
    "date_created": "2023-10-25T10:00:00Z",
    "type": "OUT",
    "quantity": 50,
    "product_id": 1,
    "user_id": 1,
    "product": {
      "id": 1,
      "name": "Industrial Widget"
    }
  }
}
```

**Errors**:
* 401: Authorization Required.
* 404: Transaction Does Not Exist.

## Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any improvements or fixes you suggest are highly appreciated. Please fork the repository, create a branch for your feature, and submit a pull request for review.

## Author Info

Created and maintained by aoheich. Check out the GitHub profile to view more projects and source code contributions.

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://dokugen.samueltuoyo.com)
