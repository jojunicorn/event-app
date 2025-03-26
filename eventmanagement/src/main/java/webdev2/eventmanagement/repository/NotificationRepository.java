package webdev2.eventmanagement.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import webdev2.eventmanagement.model.Notification;

public interface NotificationRepository extends MongoRepository<Notification, Long> {
}
