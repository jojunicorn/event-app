package webdev2.eventmanagement.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import webdev2.eventmanagement.model.Event;
import webdev2.eventmanagement.model.EventUser;
import webdev2.eventmanagement.model.User;
import webdev2.eventmanagement.model.enums.EventUserStatus;
import webdev2.eventmanagement.service.EventUserService;

import java.util.List;

@RestController
@RequestMapping("/eventUsers")
public class EventUserController {
    private final EventUserService eventUserService;

    public EventUserController(EventUserService eventUserService) {
        this.eventUserService = eventUserService;
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Object> getEventAttendees(@PathVariable String eventId) {
        try {
            List<EventUser> attendees = eventUserService.getEventAttendees(eventId);
            return ResponseEntity.ok(attendees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving event attendees: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Object> getUserEvents(@PathVariable String userId) {
        try {
            List<Event> usersEvents = eventUserService.getUserEvents(userId);
            return ResponseEntity.ok(usersEvents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user events: " + e.getMessage());
        }
    }

    @GetMapping("/approveNeeded")
    public ResponseEntity<Object> getUsersWaitingForApproval(@RequestParam String eventId) {
        try {
            List<User> users = eventUserService.getUsersWaitingForApproval(eventId);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user events: " + e.getMessage());
        }
    }


    @GetMapping("/{eventId}/{userId}")
    public ResponseEntity<Object> getUserEventStatus(@PathVariable String eventId, @PathVariable String userId) {
        try {
            EventUser eventUser = eventUserService.getUserEventStatus(eventId, userId);
            return ResponseEntity.status(HttpStatus.OK).body(eventUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user event status: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Object> registerUserForEvent(@RequestParam String eventId, @RequestParam String userId) {
        try {
            EventUser eventUser = eventUserService.registerUserForEvent(eventId, userId, false);
            return ResponseEntity.status(HttpStatus.CREATED).body(eventUser);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registering user for event: " + e.getMessage());
        }
    }

    @GetMapping("/nrOfSpotsLeft")
    public ResponseEntity<Object> getNrOfSpotsLeft(@RequestParam String eventId) {
        try {
            int eventUser = eventUserService.spotsLeft(eventId);
            return ResponseEntity.status(HttpStatus.OK).body(eventUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user event status: " + e.getMessage());
        }
    }

    @PutMapping("/{eventId}/{userId}")
    public ResponseEntity<Object> updateEventUserStatus(
            @PathVariable String eventId,
            @PathVariable String userId,
            @RequestParam EventUserStatus status) {
        try {
            EventUser eventUser = eventUserService.updateEventUserStatus(eventId, userId, status);
            return ResponseEntity.ok(eventUser);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating event user status: " + e.getMessage());
        }
    }

    @DeleteMapping("/{eventId}/{userId}")
    public ResponseEntity<Object> removeUserFromEvent(@PathVariable String eventId, @PathVariable String userId) {
        try {
            eventUserService.removeUserFromEvent(eventId, userId);
            return ResponseEntity.ok("User removed from event successfully.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error removing user from event: " + e.getMessage());
        }
    }
}
