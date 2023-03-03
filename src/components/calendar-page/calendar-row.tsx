import { OrderEvent } from "../../simulator/classes/orderEvent-class";
import { RessourceEvent } from "../../utils/types";
import { CalendarEvent } from "./event";

interface CalendarRowProps {
  history: OrderEvent[] | RessourceEvent[] | undefined;
}
export const CalendarRow: React.FC<CalendarRowProps> = ({ history }) => {
  return (
    <div className="calendar-row">
      {history ? history.map((event) => <CalendarEvent event={event} />) : null}
    </div>
  );
};
