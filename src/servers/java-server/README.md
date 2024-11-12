
# Java REST API Server

This is a REST API server implemented in Java using Spring Boot. It provides endpoints to manage users and supports CRUD operations.

## Requirements

- **JDK**: 11 or higher
- **Maven**

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd src/servers/java-server
   ```

2. **Install Dependencies**:
   Maven will automatically install dependencies when running the application.

3. **Configure Port (Optional)**:
   By default, the server runs on port `5004`. To change it, modify the `server.port` property in `application.properties`:
   ```properties
   server.port=5004
   ```

## Running the Server

To start the server, run:
```bash
mvn spring-boot:run
```

The server will be accessible at `http://localhost:5004`.

## Endpoints

- **GET /users**: Retrieve all users.
- **POST /users**: Add a new user.
- **GET /users/{id}**: Retrieve a user by ID.
- **PUT /users/{id}**: Update a user's name by ID.
- **PATCH /users/{id}**: Update hours worked for a user by ID.
- **DELETE /users/{id}**: Delete a user by ID.
- **DELETE /users**: Delete all users.

## Running Tests

To run the tests:
```bash
mvn test
```

## Notes

Make sure the server is running before testing with the client application.