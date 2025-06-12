package webdev2.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import webdev2.eventmanagement.exception.ResourceNotFoundException;
import webdev2.eventmanagement.model.Event;
import webdev2.eventmanagement.model.EventType;
import webdev2.eventmanagement.model.enums.AccessType;
import webdev2.eventmanagement.repository.EventRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {
    public final EventRepository eventRepository;

    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Add Event
    public Event addEvent(Event event) {
        return eventRepository.save(event);
    }

    // Get Events with multiple filters and pagination
    public List<Event> getEvents(String organizerId,
                                 EventType eventType,
                                 AccessType accessType,
                                 String location,
                                 LocalDateTime startDateTime,
                                 int page,
                                 int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.ASC, "startDateTime") // Sort upcoming events first
        );

        return eventRepository.findByFiltersDynamic(
                organizerId,
                eventType,
                accessType,
                location,
                startDateTime,
                pageable
        );
    }

    // Get Event by ID
    public Event getEventById(String id) {
        Event response = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found for id: " + id));
        return response;
    }

    // Edit an Event
    public Event updateEvent(String id, Event eventDetails) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        existingEvent.setName(eventDetails.getName());
        existingEvent.setDescription(eventDetails.getDescription());
        existingEvent.setLocation(eventDetails.getLocation());
        existingEvent.setStartDateTime(eventDetails.getStartDateTime());
        existingEvent.setEndDateTime(eventDetails.getEndDateTime());
        existingEvent.setEventType(eventDetails.getEventType());
        existingEvent.setMaxParticipants(eventDetails.getMaxParticipants());
        existingEvent.setAccessType(eventDetails.getAccessType());
        return eventRepository.save(existingEvent);
    }

    // Delete an Event
    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }


}
