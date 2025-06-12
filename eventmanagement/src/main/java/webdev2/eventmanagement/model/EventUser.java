package webdev2.eventmanagement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import webdev2.eventmanagement.model.enums.EventUserStatus;

@Data
@Document(collection = "eventUsers")
public class EventUser {
    @Id
    private String id;
    private String eventId;
    private String userId;
    private EventUserStatus status;
}
