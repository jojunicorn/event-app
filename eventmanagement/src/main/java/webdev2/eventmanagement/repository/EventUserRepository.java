package webdev2.eventmanagement.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import webdev2.eventmanagement.model.EventUser;

public interface EventUserRepository extends MongoRepository<EventUser, String> {
}
