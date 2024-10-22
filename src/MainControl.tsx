import React, { useState } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import axios from 'axios';

const MainControl: React.FC = () => {
    const [endpoint1, setEndpoint1] = useState('5001');
    const [endpoint2, setEndpoint2] = useState('');
    const [endpoint3, setEndpoint3] = useState('');
    const [selectedEndpoint, setSelectedEndpoint] = useState('endpoint1');
    const [jsonResult, setJsonResult] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [hoursToAdd, setHoursToAdd] = useState('');
    const [testName, setTestName] = useState('');
    const [testWait, setTestWait] = useState(100);
    const [isRunningTests, setIsRunningTests] = useState(false);

    const getBaseUrl = (): string => {
        let port = '';

        // Figure out which port to use
        switch (selectedEndpoint) {
            case 'endpoint1':
                if (!endpoint1) {
                    alert('Please provide an endpoint');
                    return '';
                }
                port = endpoint1;
                break;
            case 'endpoint2':
                if (!endpoint2) {
                    alert('Please provide an endpoint');
                    return '';
                }
                port = endpoint2;
                break;
            case 'endpoint3':
                if (!endpoint3) {
                    alert('Please provide an endpoint');
                    return '';
                }
                port = endpoint3;
                break;
            default:
                alert('Please provide an endpoint');
                return '';
        }

        const baseUrl = `http://localhost:${port}`;
        return baseUrl;
    };
    let resultTmp = '';

    const handleCrudOperation = async (method: string, id: number = 0, name: string = '', hours: number = -1, checkWithUser: boolean = false) => {
        const baseUrl = getBaseUrl();
        if (!baseUrl) return;

        if (id === 0) {
            id = Number(userId);
        }

        if (name === '') {
            name = userName;
        }

        if (hours === -1) {
            hours = Number(hoursToAdd);
        }



        try {
            let response;
            switch (method) {
                case 'GET_ALL':
                    response = await axios.get(`${baseUrl}/users`);
                    break;
                case 'DELETE_ALL':
                    if (checkWithUser && !window.confirm('Are you sure you want to delete all users?')) {
                        return;
                    }
                    response = await axios.delete(`${baseUrl}/users`);
                    break;

                case 'GET':
                    response = await axios.get(`${baseUrl}/users/${id}`);
                    break;
                case 'POST':
                    response = await axios.post(`${baseUrl}/users`, { name: name });
                    break;
                case 'PUT':
                    response = await axios.put(`${baseUrl}/users/${id}`, { name: name });
                    break;
                case 'PATCH':
                    response = await axios.patch(`${baseUrl}/users/${id}`, { hoursToAdd: Number(hours) });
                    break;
                case 'DELETE':
                    if (checkWithUser && !window.confirm('Are you sure you want to delete user ?')) {
                        return;
                    }

                    response = await axios.delete(`${baseUrl}/users/${id}`);

                    break;
                default:
                    throw new Error('Unsupported operation');
            }
            const jsonTmp = JSON.stringify(response.data, null, 2);
            console.log(jsonTmp);
            resultTmp = jsonTmp;
            setJsonResult(jsonTmp);
        } catch (error) {
            const err = error as any;
            setJsonResult(`Error: ${err.response ? err.response.data : err.message}`);
        }
    };

    const runTestSuite = async () => {
        setIsRunningTests(true);
        const baseUrl = getBaseUrl();
        if (!baseUrl) {
            setIsRunningTests(false);
            return;
        }

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // 

        try {
            // start off with deleting all users
            setTestName('DELETE ALL USERS');
            await handleCrudOperation('DELETE_ALL');
            // check that the result is an empty array
            if (resultTmp !== '[]') {
                alert(`Failed to get all users expecting [] and got ${resultTmp}`);
                return;
            }

            await delay(testWait);

            // Test GET_ALL
            setTestName('GET ALL USERS');
            await handleCrudOperation('GET_ALL');
            // check that the result is an empty array
            if (resultTmp !== '[]') {
                alert(`Failed to get all users expecting [] and got ${resultTmp}`);
            }


            await delay(testWait);

            // Add a user
            setTestName('ADD USER');
            setUserName('Test User');
            await handleCrudOperation('POST', 0, 'Test User', 0);
            // check that the result is the user we added
            if (!resultTmp.includes('Test User')) {
                alert('Failed to add user');
            }


            await delay(testWait);

            // Test GET
            setTestName('GET USER');
            setUserId('1');
            await handleCrudOperation('GET', 1, '', 0);
            // check that the result is the user we added
            if (!resultTmp.includes('Test User')) {
                alert('Failed to get user');
            }


            await delay(testWait);

            // Test POST
            setTestName('ADD USER');
            setUserName('Another User');

            await handleCrudOperation('POST', 0, 'Another User', 0);


            await delay(testWait);

            // Test PUT
            setTestName('UPDATE USER');
            setUserId('1');
            setUserName('Updated User');
            await handleCrudOperation('PUT', 1, 'Updated User', 0);
            // check that the result is the user we updated
            if (!resultTmp.includes('Updated User')) {
                alert('Failed to update user');
            }


            await delay(testWait);

            // Test PATCH
            setTestName('ADD HOURS');
            setUserId('1');
            setHoursToAdd('5');
            await handleCrudOperation('PATCH', 1, '', 5);
            // check that the result is the user we updated
            if (!resultTmp.includes('5')) {
                alert('Failed to add hours');
            }


            await delay(testWait);

            // add 9 users
            for (let i = 0; i < 9; i++) {
                setTestName('ADD USER');
                setUserName(`User ${i}`);
                await handleCrudOperation('POST', 0, `User ${i}`, 0);
                await delay(testWait);
            }


            await delay(testWait);

            // get all the users
            setTestName('GET ALL USERS');
            await handleCrudOperation('GET_ALL');
            // check that the 'User 8' is in the list
            if (!resultTmp.includes('User 8')) {
                alert('Failed to get all users');
            }


            await delay(testWait);

            // Test DELETE
            setTestName('DELETE USER');
            setUserId('10');
            await handleCrudOperation('DELETE', 10, '', 0);
            // check that the result is missing User 8
            if (resultTmp.includes('User 8')) {
                alert('Failed to delete user');
            }


            await delay(testWait);
            setTestName('Test Suite Completed');
        } catch (error) {
            const err = error as any;
            setJsonResult(`Error: ${err.response ? err.response.data : err.message}`);
        }
        setIsRunningTests(false);
    };

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Stack direction="row" spacing={3}>
                <Paper elevation={3} sx={{ padding: 2, flex: 1 }}>
                    <Typography variant="h6">Endpoints</Typography>
                    <RadioGroup
                        value={selectedEndpoint}
                        onChange={(e) => setSelectedEndpoint(e.target.value)}
                    >
                        <Stack direction="row" alignItems="center">
                            <FormControlLabel value="endpoint1" control={<Radio />} label="Endpoint 1" />
                            <TextField
                                label="Endpoint 1 Port"
                                value={endpoint1}
                                onChange={(e) => setEndpoint1(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <FormControlLabel value="endpoint2" control={<Radio />} label="Endpoint 2" />
                            <TextField
                                label="Endpoint 2 Port"
                                value={endpoint2}
                                onChange={(e) => setEndpoint2(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <FormControlLabel value="endpoint3" control={<Radio />} label="Endpoint 3" />
                            <TextField
                                label="Endpoint 3 Port"
                                value={endpoint3}
                                onChange={(e) => setEndpoint3(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </Stack>

                    </RadioGroup>
                    <Typography variant="h6">Test Manager</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {isRunningTests ? (
                            <Button variant="contained" color="primary" onClick={() => setIsRunningTests(false)}>
                                STOP TEST SUITE
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={runTestSuite} >
                                RUN TEST SUITE
                            </Button>
                        )}
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="h6">Current Test: {testName}</Typography>
                    </Stack>
                </Paper>
                <Paper elevation={3} sx={{ padding: 2, flex: 1 }}>
                    <Typography variant="h6">CRUD Operations</Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('GET_ALL')}>
                                GET ALL USERS
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('DELETE_ALL', 0, '', 0, true)}>
                                DELETE ALL USERS
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('GET')}>
                                GET USER
                            </Button>
                            <TextField
                                label="User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                margin="normal"
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('POST')}>
                                ADD USER
                            </Button>
                            <TextField
                                label="User Name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                margin="normal"
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('PUT')}>
                                UPDATE USER
                            </Button>
                            <TextField
                                label="User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="User Name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                margin="normal"
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('PATCH')}>
                                ADD HOURS
                            </Button>
                            <TextField
                                label="User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Hours to Add"
                                value={hoursToAdd}
                                onChange={(e) => setHoursToAdd(e.target.value)}
                                margin="normal"
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="secondary" onClick={() => handleCrudOperation('DELETE', 0, '', 0, true)}>
                                DELETE USER
                            </Button>
                            <TextField
                                label="User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                margin="normal"
                            />
                        </Stack>

                    </Stack>
                </Paper>
                <Paper elevation={3} sx={{ padding: 2, flex: 1 }}>
                    <Typography variant="h6">JSON Results</Typography>
                    <pre>{jsonResult}</pre>
                </Paper>
            </Stack>
        </Box>
    );
};

export default MainControl;