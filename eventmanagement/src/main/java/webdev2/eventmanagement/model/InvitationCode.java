package webdev2.eventmanagement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "invitationCodes")
public class InvitationCode {
    @Id
    private String id;
    private String eventId;
    private String userId;
    private String code;
    private LocalDateTime createdAt;
}
