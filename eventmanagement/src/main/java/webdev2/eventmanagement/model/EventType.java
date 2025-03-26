package webdev2.eventmanagement.model;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "eventTypes")
public class EventType {
    @Id
    private String id;
    private String name;
}
