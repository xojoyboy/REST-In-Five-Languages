import express, { Request, Response } from 'express';
import cors from 'cors';
import { User } from '../User';

const app = express();
const port = 5001;


app.use(express.json());
app.use(cors({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization'] }));



// In-memory storage for users
let users: User[] = [];
let nextId = 1;

// Get all users
app.get('/users', (req: Request, res: Response) => {
    console.log('GET /users - Fetching all users');
    res.json(users);
});

// Get a user by ID
app.get('/users/:id', (req: Request, res: Response) => {
    console.log(`GET /users/:id - Fetching user with ID: ${req.params.id}`);
    const user = users.find(u => u.id === Number(req.params.id));
    if (user) {
        console.log(`User found: ${JSON.stringify(user)}`);
        res.json(user);
    } else {
        console.log('User not found');
        res.status(404).send('User not found');
    }
});

// clear out all users
app.delete('/users', (req: Request, res: Response) => {
    console.log(`DELETE /users - Deleting all users`);
    users = [];
    res.json(users);
    nextId = 1;
});

// Add a new user
app.post('/users', (req: Request, res: Response) => {
    console.log('POST /users - Adding new user');
    const { name } = req.body;
    if (typeof name !== 'string' || !name.trim()) {
        console.log('Invalid name provided');
        res.status(400).send('Name is required and must be a non-empty string');
        return;
    }
    const newUser: User = { id: nextId, name: name.trim(), hoursWorked: 0 };
    nextId++;
    users.push(newUser);
    console.log(`New user added: ${JSON.stringify(newUser)}`);
    res.status(201).json(newUser);
});

// Update a user by ID
app.put('/users/:id', (req: Request, res: Response) => {
    console.log(`PUT /users/:id - Updating user with ID: ${req.params.id}`);
    // get the name from the body

    const { newName } = req.body;

    const user = users.find(u => u.id === Number(req.params.id));
    if (user) {
        const { name, hoursWorked } = req.body;
        if (typeof name === 'string' && name.trim()) {
            user.name = name.trim();
            console.log(`Updated user name to: ${user.name}`);
        }
        res.json(user);
    } else {
        console.log('User not found');
        res.status(404).send('User not found');
    }
});

// Update hours worked for a user by adding a value
app.patch('/users/:id', (req: Request, res: Response) => {
    console.log(`PATCH /users/:id/hours - Updating hours for user with ID: ${req.params.id}`);
    const user = users.find(u => u.id === Number(req.params.id));
    if (user) {
        const { hoursToAdd } = req.body;
        if (typeof hoursToAdd === 'number') {
            user.hoursWorked += hoursToAdd;
            console.log(`Added ${hoursToAdd} hours. Total hours worked: ${user.hoursWorked}`);
            res.json(user);
        } else {
            console.log('Invalid hoursToAdd value');
            res.status(400).send('Invalid hoursToAdd value');
        }
    } else {
        console.log('User not found');
        res.status(404).send('User not found');
    }
});

// Delete a user by ID
app.delete('/users/:id', (req: Request, res: Response) => {
    console.log(`DELETE /users/:id - Deleting user with ID: ${req.params.id}`);
    const userIndex = users.findIndex(u => u.id === Number(req.params.id));
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        console.log(`User deleted: ${JSON.stringify(deletedUser)}`);
        res.json(deletedUser);
    } else {
        console.log('User not found');
        res.status(404).send('User not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
