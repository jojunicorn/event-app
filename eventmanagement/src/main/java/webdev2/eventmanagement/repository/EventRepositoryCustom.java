package webdev2.eventmanagement.repository;

import org.springframework.data.domain.Pageable;
import webdev2.eventmanagement.model.Event;
import webdev2.eventmanagement.model.EventType;
import webdev2.eventmanagement.model.enums.AccessType;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepositoryCustom {
    List<Event> findByFiltersDynamic(String organizerId, EventType eventType, AccessType accessType,
                                     String location, LocalDateTime startDateTime, Pageable pageable);
}
