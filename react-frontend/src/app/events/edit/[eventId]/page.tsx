'use client'

import EditEvent from '../../../components/Events/EditEvent';
import { useParams } from 'next/navigation';

export default function EventsPage() {
    const params = useParams();
    const eventIdParam = params?.eventId;

    if (!eventIdParam || Array.isArray(eventIdParam)) {
    return <p>Invalid event ID</p>;
    }

    const eventId: string = eventIdParam;

    return (
    <main>
        <EditEvent eventId={eventId} />
    </main>
    );
}
