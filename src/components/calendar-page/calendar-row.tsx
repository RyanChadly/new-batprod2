import { OrderEvent } from "../../simulator/classes/orderEvent-class";
import { RessourceEvent } from "../../utils/types";
import { CalendarEvent } from "./event";
import "./calendar-row.scss";

interface CalendarRowProps {
  history: OrderEvent[] | RessourceEvent[] | undefined;
  hours: number[];
}
export const CalendarRow: React.FC<CalendarRowProps> = ({ history, hours }) => {
  return (
    <div className="calendar-row">
      {history
        ? history.map((event) => <CalendarEvent key={event.id} event={event} />)
        : null}
      {hours.map((hour) => (
        <>
          <div key={`${hour}1`} className={"halfhour first"} />
          <div key={`${hour}2`} className={"halfhour second"} />
        </>
      ))}
    </div>
  );
};
