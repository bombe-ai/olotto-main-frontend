import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "./ticket-image.scss";

dayjs.extend(utc);
dayjs.extend(timezone);

interface TicketImageProps {
  ticketId: string;
  ticketNumbers: number[];
}

// Function to get next Thursday draw date in DD/MM/YYYY format
const getNextThursdayDrawDate = (): string => {
  const now = dayjs().tz("Asia/Kolkata");
  let nextDraw = now.day(4).hour(21).minute(30).second(0).millisecond(0); // Thursday 9:30 PM IST

  // If it's already past Thursday 9:30 PM this week, move to next week
  if (nextDraw.isBefore(now) || nextDraw.isSame(now)) {
    nextDraw = nextDraw.add(1, "week");
  }

  return nextDraw.format("DD/MM/YYYY");
};

const TicketImage: React.FC<TicketImageProps> = React.memo(
  ({ ticketId, ticketNumbers }) => {
    const topNumbers = ticketNumbers.slice(0, 3);
    const bottomNumbers = ticketNumbers.slice(3);

    const renderNumberRow = (
      numbers: number[],
      keyPrefix: string,
      isTopRow = false
    ) => (
      <div
        className={`${
          isTopRow ? "first-row" : "second-row"
        } d-flex justify-content-evenly align-items-center`}
      >
        {numbers.map((num, index) => (
          <span
            key={`${keyPrefix}-${index}`}
            className={`${
              isTopRow ? "top-item" : "bottom-item"
            } ticket-numbers__item rounded-5 d-flex justify-content-center align-items-center`}
          >
            {num}
          </span>
        ))}
      </div>
    );

    return (
      <picture className="ticket-image position-relative">
        <img src="/images/scratch-card-image.png" alt="Scratch card" />

        <div className="ticket-draw-time position-absolute">
          DATE OF DRAW: {getNextThursdayDrawDate()}
        </div>

        <div className="ticket-id position-absolute d-flex justify-content-center align-items-center">
          <span>{ticketId}</span>
        </div>

        <div className="ticket-numbers position-absolute d-flex flex-column justify-content-center align-items-center">
          {renderNumberRow(topNumbers, "top", true)}
          {renderNumberRow(bottomNumbers, "bottom")}
        </div>
      </picture>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.ticketId === nextProps.ticketId &&
      prevProps.ticketNumbers.length === nextProps.ticketNumbers.length &&
      prevProps.ticketNumbers.every(
        (num, index) => num === nextProps.ticketNumbers[index]
      )
    );
  }
);

export default TicketImage;
