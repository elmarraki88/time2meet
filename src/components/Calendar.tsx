import React, {useRef} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {useEvents} from "@/lib/data/events";
import deLocale from "@fullcalendar/core/locales/de";

interface CalendarProps {
    onOpenDate: () => void;
    onOpenEvent: (info: any) => void;
}

const Calendar: React.FC<CalendarProps> = ({onOpenDate, onOpenEvent}) => {
    const calendarRef = useRef<FullCalendar>(null);

    //events aus dem eventsContext rausziehen ~Chris
    const {events} = useEvents();

    const handleDateClick = (info: any) => {
        onOpenDate();
    };

    const handleEventClick = (info: any) => {
        onOpenEvent({
            title: info.event.title,
            start: info.event.start?.toISOString(),
            end: info.event.end?.toISOString(),
            allDay: info.event.allDay,
            extendedProps: {
                description: info.event.extendedProps.description,
                location: info.event.extendedProps.location,
            },
        });
    };

    return (
        <div className="w-screen">
            <FullCalendar
                ref={calendarRef}
                height={"100vh"}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                initialView="dayGridMonth"
                selectable={true}
                editable={true}
                events={events} //Hier habe ich die Events aus dem EventsContext gezogen und eingefügt ~Chris
                eventContent={renderEventContent}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                //eventColor="green"
                locale={deLocale}
                eventDidMount={(info) => {
                    const el = info.el;
                    if (info.event.allDay) {
                        el.style.backgroundColor = "blue";
                        el.style.borderColor = "blue";
                    } else {
                        el.style.backgroundColor = "green";
                        el.style.borderColor = "green";
                    }
                    el.style.color = "white";
                    el.style.fontWeight = "normal";

                    el.addEventListener("mouseover", () => {
                        if (info.event.allDay) {
                            el.style.backgroundColor = "darkblue";
                            el.style.borderColor = "darkblue";
                        } else {
                            el.style.backgroundColor = "darkgreen";
                            el.style.borderColor = "darkgreen";
                        }
                        el.style.fontWeight = "bold";
                    });

                    el.addEventListener("mouseout", () => {
                        if (info.event.allDay) {
                            el.style.backgroundColor = "blue";
                            el.style.borderColor = "blue";
                        } else {
                            el.style.backgroundColor = "green";
                            el.style.borderColor = "green";
                        }
                        el.style.fontWeight = "normal";
                    });
                }}
            />
        </div>
    );
};

function renderEventContent(eventInfo: any) {
    return (
        <div>
            <strong>{eventInfo.event.title}</strong>
            <p>{eventInfo.event.extendedProps.description}</p>
        </div>
    );
}

export default Calendar;
