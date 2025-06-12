package webdev2.eventmanagement.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import webdev2.eventmanagement.model.Event;
import webdev2.eventmanagement.model.EventType;
import webdev2.eventmanagement.model.enums.AccessType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class EventRepositoryCustomImpl implements EventRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<Event> findByFiltersDynamic(String organizerId, EventType eventType, AccessType accessType,
                                            String location, LocalDateTime startDateTime, Pageable pageable) {

        List<Criteria> criteriaList = new ArrayList<>();

        if (organizerId != null && !organizerId.isBlank()) {
            criteriaList.add(Criteria.where("organizerId").regex(organizerId, "i"));
        }

        if (eventType != null) {
            criteriaList.add(Criteria.where("eventType").is(eventType));
        }

        if (accessType != null) {
            criteriaList.add(Criteria.where("accessType").is(accessType));
        }

        if (location != null && !location.isBlank()) {
            criteriaList.add(Criteria.where("location").regex(location, "i"));
        }

        if (startDateTime != null) {
            criteriaList.add(Criteria.where("startDateTime").gte(startDateTime));
        }

        Query query = new Query().with(pageable);
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Event.class);
    }
}

