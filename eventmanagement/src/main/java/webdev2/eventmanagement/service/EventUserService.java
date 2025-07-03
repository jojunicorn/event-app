package webdev2.eventmanagement.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import webdev2.eventmanagement.model.Event;
import webdev2.eventmanagement.model.EventUser;
import webdev2.eventmanagement.model.InvitationCode;
import webdev2.eventmanagement.model.User;
import webdev2.eventmanagement.model.enums.AccessType;
import webdev2.eventmanagement.model.enums.EventUserStatus;
import webdev2.eventmanagement.repository.EventRepository;
import webdev2.eventmanagement.repository.EventUserRepository;
import webdev2.eventmanagement.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventUserService {
    private final EventUserRepository eventUserRepository;
    private final EventRepository eventRepository;
    private final InvitationCodeService invitationCodeService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Autowired
    public EventUserService(EventUserRepository eventUserRepository, EventRepository eventRepository, InvitationCodeService invitationCodeService, UserRepository userRepository, NotificationService notificationService) {
        this.eventUserRepository = eventUserRepository;
        this.eventRepository = eventRepository;
        this.invitationCodeService = invitationCodeService;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<EventUser> getEventAttendees(String eventId) {
        return eventUserRepository.findByEventId(eventId);
    }

    public List<Event> getUserEvents(String userId) {
        List<EventUser> eventUsers = eventUserRepository.findByUserId(userId);
        List<Event> events = new ArrayList<>();
        for (EventUser eventUser : eventUsers) {
            Event event = eventRepository.findById(eventUser.getEventId()).orElse(null);
            if (event != null) {
                events.add(event);
            }
        }

        return events;
    }

    public EventUser getUserEventStatus(String eventId, String userId) {
        EventUser eventUser = eventUserRepository.findByEventIdAndUserId(eventId, userId).orElseThrow(() -> new IllegalStateException("Status not found"));
        return eventUser;
    }

    public EventUser registerUserForEvent(String eventId, String userId, boolean invited) {
        if (eventUserRepository.findByEventIdAndUserId(eventId, userId).isPresent()) {
            throw new IllegalStateException("User already registered for this event");
        }

        Event event = eventRepository.findById(eventId).orElseThrow(() -> new IllegalStateException("Event not found"));

        EventUser eventUser = new EventUser();

        if (!invited) {
            if (event.getAccessType() == AccessType.public_access) {
                eventUser.setStatus(EventUserStatus.approved);
            } else {
                eventUser.setStatus(EventUserStatus.pending);
            }
        } else eventUser.setStatus(EventUserStatus.approved);

        notificationService.sendEventJoiningConfirmation(eventUser.getStatus(), userId, event);

        eventUser.setEventId(eventId);
        eventUser.setUserId(userId);

        return eventUserRepository.save(eventUser);
    }

    public EventUser registerInvitedUserForEvent(String eventId, String userId, String invitationCode) {

        if (invitationCodeService.validateInvitationCode(userId, invitationCode) != null) {
            EventUser eventUser = new EventUser();
            eventUser.setStatus(EventUserStatus.approved);
            eventUser.setEventId(eventId);
            eventUser.setUserId(userId);

            invitationCodeService.removeInvitationCode(invitationCode);

            return eventUserRepository.save(eventUser);
        } else throw new IllegalStateException("Invitation code is invalid");
    }

    public int spotsLeft(String eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new IllegalStateException("Event not found"));

        int eventAttendeeNumber = eventUserRepository.findByEventId(eventId).size();

        return event.getMaxParticipants() - eventAttendeeNumber;
    }

    public List<User> getUsersWaitingForApproval(String eventId) {
        List<EventUser> eventUsers = eventUserRepository.findByEventId(eventId);

        List<User> users = new ArrayList<>();
        for (EventUser eventUser : eventUsers) {
            if (!eventUser.getStatus().equals(EventUserStatus.approved)) {
                User user = userRepository.findById(eventUser.getUserId()).orElse(null);
                if (user != null) {
                    users.add(user);
                }
            }
        }

        return users;
    }

    @Transactional
    public EventUser updateEventUserStatus(String eventId, String userId, EventUserStatus status) {
        EventUser eventUser = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new IllegalStateException("Registration not found"));

        if(status == EventUserStatus.approved) {
            eventUser.setStatus(status);
            Event event = eventRepository.findById(eventId).orElseThrow(() -> new IllegalStateException("Event not found"));
            notificationService.sendEventJoiningConfirmation(eventUser.getStatus(), userId, event);

            return eventUserRepository.save(eventUser);
        }else {
            eventUserRepository.delete(eventUser);
            return null;
        }
    }

    public void removeUserFromEvent(String eventId, String userId) {
        EventUser eventUser = eventUserRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new IllegalStateException("Registration not found"));

        eventUserRepository.delete(eventUser);
    }

    public List<String> getApprovedUserIdsForEvent(String eventId) {
        return eventUserRepository.findByEventIdAndStatus(eventId, EventUserStatus.approved)
                .stream()
                .map(EventUser::getUserId)
                .collect(Collectors.toList());
    }

}
