package webdev2.eventmanagement.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import webdev2.eventmanagement.model.EventUser;

import java.util.List;
import java.util.Optional;

public interface EventUserRepository extends MongoRepository<EventUser, String> {
    List<EventUser> findByEventId(String eventId);
    List<EventUser> findByUserId(String userId);
    Optional<EventUser> findByEventIdAndUserId(String eventId, String userId);
}
