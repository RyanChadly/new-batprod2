import { Popover } from "antd";
import { useEffect, useRef } from "react";
import { OrderEvent } from "../../simulator/classes/orderEvent-class";
import { RessourceEvent } from "../../utils/types";
import { getShortTime } from "../../utils/utils";

interface EventProps {
  event: OrderEvent | RessourceEvent;
}

export const CalendarEvent: React.FC<EventProps> = ({ event }) => {
  const eventRef = useRef<HTMLDivElement>(null);

  const translation =
    event.startTime.getMinutes() + event.startTime.getHours() * 60;
  const totalMinutesUntilEnd =
    event.endTime.getMinutes() + event.endTime.getHours() * 60;
  const length = totalMinutesUntilEnd - translation;

  useEffect(() => {
    if (eventRef.current) {
      eventRef.current.scrollIntoView({
        behavior: "auto",
        inline: "end",
      });
    }
  }, []);

  return (
    <Popover
      key={event.id}
      trigger="click"
      content={
        <div>
          <div>{`start: ${getShortTime(event.startTime)}`}</div>
          <div>{`end: ${getShortTime(event.endTime)}`}</div>
        </div>
      }
      title={event.taskName}
    >
      <div
        ref={eventRef}
        className="event"
        style={{
          transform: `translateX(${translation * 2}px)`,
          width: `${length * 2 - 1}px`,
          display: `${length === 0 ? "none" : "block"}`,
          marginRight: `-${length * 2 - 1}px`,
        }}
      ></div>
    </Popover>
  );
};
