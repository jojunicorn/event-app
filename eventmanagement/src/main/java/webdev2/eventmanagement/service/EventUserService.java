package webdev2.eventmanagement.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import webdev2.eventmanagement.model.Event;
import webdev2.eventmanagement.model.EventUser;
import webdev2.eventmanagement.model.enums.AccessType;
import webdev2.eventmanagement.model.enums.EventUserStatus;
import webdev2.eventmanagement.repository.EventRepository;
import webdev2.eventmanagement.repository.EventUserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EventUserService {
    private final EventUserRepository eventUserRepository;
    private final EventRepository eventRepository;

    @Autowired
    public EventUserService(EventUserRepository eventUserRepository, EventRepository eventRepository) {
        this.eventUserRepository = eventUserRepository;
        this.eventRepository = eventRepository;
    }

    public List<EventUser> getEventAttendees(String eventId) {
        return eventUserRepository.findByEventId(eventId);
    }

    public List<EventUser> getUserEvents(String userId) {
        return eventUserRepository.findByUserId(userId);
    }

    public EventUser getUserEventStatus(String eventId, String userId) {
        EventUser eventUser = eventUserRepository.findByEventIdAndUserId(eventId, userId).orElseThrow(() -> new IllegalStateException("Status not found"));
        return eventUser;
    }

    public EventUser registerUserForEvent(String eventId, String userId) {
        if (eventUserRepository.findByEventIdAndUserId(eventId, userId).isPresent()) {
            throw new IllegalStateException("User already registered for this event");
        }

        Event event = eventRepository.findById(eventId).orElseThrow(() -> new IllegalStateException("Event not found"));

        EventUser eventUser = new EventUser();

        if(event.getAccessType() == AccessType.public_access) {
            eventUser.setStatus(EventUserStatus.approved);
        } else {
            eventUser.setStatus(EventUserStatus.pending);
        }

        eventUser.setEventId(eventId);
        eventUser.setUserId(userId);

        return eventUserRepository.save(eventUser);
    }

    public int spotsLeft(String eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new IllegalStateException("Event not found"));

        int eventAttendeeNumber = eventUserRepository.findByEventId(eventId).size();

        return event.getMaxParticipants() - eventAttendeeNumber;
    }

    @Transactional
    public EventUser updateEventUserStatus(String eventId, String userId, EventUserStatus status) {
        EventUser eventUser = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new IllegalStateException("Registration not found"));

        eventUser.setStatus(status);
        return eventUserRepository.save(eventUser);
    }

    @Transactional
    public void removeUserFromEvent(String eventId, String userId) {
        EventUser eventUser = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new IllegalStateException("Registration not found"));

        eventUserRepository.delete(eventUser);
    }
}
