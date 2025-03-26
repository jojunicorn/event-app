package webdev2.eventmanagement.model.dto;

import webdev2.eventmanagement.model.EventType;
import webdev2.eventmanagement.model.enums.Role;

import java.util.Date;
import java.util.List;

public record UserResponse(String id, String name, String email, Role role, Date birthdate, List<EventType> preferences, String location) {
}
