import { Popover } from "antd";
import { OrderEvent } from "../../simulator/classes/orderEvent-class";
import { useAppSelector } from "../../store/hooks";
import { RessourceEvent } from "../../utils/types";
import { getShortTime } from "../../utils/utils";
import "./calendar.scss";

export const Calendar = () => {
  const orders = useAppSelector((state) => state.orders);
  const ressources = useAppSelector((state) => state.ressources);
  const hours = [...Array(24).keys()];
  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        {hours.map((hour) => (
          <div className={"hour"}>{hour}</div>
        ))}
      </div>
      <div className="calendar-content-wrapper">
        {orders.map((order) => (
          <CalendarRow history={order.history} />
        ))}
        {ressources.map((ressource) => (
          <CalendarRow history={ressource.history} />
        ))}
      </div>
    </div>
  );
};

interface CalendarRowProps {
  history: OrderEvent[] | RessourceEvent[] | undefined;
}
const CalendarRow: React.FC<CalendarRowProps> = ({ history }) => {
  const modifiedHistory = history?.map((event) => {
    const totalMinutesUntilStart =
      event.startTime.getMinutes() + event.startTime.getHours() * 60;
    const totalMinutesUntilEnd =
      event.endTime.getMinutes() + event.endTime.getHours() * 60;

    return {
      translation: totalMinutesUntilStart,
      length: totalMinutesUntilEnd - totalMinutesUntilStart,
      ...event,
    };
  });
  return (
    <div className="calendar-row">
      {modifiedHistory
        ? modifiedHistory.map((event, index) => (
            <Popover
              content={
                <div>
                  <div>{`start: ${getShortTime(event.startTime)}`}</div>
                  <div>{`end: ${getShortTime(event.endTime)}`}</div>
                  <div>{`translation: ${event.translation * 2}`}</div>
                </div>
              }
              title={event.taskName}
            >
              <div
                className="event"
                style={{
                  transform: `translateX(${event.translation * 2}px)`,
                  width: `${event.length * 2}px`,
                  position: "relative",

                  marginRight: `-${event.length * 2}px`,
                }}
              >
                {/* <span>{event.startTime.getHours()}</span>
              <span>{event.startTime.getMinutes()}</span> */}
              </div>
            </Popover>
          ))
        : null}
    </div>
  );
};
