package webdev2.eventmanagement.util;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import java.security.SecureRandom;
import java.util.Base64;

public class PasswordHashingUtil {

    // Configure the Argon2 encoder with desired parameters
    private static final int HASH_LENGTH = 32; // 32 bytes hash
    private static final int PARALLELISM = 1;  // Number of threads
    private static final int MEMORY = 1 << 12; // Memory usage (4 MB)
    private static final int ITERATIONS = 3;   // Number of iterations

    private static final Argon2PasswordEncoder passwordEncoder =
            new Argon2PasswordEncoder(HASH_LENGTH, HASH_LENGTH, PARALLELISM, MEMORY, ITERATIONS);

    private static final int SALT_LENGTH = 16; // 16 bytes salt

    /**
     * Hashes a password using Argon2 with a provided salt.
     * @param password The plain text password to hash.
     * @param salt The salt to use for hashing.
     * @return The hashed password.
     */
    public static String hashPasswordWithSalt(String password, String salt) {
        // Combine salt and password
        String saltedPassword = salt + password;
        return passwordEncoder.encode(saltedPassword);
    }

    /**
     * Verifies a password against the stored hash using the provided salt.
     * @param rawPassword The plain text password to verify.
     * @param salt The salt used during hashing.
     * @param encodedPassword The encoded password hash to verify against.
     * @return true if the password matches, false otherwise.
     */
    public static boolean verifyPasswordWithSalt(String rawPassword, String salt, String encodedPassword) {
        // Combine salt and password
        String saltedPassword = salt + rawPassword;
        return passwordEncoder.matches(saltedPassword, encodedPassword);
    }

    /**
     * Generates a secure random salt using the provided length.
     * @return A base64 encoded salt string.
     */
    public static String generateSalt() {
        byte[] salt = new byte[SALT_LENGTH];
        new SecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }
}
