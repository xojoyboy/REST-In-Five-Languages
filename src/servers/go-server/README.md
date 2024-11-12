
# Go REST API Server

This is a REST API server implemented in Go. It provides endpoints to manage users and supports CRUD operations.

## Requirements

- **Go**: Version 1.16 or higher

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd src/servers/go-server
   ```

2. **Install Dependencies**:
   Install the `gorilla/mux` package for routing:
   ```bash
   go get -u github.com/gorilla/mux
   ```

3. **Configure Port (Optional)**:
   By default, the server runs on port `5003`. To change it, update the `http.ListenAndServe(":5003", router)` line in `main.go`.

## Running the Server

To start the server, run:
```bash
go run main.go
```

The server will be accessible at `http://localhost:5003`.

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
go test
```

## Notes

Ensure the server is running on port `5003` before testing with the client application.

