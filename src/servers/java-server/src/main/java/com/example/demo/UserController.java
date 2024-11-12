package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private List<User> users = new ArrayList<>();
    private int nextId = 1;

    @GetMapping
    public List<User> getAllUsers() {
        return users;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        return users.stream()
            .filter(user -> user.getId() == id)
            .findFirst()
            .<ResponseEntity<?>>map(ResponseEntity::ok)  // Return the User as ResponseEntity<User>
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));  // Return 404 with a message
    }

    @PostMapping
    public User addUser(@RequestBody User user) {
        user.setId(nextId++);
        user.setHoursWorked(0);
        users.add(user);
        return user;
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable int id, @RequestBody User updatedUser) {
        for (User user : users) {
            if (user.getId() == id) {
                user.setName(updatedUser.getName());
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<User> updateUserHours(@PathVariable int id, @RequestBody Map<String, Double> update) {
        for (User user : users) {
            if (user.getId() == id) {
                user.setHoursWorked(user.getHoursWorked() + update.get("hoursToAdd"));
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable int id) {
        Iterator<User> iterator = users.iterator();
        while (iterator.hasNext()) {
            User user = iterator.next();
            if (user.getId() == id) {
                iterator.remove();
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @DeleteMapping
    public List<User> deleteAllUsers() {
        users.clear();
        nextId = 1;
        return users;
    }
}
