import { Divider, Popover } from "antd";
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
      <div>
        <div className="hour-label"></div>
        {orders.map((order) => (
          <Popover
            key={order.id}
            placement="right"
            content={
              <div>
                <div>{`Volume: ${order.litres}`}</div>
                <div>{`Produit: ${order.product.name}`}</div>
                <div>{`Debut: ${getShortTime(
                  new Date(JSON.parse(order.startTime))
                )}`}</div>
                <div>{`Echeance: ${getShortTime(
                  new Date(JSON.parse(order.deadline))
                )}`}</div>
              </div>
            }
          >
            <div className="calendar-label">{order.customer}</div>
          </Popover>
        ))}
        <Divider style={{ width: "100%" }} />
        {ressources.map((ressource) => (
          <Popover
            key={ressource.name}
            placement="right"
            content={
              <div>
                <div>{`Capacite: ${ressource.capacityL}`}</div>
                <div>{`Type: ${ressource.type}`}</div>
                <div>{`Melange: ${
                  ressource.canMixOrders ? "oui" : "non"
                }`}</div>
              </div>
            }
          >
            <div className="calendar-label">{ressource.name}</div>
          </Popover>
        ))}
      </div>
      <div className="calendar-right-wrapper">
        <div className="calendar-header">
          {hours.map((hour) => (
            <div key={hour} className={"hour"}>
              {hour}
            </div>
          ))}
        </div>
        <div className="calendar-content-wrapper">
          {orders.map((order) => (
            <CalendarRow key={order.id} history={order.history} />
          ))}
          <Divider style={{ width: "100%" }} />
          {ressources.map((ressource) => (
            <CalendarRow key={ressource.name} history={ressource.history} />
          ))}
        </div>
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
              key={event.id}
              content={
                <div>
                  <div>{`start: ${getShortTime(event.startTime)}`}</div>
                  <div>{`end: ${getShortTime(event.endTime)}`}</div>
                </div>
              }
              title={event.taskName}
            >
              <div
                className="event"
                style={{
                  transform: `translateX(${event.translation * 2}px)`,
                  width: `${event.length * 2 - 1}px`,
                  position: "relative",

                  marginRight: `-${event.length * 2 - 1}px`,
                }}
              ></div>
            </Popover>
          ))
        : null}
    </div>
  );
};
