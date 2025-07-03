package webdev2.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import webdev2.eventmanagement.exception.ResourceNotFoundException;
import webdev2.eventmanagement.model.*;
import webdev2.eventmanagement.model.enums.AccessType;
import webdev2.eventmanagement.repository.EventRepository;
import webdev2.eventmanagement.repository.EventUserRepository;
import webdev2.eventmanagement.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {
    public final EventRepository eventRepository;
    public final UserRepository userRepository;
    public final EventUserRepository eventUserRepository;
    public final NotificationService notificationService;

    @Autowired
    public EventService(EventRepository eventRepository, UserRepository userRepository, NotificationService notificationService, EventUserRepository eventUserRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.eventUserRepository = eventUserRepository;
    }

    // Add Event
    public Event addEvent(Event event) {
        Event newEvent = eventRepository.save(event);

        List<User> users = userRepository.findAll();
        notificationService.notifyEventCreated(newEvent, users);

        return newEvent;
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

        boolean significantChange = false;
        StringBuilder changeSummary = new StringBuilder("The following details of the event have changed:\n");

        // Check and track changes
        if (!existingEvent.getName().equals(eventDetails.getName())) {
            changeSummary.append("- Name: ").append(existingEvent.getName()).append(" → ").append(eventDetails.getName()).append("\n");
            existingEvent.setName(eventDetails.getName());
            significantChange = true;
        }

        if (!existingEvent.getDescription().equals(eventDetails.getDescription())) {
            changeSummary.append("- Description updated.\n");
            existingEvent.setDescription(eventDetails.getDescription());
            significantChange = true;
        }

        if (!existingEvent.getLocation().equals(eventDetails.getLocation())) {
            changeSummary.append("- Location: ").append(existingEvent.getLocation()).append(" → ").append(eventDetails.getLocation()).append("\n");
            existingEvent.setLocation(eventDetails.getLocation());
            significantChange = true;
        }

        if (!existingEvent.getStartDateTime().equals(eventDetails.getStartDateTime())) {
            changeSummary.append("- Start Time: ").append(existingEvent.getStartDateTime()).append(" → ").append(eventDetails.getStartDateTime()).append("\n");
            existingEvent.setStartDateTime(eventDetails.getStartDateTime());
            significantChange = true;
        }

        if (!existingEvent.getEndDateTime().equals(eventDetails.getEndDateTime())) {
            changeSummary.append("- End Time: ").append(existingEvent.getEndDateTime()).append(" → ").append(eventDetails.getEndDateTime()).append("\n");
            existingEvent.setEndDateTime(eventDetails.getEndDateTime());
            significantChange = true;
        }

        if (!existingEvent.getEventType().equals(eventDetails.getEventType())) {
            changeSummary.append("- Type: ").append(existingEvent.getEventType()).append(" → ").append(eventDetails.getEventType()).append("\n");
            existingEvent.setEventType(eventDetails.getEventType());
            significantChange = true;
        }

        if (!existingEvent.getAccessType().equals(eventDetails.getAccessType())) {
            changeSummary.append("- Access Type changed.\n");
            existingEvent.setAccessType(eventDetails.getAccessType());
            significantChange = true;
        }

        if (existingEvent.getMaxParticipants() != eventDetails.getMaxParticipants()) {
            if (existingEvent.getMaxParticipants() > eventDetails.getMaxParticipants()) {
                changeSummary.append("- The number of available spots has been decreased.\n");
            } else changeSummary.append("- The number of available spots has been increased.\n");

            existingEvent.setMaxParticipants(eventDetails.getMaxParticipants());
            significantChange = true;
        }
        Event updatedEvent = eventRepository.save(existingEvent);

        if (significantChange) {
            List<String> userIds = eventUserRepository.findByEventId(id)
                    .stream()
                    .map(EventUser::getUserId)
                    .toList();
            notificationService.notifyEventUpdated(updatedEvent, changeSummary.toString(), userIds);
        }

        return updatedEvent;
    }


    // Delete an Event
    public void deleteEvent(String id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // notify if event canceled
        List<EventUser> usersToBeNotified = eventUserRepository.findByEventId(id);
        for (EventUser eventUser : usersToBeNotified) {
            notificationService.notifyEventCanceled(event, eventUser.getUserId());
            eventUserRepository.delete(eventUser);
        }

        eventRepository.deleteById(id);
    }


    public List<Event> getEventsStartingAt(LocalDateTime targetTime) {
        // For ±5 minute tolerance
        LocalDateTime from = targetTime.minusMinutes(5);
        LocalDateTime to = targetTime.plusMinutes(5);
        return eventRepository.findByStartDateTimeBetween(from, to);
    }

}
