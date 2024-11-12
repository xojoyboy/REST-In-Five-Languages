package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/gorilla/mux"
)

func TestGetAllUsers(t *testing.T) {
	req, _ := http.NewRequest("GET", "/users", nil)
	response := executeRequest(req)

	checkResponseCode(t, http.StatusOK, response.Code)

	var users []User
	json.Unmarshal(response.Body.Bytes(), &users)

	if len(users) != 0 {
		t.Errorf("Expected an empty list of users. Got %d", len(users))
	}
}

func TestAddUser(t *testing.T) {
	payload := []byte(`{"name": "John Doe"}`)

	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	response := executeRequest(req)

	checkResponseCode(t, http.StatusCreated, response.Code)

	var user User
	json.Unmarshal(response.Body.Bytes(), &user)

	if user.ID != 1 || user.Name != "John Doe" || user.HoursWorked != 0 {
		t.Errorf("Expected user with ID=1, Name=John Doe, HoursWorked=0. Got ID=%d, Name=%s, HoursWorked=%f",
			user.ID, user.Name, user.HoursWorked)
	}
}

func TestGetUserByID(t *testing.T) {
	clearUsers()
	TestAddUser(t)

	req, _ := http.NewRequest("GET", "/users/1", nil)
	response := executeRequest(req)

	checkResponseCode(t, http.StatusOK, response.Code)

	var user User
	json.Unmarshal(response.Body.Bytes(), &user)

	if user.ID != 1 || user.Name != "John Doe" {
		t.Errorf("Expected user with ID=1 and Name=John Doe. Got ID=%d, Name=%s", user.ID, user.Name)
	}
}

func TestUpdateUser(t *testing.T) {
	clearUsers()
	TestAddUser(t)

	payload := []byte(`{"name": "Jane Doe"}`)
	req, _ := http.NewRequest("PUT", "/users/1", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	response := executeRequest(req)

	checkResponseCode(t, http.StatusOK, response.Code)

	var user User
	json.Unmarshal(response.Body.Bytes(), &user)

	if user.Name != "Jane Doe" {
		t.Errorf("Expected user name to be updated to Jane Doe. Got %s", user.Name)
	}
}

func TestDeleteUser(t *testing.T) {
	clearUsers()
	TestAddUser(t)

	req, _ := http.NewRequest("DELETE", "/users/1", nil)
	response := executeRequest(req)

	checkResponseCode(t, http.StatusOK, response.Code)

	var user User
	json.Unmarshal(response.Body.Bytes(), &user)

	if user.ID != 1 {
		t.Errorf("Expected deleted user with ID=1. Got %d", user.ID)
	}
}

func TestDeleteAllUsers(t *testing.T) {
	clearUsers()
	TestAddUser(t)

	req, _ := http.NewRequest("DELETE", "/users", nil)
	response := executeRequest(req)

	checkResponseCode(t, http.StatusOK, response.Code)

	var users []User
	json.Unmarshal(response.Body.Bytes(), &users)

	if len(users) != 0 {
		t.Errorf("Expected an empty list of users after deletion. Got %d", len(users))
	}
}

func executeRequest(req *http.Request) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	router := mux.NewRouter()
	router.HandleFunc("/users", getUsers).Methods("GET")
	router.HandleFunc("/users", createUser).Methods("POST")
	router.HandleFunc("/users/{id:[0-9]+}", getUserByID).Methods("GET")
	router.HandleFunc("/users/{id:[0-9]+}", updateUser).Methods("PUT")
	router.HandleFunc("/users/{id:[0-9]+}", deleteUser).Methods("DELETE")
	router.HandleFunc("/users", deleteAllUsers).Methods("DELETE")

	router.ServeHTTP(rr, req)
	return rr
}

func checkResponseCode(t *testing.T, expected, actual int) {
	if expected != actual {
		t.Errorf("Expected response code %d. Got %d\n", expected, actual)
	}
}

func TestAddAnotherUser(t *testing.T) {
	// Add the first user
	payload1 := []byte(`{"name": "Test User"}`)
	req1, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(payload1))
	req1.Header.Set("Content-Type", "application/json")
	response1 := executeRequest(req1)
	checkResponseCode(t, http.StatusCreated, response1.Code)

	// Add the second user
	payload2 := []byte(`{"name": "Another User"}`)
	req2, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(payload2))
	req2.Header.Set("Content-Type", "application/json")
	response2 := executeRequest(req2)
	checkResponseCode(t, http.StatusCreated, response2.Code)

	var user map[string]interface{}
	json.Unmarshal(response2.Body.Bytes(), &user)

	if user["name"] != "Another User" {
		t.Errorf("Expected user name to be 'Another User'. Got '%v'", user["name"])
	}
}

func TestAddMultipleUsers(t *testing.T) {
	clearUsers()
	for i := 0; i < 9; i++ {
		payload := []byte(`{"name": "User ` + strconv.Itoa(i+1) + `"}`)
		req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(payload))
		req.Header.Set("Content-Type", "application/json")
		response := executeRequest(req)
		checkResponseCode(t, http.StatusCreated, response.Code)
	}

	req, _ := http.NewRequest("GET", "/users", nil)
	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)

	var users []map[string]interface{}
	json.Unmarshal(response.Body.Bytes(), &users)

	if len(users) != 9 {
		t.Errorf("Expected 9 users in the list. Got %d", len(users))
	}
}

func TestGetAllUsersAfterAdding(t *testing.T) {
	TestAddMultipleUsers(t) // Reuse the previous function to populate with 9 users

	req, _ := http.NewRequest("GET", "/users", nil)
	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)

	var users []map[string]interface{}
	json.Unmarshal(response.Body.Bytes(), &users)

	if len(users) != 9 {
		t.Errorf("Expected 9 users in the list. Got %d", len(users))
	}
}

func clearUsers() {
	users = []User{}
	nextID = 1
}
