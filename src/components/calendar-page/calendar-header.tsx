interface HeaderProps {
  hours: number[];
}

export const CalendarHeader: React.FC<HeaderProps> = ({ hours }) => {
  return (
    <div className="calendar-header">
      {hours.map((hour) => (
        <div key={hour} className={"hour"}>
          {hour}
        </div>
      ))}
    </div>
  );
};
