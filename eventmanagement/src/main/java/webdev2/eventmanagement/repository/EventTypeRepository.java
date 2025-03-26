package webdev2.eventmanagement.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import webdev2.eventmanagement.model.EventType;

public interface EventTypeRepository extends MongoRepository<EventType, String> {
}
