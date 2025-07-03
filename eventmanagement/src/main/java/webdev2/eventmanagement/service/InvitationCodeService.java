package webdev2.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import webdev2.eventmanagement.exception.ResourceNotFoundException;
import webdev2.eventmanagement.model.Event;
import webdev2.eventmanagement.model.InvitationCode;
import webdev2.eventmanagement.repository.EventRepository;
import webdev2.eventmanagement.repository.EventUserRepository;
import webdev2.eventmanagement.repository.InvitationCodeRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvitationCodeService {
    private final InvitationCodeRepository invitationCodeRepository;
    private final EventRepository eventRepository;
    private final NotificationService notificationService;

    @Autowired
    public InvitationCodeService(InvitationCodeRepository invitationCodeRepository, EventRepository eventRepository, NotificationService notificationService) {
        this.invitationCodeRepository = invitationCodeRepository;
        this.eventRepository = eventRepository;
        this.notificationService = notificationService;
    }

    // Create a new invitation code
    public InvitationCode createInvitationCode(String eventId, String userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        String code = UUID.randomUUID().toString();

        InvitationCode invitationCode = new InvitationCode();
        invitationCode.setEventId(eventId);
        invitationCode.setUserId(userId);
        invitationCode.setCode(code);
        invitationCode.setCreatedAt(LocalDateTime.now());

        // Send notification
        notificationService.sendInvitationCodeNotification(event, userId, code);

        return invitationCodeRepository.save(invitationCode);
    }

    // Validate invitation code for a given event and user
    public String validateInvitationCode(String userId, String code) {
        Optional<InvitationCode> optionalCode = invitationCodeRepository
                .findByUserIdAndCode(userId, code);

        return optionalCode.map(InvitationCode::getEventId).orElse(null);
    }

    public void removeInvitationCode(String code) {
        InvitationCode optionalCode = invitationCodeRepository
                .findByCode(code)
                .orElseThrow();
        invitationCodeRepository.delete(optionalCode);
    }

}
