
# REST-MULTI-LANGUAGE.md

## Assignment: Implement a RESTful API in Multiple Languages (in addition to typescript and python)

### Objective
Your assignment is to extend the existing project by implementing two additional servers that replicate the functionality of the TypeScript server. This will allow you to explore RESTful API implementation in multiple programming languages and understand how each language approaches backend server development.

### Setup Instructions

#### Run the Client Tester
The client application will allow you to test the functionality of the server.
- To run the client tester,
- Clone the repository then cd into the directory
- use the command:
  ```bash
  npm install
  npm run dev
  ```
- Ensure that the client is communicating with the TypeScript server by setting the **port to 5001**.
- Ensure that the client is communicating with the Python server by setting the **port to 5002**.

#### Run the TypeScript Server
The TypeScript server is located under `src/servers/ts-server/`.
- To start the server, run the following command:
  ```bash
  ts-node src/servers/ts-server/server.ts
  ```
- Make sure that the server is running on **port 5001**.

#### Run the Python server
The Python server is located under `src/servers/python-server/`

Instructions for setting up and running the Python server can be found in the `README.md` file in the `src/servers/python-server` directory



#### 3. Test CRUD Operations
- Use the fields in the client application to enter parameters for different CRUD operations.
- You can test the following endpoints:
  - **GET all users**
  - **GET user by ID**
  - **POST new user**
  - **PUT (update) user by ID**
  - **PATCH (add hours) for user by ID**
  - **DELETE user by ID**
  - **DELETE all users**

### Test Suite
The test suite implements the following sequence of operations to verify the server's functionality:

1. **Delete All Users**: Ensure that the users list is empty.
2. **Get All Users**: Verify the empty response.
3. **Add a User**: Add a user named "Test User".
4. **Get User by ID**: Retrieve the user and verify the information.
5. **Add Another User**: Add a second user named "Another User".
6. **Update User by ID**: Update the first user's name to "Updated User".
7. **Add Hours Worked**: Add 5 hours to the first user.
8. **Add Multiple Users**: Add 9 more users.
9. **Get All Users**: Ensure all users are present.
10. **Delete a User by ID**: Delete the last added user and verify the result.

### Note
You are allowed to use ChatGPT or any other generative AI tools to help generate code for this assignment. Make sure you understand the code and can explain how it works.  In fact, the purpose of this assigment is for you to develop skills in using generativeAI tools to build software.  You are encouraged to use these tools to help you complete the assignment.

### Assignment Requirements
Your task is to implement two additional servers that provide the same RESTful functionality. Each server should be placed under `src/servers/<language-server>/`. You may choose any programming languages you are comfortable with (e.g., Java, C#, Ruby).

For each server:
- **Directory Structure**: Place each server in a separate directory under `src/servers/`. For example, `src/servers/python-server/` or `src/servers/java-server/`.
- **Functionality**: Ensure that each server has the same endpoints and functionality as the TypeScript server.
- **Port Configuration**: Set each new server to run on a different port locally (e.g., 5002, 5003) to avoid conflicts.
- **README.md**: Include a `README.md` file in each server directory explaining how to set up and run the server. This README should provide:
  - Dependencies required (e.g., `pip install` for Python).
  - Commands to start the server.
  - Any additional setup instructions.
  - Update the code in MainControl.tsx to indicate what languages you chose.  Search for CHANGEME in the code to find where to make the changes 

### Grading Criteria
- **Functionality**: Each of the three servers (TypeScript and the two additional servers) must pass the test suite outlined above.
- **Code Quality**: Ensure your code is clean, well-commented, and follows best practices for the chosen language.
- **Documentation**: Provide clear instructions in the `README.md` for each server.

### Team Testing
Before submission, have a team member clone your repository and follow the setup instructions literally to ensure everything works as expected. This will help catch any issues or missing details in your documentation.

### Submission Instructions
- Submit your project repository containing the following:
  - **src/servers/ts-server/** (TypeScript server)
  - **src/servers/<language1-server>/** (First additional server)
  - **src/servers/<language2-server>/** (Second additional server)
- Ensure all servers are functional and can be tested using the client application.

Good luck, and feel free to reach out if you have any questions!