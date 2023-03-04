import { Divider, Popover } from "antd";
import { useAppSelector } from "../../store/hooks";
import { getShortTime } from "../../utils/utils";
import { CalendarRow } from "./calendar-row";
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
            <CalendarRow key={order.id} history={order.history} hours={hours} />
          ))}
          <Divider style={{ width: "100%" }} />
          {ressources.map((ressource) => (
            <CalendarRow
              key={ressource.name}
              history={ressource.history}
              hours={hours}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
