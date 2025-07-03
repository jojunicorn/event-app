package webdev2.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import webdev2.eventmanagement.exception.ResourceNotFoundException;
import webdev2.eventmanagement.model.Event;
import webdev2.eventmanagement.model.Notification;
import webdev2.eventmanagement.model.User;
import webdev2.eventmanagement.model.enums.EventUserStatus;
import webdev2.eventmanagement.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAllForUserId (String userId) {

        System.out.println("Fetching notifications for user: " + userId);
        List<Notification> result = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        System.out.println("Found notifications: " + result.size());

        return result;
    }

    public Notification sendNewNotification (Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        notification.setReadStatus(false);
        return notificationRepository.save(notification);
    }


    public void notifyEventCreated(Event event, List<User> allUsers) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy 'at' h:mm a");
        String formattedDate = event.getStartDateTime().format(formatter);

        for (User user : allUsers) {
            boolean matchesType = user.getPreferences() != null &&
                    user.getPreferences().stream()
                            .anyMatch(pref -> pref.getName().equalsIgnoreCase(event.getEventType()));


            boolean matchesLocation = user.getLocation() != null &&
                    user.getLocation().equalsIgnoreCase(event.getLocation());

            if (matchesType || matchesLocation) {
                Notification notification = new Notification();
                notification.setUserId(user.getId());

                String reason;
                if (matchesType && matchesLocation) {
                    reason = String.format("your interest in %s events in %s", event.getEventType(), event.getLocation());
                } else if (matchesType) {
                    reason = String.format("your interest in %s events", event.getEventType());
                } else {
                    reason = String.format("your location: %s", event.getLocation());
                }

                notification.setTitle(String.format("A New %s Event Just Landed!", event.getEventType()));
                notification.setMessage(String.format(
                        "Hi %s, based on %s, we thought you'd like \"%s\". Happening on %s — don't miss it!",
                        user.getName(),
                        reason,
                        event.getName(),
                        formattedDate
                ));
                notification.setActionUrl("/events/" + event.getId());
                notification.setReadStatus(false);

                sendNewNotification(notification);
            }
        }
    }


    public void notifyEventUpdated(Event event, String changeSummary, List<String> userIds) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy 'at' h:mm a");
        String formattedDate = event.getStartDateTime().format(formatter);

        for (String userId : userIds) {
            Notification notification = new Notification();
            notification.setUserId(userId);
            notification.setTitle(String.format("Update: %s Has Been Modified", event.getName()));
            notification.setMessage(String.format(
                    "The event \"%s\" you registered for has been updated (starting on %s).\n\n%s",
                    event.getName(),
                    formattedDate,
                    changeSummary
            ));
            notification.setActionUrl("/events/" + event.getId());
            notification.setReadStatus(false);
            sendNewNotification(notification);
        }
    }

    public void notifyEventCanceled(Event event, String userId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy 'at' h:mm a");
        String formattedDate = event.getStartDateTime().format(formatter);

        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(String.format("Event Canceled: %s", event.getName()));
        notification.setMessage(String.format(
                "We're sorry to inform you that \"%s\" scheduled on %s has been canceled.",
                event.getName(),
                formattedDate
        ));
        notification.setActionUrl(null);
        notification.setReadStatus(false);
        sendNewNotification(notification);

    }

    public void sendInvitationCodeNotification(Event event, String userId, String code) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle("You're Invited!");
        notification.setMessage(String.format(
                "You've received an invitation to join the event \"%s\".\nUse this code to join: %s",
                event.getName(),
                code
        ));
        notification.setActionUrl("/eventConfirmation?notificationCode=" + code);
        notification.setReadStatus(false);
        sendNewNotification(notification);
    }

    public void sendEventJoiningConfirmation(EventUserStatus status, String userId, Event event) {
        Notification notification = new Notification();
        notification.setUserId(userId);

        if (status.equals(EventUserStatus.approved)) {
            notification.setTitle("You're In!");
            notification.setMessage(String.format(
                    "You've been approved to join the event \"%s\".You will get your Tickets by email (future implementation since not in proposal)",
                    event.getName()
            ));
        } else if (status.equals(EventUserStatus.pending)) {
            notification.setTitle("Request Submitted");
            notification.setMessage(String.format(
                    "Your request to join the event \"%s\" has been submitted. Once approved, you'll be notified.",
                    event.getName()
            ));
        }

        notification.setActionUrl(null);
        notification.setReadStatus(false);
        sendNewNotification(notification);
    }

    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }

    public Notification updateNotificationStatusToRead(String id) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setReadStatus(true);
        return notificationRepository.save(notification);
    }



}
