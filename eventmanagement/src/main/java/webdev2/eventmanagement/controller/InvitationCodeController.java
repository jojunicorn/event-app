package webdev2.eventmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import webdev2.eventmanagement.model.InvitationCode;
import webdev2.eventmanagement.service.EventUserService;
import webdev2.eventmanagement.service.InvitationCodeService;

@RestController
@RequestMapping("/invitation")
public class InvitationCodeController {

    private final InvitationCodeService invitationCodeService;
    private final EventUserService eventUserService;

    @Autowired
    public InvitationCodeController(InvitationCodeService invitationCodeService, EventUserService eventUserService) {
        this.invitationCodeService = invitationCodeService;
        this.eventUserService = eventUserService;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createInvitationCode(@RequestParam String eventId, @RequestParam String userId) {
        try {
            InvitationCode invitationCode = invitationCodeService.createInvitationCode(eventId, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Invitation code created: " + invitationCode.getCode());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create invitation code: " + e.getMessage());
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<Object> validateInvitationCode(@RequestParam String userId,
                                                         @RequestParam String code) {
        try {
            String eventId = invitationCodeService.validateInvitationCode(userId, code);
            if (eventId != null) {
                eventUserService.registerUserForEvent(eventId, userId, true);
                return ResponseEntity.ok("User was added to event.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid invitation code.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to validate invitation code: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Object> deleteInvitationCode(@RequestParam String code) {
        try {
            invitationCodeService.removeInvitationCode(code);
            return ResponseEntity.ok("Invitation code deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete invitation code: " + e.getMessage());
        }
    }
}
