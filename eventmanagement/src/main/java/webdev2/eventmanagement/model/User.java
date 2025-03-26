package webdev2.eventmanagement.model;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import webdev2.eventmanagement.model.enums.Role;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String username;
    private String email;
    private String password;
    private String salt;
    private Role role;
    private Date birthdate;
    private List<EventType> preferences;
    private String location;


    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Assuming 'role' is a single String representing the user's role
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }
}
