package webdev2.eventmanagement.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import webdev2.eventmanagement.model.Event;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String>, EventRepositoryCustom {
    List<Event> findByStartDateTimeBetween(LocalDateTime from, LocalDateTime to);

}
