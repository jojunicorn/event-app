package webdev2.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import webdev2.eventmanagement.model.Event;
import webdev2.eventmanagement.model.Notification;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReminderService {


    @Autowired
    private EventService eventService;

    @Autowired
    private EventUserService eventUserService;

    @Autowired
    private NotificationService notificationService;

    @Scheduled(cron = "0 0 * * * *") // Every hour
    public void notifyUpcomingEvents() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime target = now.plusHours(24);

        List<Event> events = eventService.getEventsStartingAt(target);

        for (Event event : events) {
            List<String> userIds = eventUserService.getApprovedUserIdsForEvent(event.getId());

            for (String userId : userIds) {
                Notification notification = new Notification();
                notification.setUserId(userId);
                notification.setTitle("Upcoming Event Reminder");
                notification.setMessage(String.format(
                        "Reminder: \"%s\" starts in 24 hours at %s.",
                        event.getName(),
                        event.getStartDateTime().format(DateTimeFormatter.ofPattern("MMMM d, yyyy 'at' h:mm a"))
                ));
                notification.setActionUrl("/events/" + event.getId());
                notification.setReadStatus(false);
                notificationService.sendNewNotification(notification);
            }
        }
    }

}
