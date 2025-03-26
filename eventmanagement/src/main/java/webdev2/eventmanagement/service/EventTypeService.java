package webdev2.eventmanagement.service;

import org.springframework.stereotype.Service;
import webdev2.eventmanagement.model.EventType;
import webdev2.eventmanagement.repository.EventTypeRepository;
import webdev2.eventmanagement.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class EventTypeService {

    private final EventTypeRepository eventTypeRepository;

    public EventTypeService(EventTypeRepository eventTypeRepository) {
        this.eventTypeRepository = eventTypeRepository;
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
        if (!eventTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event type not found with ID: " + id);
        }
        eventTypeRepository.deleteById(id);
    }
}
