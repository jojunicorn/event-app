package webdev2.eventmanagement.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import webdev2.eventmanagement.exception.ResourceNotFoundException;
import webdev2.eventmanagement.model.EventType;
import webdev2.eventmanagement.service.EventTypeService;

import java.util.List;

@RestController
@RequestMapping("/eventType")
public class EventTypeController {


    private final EventTypeService eventTypeService;

    public EventTypeController(EventTypeService eventTypeService) {
        this.eventTypeService = eventTypeService;
    }

    @PostMapping
    public ResponseEntity<Object> addEventType(@RequestParam String eventTypeName) {
        try {
            EventType savedEventType = eventTypeService.addEventType(eventTypeName);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEventType);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding event type: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Object> getAllEventTypes(HttpServletRequest request) {
        try {
            List<EventType> eventTypes = eventTypeService.getAllEventTypes();
            return ResponseEntity.ok(eventTypes);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getEventTypeById(@PathVariable String id) {
        try {
            EventType eventType = eventTypeService.getEventTypeById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Event type not found with ID: " + id));
            return ResponseEntity.ok(eventType);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving event type with ID " + id + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEventType(@PathVariable String id) {
        try {
            eventTypeService.deleteEventType(id);
            return ResponseEntity.ok("Event type with ID " + id + " has been deleted.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting event type with ID " + id + ": " + e.getMessage());
        }
    }

}
