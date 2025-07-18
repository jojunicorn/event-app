package webdev2.eventmanagement.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import webdev2.eventmanagement.exception.DuplicateResourceException;
import webdev2.eventmanagement.exception.ResourceNotFoundException;
import webdev2.eventmanagement.model.User;
import webdev2.eventmanagement.model.dto.UserRequest;
import webdev2.eventmanagement.model.dto.UserResponse;
import webdev2.eventmanagement.model.dto.UserUpdateRequest;
import webdev2.eventmanagement.model.enums.Role;
import webdev2.eventmanagement.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping
    public ResponseEntity<Object> getAllUsers(Pageable pageable) {
        try{
            Page<UserResponse> users = userService.getAllUsers(pageable);
            return ResponseEntity.ok(users.get());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error retrieving users: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving users: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("/organizerRequests")
    public ResponseEntity<Object> getAllOrganizerRequests() {
        try{
            List<UserResponse> users = userService.getAllOrganizerRequests();
            return ResponseEntity.ok(users);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error retrieving Organizer Requests: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving Organizer Requests: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable String id) {
        try {
            UserResponse user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving users: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody UserRequest userRequest, HttpServletRequest request) {
        try {
            User newUser = userService.addUser(userRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser.getId());
        } catch (DuplicateResourceException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<Object> updateUserRole(@PathVariable String id, @RequestParam Role role, HttpServletRequest request) {
        try {
            userService.updateUserRole(id, role);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateUserPreferences(@PathVariable String id, @RequestBody UserUpdateRequest updateRequest, HttpServletRequest request) {
        try {
            userService.updateUserPreferences(id, updateRequest);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}

