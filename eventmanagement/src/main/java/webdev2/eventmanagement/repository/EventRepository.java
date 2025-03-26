package webdev2.eventmanagement.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import webdev2.eventmanagement.model.Event;

public interface EventRepository extends MongoRepository<Event, String> {

}
