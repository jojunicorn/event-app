package webdev2.eventmanagement.service;

import org.springframework.stereotype.Service;
import webdev2.eventmanagement.model.EventType;
import webdev2.eventmanagement.model.User;
import webdev2.eventmanagement.repository.EventTypeRepository;
import webdev2.eventmanagement.exception.ResourceNotFoundException;
import webdev2.eventmanagement.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EventTypeService {

    private final EventTypeRepository eventTypeRepository;
    private final UserRepository userRepository;

    public EventTypeService(EventTypeRepository eventTypeRepository, UserRepository userRepository) {
        this.eventTypeRepository = eventTypeRepository;
        this.userRepository = userRepository;
    }

    public EventType addEventType(String eventTypeName) {
        EventType newEventType = new EventType();
        newEventType.setName(eventTypeName);
        return eventTypeRepository.save(newEventType);
    }

    public List<EventType> getAllEventTypes() {
        List<EventType> results = eventTypeRepository.findAll();
        if(results.isEmpty()) {
            throw new ResourceNotFoundException("No event types found.");
        }
        return results;
    }

    public Optional<EventType> getEventTypeById(String id) {
        return eventTypeRepository.findById(id);
    }

    public void deleteEventType(String id) {
        EventType eventType = eventTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event type not found with ID: " + id));

        List<User>users = userRepository.findAll();
        for (User user : users) {
            if (user.getPreferences() != null && user.getPreferences().contains(eventType)) {
                user.getPreferences().remove(eventType);
                userRepository.save(user);
            }
        }
        eventTypeRepository.deleteById(id);
    }
}
