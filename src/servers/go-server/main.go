package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type User struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	HoursWorked float64 `json:"hoursWorked"`
}

var users = []User{}
var nextID = 1

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/users", getUsers).Methods("GET")
	router.HandleFunc("/users", createUser).Methods("POST")
	router.HandleFunc("/users/{id:[0-9]+}", getUserByID).Methods("GET")
	router.HandleFunc("/users/{id:[0-9]+}", updateUser).Methods("PUT")
	router.HandleFunc("/users/{id:[0-9]+}", deleteUser).Methods("DELETE")
	router.HandleFunc("/users", deleteAllUsers).Methods("DELETE")

	http.ListenAndServe(":5003", router)
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(users)
}

func getUserByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	for _, u := range users {
		if u.ID == id {
			json.NewEncoder(w).Encode(u)
			return
		}
	}
	http.Error(w, "User not found", http.StatusNotFound)
}

func createUser(w http.ResponseWriter, r *http.Request) {
	var user User
	json.NewDecoder(r.Body).Decode(&user)
	user.ID = nextID
	nextID++
	users = append(users, user)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func updateUser(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	var updatedUser User
	json.NewDecoder(r.Body).Decode(&updatedUser)
	for i, u := range users {
		if u.ID == id {
			users[i].Name = updatedUser.Name
			json.NewEncoder(w).Encode(users[i])
			return
		}
	}
	http.Error(w, "User not found", http.StatusNotFound)
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	for i, u := range users {
		if u.ID == id {
			users = append(users[:i], users[i+1:]...)
			json.NewEncoder(w).Encode(u)
			return
		}
	}
	http.Error(w, "User not found", http.StatusNotFound)
}

func deleteAllUsers(w http.ResponseWriter, r *http.Request) {
	users = []User{}
	nextID = 1
	json.NewEncoder(w).Encode(users)
}
