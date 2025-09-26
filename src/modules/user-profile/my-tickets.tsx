import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/app/config/store";
import TicketImage from "@components/ticket-image/ticket-image";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface TicketSlot {
  ticketKey: string;
  slotKey: string;
  slotNumber: number;
  batchName: string;
  drawDate: string;
  oid?: string;
}

interface MyTicketsResponse {
  upcoming: TicketSlot[];
  past: TicketSlot[];
}

const MyTickets = () => {
  const account = useAppSelector((state) => state.authentication.account);
  const [userExtraId, setUserExtraId] = useState<number | null>(null);
  const [upcoming, setUpcoming] = useState<TicketSlot[]>([]);
  const [past, setPast] = useState<TicketSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [displayLimit, setDisplayLimit] = useState(12);

  const isActive = (tab: string) => (activeTab === tab ? "active" : "");

  // Step 1: Fetch userExtraId using account.id
  useEffect(() => {
    if (account?.id) {
      axios
        .get(`/api/user-extras/user/${account.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        })
        .then((response) => {
          setUserExtraId(response.data.id);
        })
        .catch((error) => {
          console.error("Failed to load userExtra", error);
        });
    }
  }, [account?.id]);

  // Step 2: Fetch user's ticket slots by userExtraId
  useEffect(() => {
    if (!userExtraId) return;

    axios
      .get<MyTicketsResponse>(`/api/slots/my-tickets/${userExtraId}`)
      .then(async (response) => {
        const enriched = await Promise.all(
          [...response.data.upcoming, ...response.data.past].map(
            async (slot) => {
              try {
                const ticketRes = await axios.get(
                  `/api/tickets/by-key/${slot.ticketKey}`
                );
                return {
                  ...slot,
                  oid: ticketRes.data.oid || "",
                };
              } catch {
                return { ...slot, oid: "N/A" };
              }
            }
          )
        );

        const now = new Date().toISOString();
        setUpcoming(enriched.filter((s) => s.drawDate > now));
        setPast(enriched.filter((s) => s.drawDate <= now));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load tickets", err);
        setLoading(false);
      });
  }, [userExtraId]);

  const renderTickets = (tickets: TicketSlot[]) => {
    if (loading) {
      return (
        <Spinner color="success" className="mx-auto">
          Loading...
        </Spinner>
      );
    }

    if (tickets.length === 0) {
      return (
        <div className="empty-state text-center py-5">
          <p className="text-muted">
            {activeTab === "upcoming"
              ? "You don't have any upcoming draws. Start playing today!"
              : "No past tickets to display."}
          </p>
        </div>
      );
    }

    const currentTickets = tickets.slice(0, displayLimit);
    const hasMoreTickets = tickets.length > displayLimit;

    return (
      <div className="tickets-display">
        <div className="tickets-container auto-grid">
          {currentTickets.map((ticket, index) => (
            <article
              key={index}
              className="ticket-card d-flex flex-column gap-3"
            >
              <TicketImage
                ticketId={ticket.oid || ticket.slotKey.split("/")[0]}
                ticketNumbers={ticket.ticketKey
                  .split(" ")
                  .map((n) => Number(n))}
              />

              {activeTab === "upcoming" ? (
                <footer className="d-flex justify-content-between align-items-center gap-2">
                  <p className="d-flex align-items-center gap-2 text-muted">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    Draw date
                  </p>
                  <strong>
                    {dayjs
                      .utc(ticket.drawDate)
                      .tz("Asia/Kolkata")
                      .format("MMM DD, YYYY")}
                  </strong>
                </footer>
              ) : (
                <footer className="d-flex justify-content-between align-items-center gap-2">
                  <div className="d-flex flex-column gap-1 text-muted">
                    <p className="text-small text-mute">Batch</p>
                    <strong>{ticket.batchName.toUpperCase()}</strong>
                  </div>
                  <div className="d-flex flex-column gap-1 text-muted text-end">
                    <p className="text-small text-mute">Draw ended on</p>
                    <strong>
                      {dayjs
                        .utc(ticket.drawDate)
                        .tz("Asia/Kolkata")
                        .format("MMM DD, YYYY")}
                    </strong>
                  </div>
                </footer>
              )}
            </article>
          ))}
        </div>

        {hasMoreTickets && (
          <div className="load-more-section text-center mt-4">
            <Button
              className="display-toggle-btn cta-btn cta-btn--secondary rounded-4"
              onClick={() => setDisplayLimit((prev) => prev + 12)}
            >
              Load More Tickets
            </Button>
          </div>
        )}

        {displayLimit > 12 && (
          <div className="show-less-section text-center mt-3">
            <Button
              className="display-toggle-btn cta-btn cta-btn--tertiary rounded-4"
              onClick={() => {
                setDisplayLimit(12);
                document
                  .querySelector(".my-tickets-body")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Show Less
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (loading)
    return <div className="text-center">Loading your tickets...</div>;

  return (
    <article className="my-tickets d-flex flex-column gap-4">
      <h1 className="title d-lg-none">My Tickets</h1>
      <header className="my-tickets-header d-flex align-items-center gap-5">
        <Button
          className={`tab-btn ${isActive("upcoming")}`}
          onClick={() => {
            setActiveTab("upcoming");
            setDisplayLimit(12);
          }}
        >
          Upcoming draw
        </Button>
        <Button
          className={`tab-btn ${isActive("past")}`}
          onClick={() => {
            setActiveTab("past");
            setDisplayLimit(12);
          }}
        >
          Past draw
        </Button>
      </header>
      <section className="my-tickets-body mt-4">
        {activeTab === "upcoming" && renderTickets(upcoming)}
        {activeTab === "past" && renderTickets(past)}
      </section>
    </article>
  );
};

export default MyTickets;
