package webdev2.eventmanagement.model.dto;

import webdev2.eventmanagement.model.EventType;

import java.util.List;

public record UserUpdateRequest(String location, List<EventType> preferences) {
}
