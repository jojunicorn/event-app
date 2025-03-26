package webdev2.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import webdev2.eventmanagement.exception.DuplicateResourceException;
import webdev2.eventmanagement.exception.InvalidOperationException;
import webdev2.eventmanagement.exception.ResourceNotFoundException;
import webdev2.eventmanagement.model.User;
import webdev2.eventmanagement.model.dto.UserRequest;
import webdev2.eventmanagement.model.dto.UserResponse;
import webdev2.eventmanagement.repository.UserRepository;

import javax.naming.AuthenticationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static webdev2.eventmanagement.util.PasswordHashingUtil.*;

@Service
public class UserService {

    private final JwtService jwtService;
    private final UserRepository userRepository;


    @Autowired
    public UserService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found.");
        }

        return users.map(user -> new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getBirthdate(),
                user.getPreferences(),
                user.getLocation()
        ));
    }

    public UserResponse getUserById(String id) {
        User user =  userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for userID: " + id));
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getBirthdate(),
                user.getPreferences(),
                user.getLocation()
        );
    }

    public void deleteUser(String id) {
        // TODO check if user is connected to event
        userRepository.deleteById(id);
    }

    public User addUser(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.email())) {
            throw new DuplicateResourceException("User already exists with email: " + userRequest.email());
        }

        User user = new User();
        user.setName(userRequest.name());
        user.setEmail(userRequest.email());
        user.setUsername(userRequest.userName());
        user.setBirthdate(userRequest.birthdate());
        if (!securePassword(userRequest.password(), user)) {
            throw new InvalidOperationException("Password could not be secured for user: " + userRequest.email());
        }

        user.setRole(userRequest.role());
        return userRepository.save(user);
    }

    private boolean securePassword(String password, User user) {
        String salt = generateSalt();
        String hashedPassword = hashPasswordWithSalt(password, salt);
        if (verifyPasswordWithSalt(password, salt, hashedPassword)) {
            user.setPassword(hashedPassword);
            user.setSalt(salt);
            return true;
        } else {
            return false;
        }
    }


    private User login(String email, String rawPassword) throws AuthenticationException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("User not found with email: " + email));

        String storedHashedPassword = user.getPassword();
        String storedSalt = user.getSalt();

        if(verifyPasswordWithSalt(rawPassword, storedSalt, storedHashedPassword)) return user;
        else throw new AuthenticationException("Invalid username/password");
    }

    public String tokenProvider(String email, String password) throws Exception {
        User user = login(email, password);
        String token = jwtService.generateJwtToken(user);
        return token;
    }

    public User getUserByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if(userOpt.isPresent()){
            return userOpt.get();
        }else throw new ResourceNotFoundException("User not found with email: " + email);
    }
}

