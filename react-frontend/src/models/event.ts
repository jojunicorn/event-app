import AccessTypes from "@/enums/accessTypes";

export interface Event {
    id: string | undefined;
    name: string;
    description: string;
    location: string;
    startDateTime: Date;
    endDateTime: Date;
    eventType: string;
    maxParticipants: number;
    accessType: AccessTypes;
    organizerId: string;
}

export interface EventType {
    id: string;
    name: string;
}