import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { useAppSelector } from "@/app/config/store";
import ScratchCard from "@components/scratch-card/scratch-card";
import CartRibbon from "@components/cart-ribbon/cart-ribbon";
import "./home.scss";
import { Spinner } from "reactstrap";

dayjs.extend(utc);
dayjs.extend(timezone);

const Home = () => {
  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated
  );

  const account = useAppSelector((state) => state.authentication.account);

  const [userExtra, setUserExtra] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (account?.id) {
        try {
          const { data } = await axios.get(
            `/api/user-extras/user/${account.id}`
          );

          setUserExtra(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [account?.id]);

  const calculateSecondsUntilNextDraw = () => {
    const now = dayjs().tz("Asia/Kolkata");
    let nextDraw = now.day(4).hour(21).minute(30).second(0).millisecond(0); // Thursday 9:30 PM IST

    // If it's already past Thursday 9:30 PM this week, move to next week
    if (nextDraw.isBefore(now) || nextDraw.isSame(now)) {
      nextDraw = nextDraw.add(1, "week");
    }

    return nextDraw.diff(now, "second");
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateSecondsUntilNextDraw);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedTickets = useMemo(() => {
    const parseOid = (oid: string) => {
      const match = oid.match(/^OM\s(\d+)-(\d+)-(\d+)$/);
      if (!match) return [0, 0, 0];
      const [, date, series, number] = match;
      return [parseInt(date, 10), parseInt(series, 10), parseInt(number, 10)];
    };

    return [...tickets].sort((a, b) => {
      const [dateA, seriesA, numA] = parseOid(a.oid);
      const [dateB, seriesB, numB] = parseOid(b.oid);

      if (dateA !== dateB) return dateA - dateB;
      if (seriesA !== seriesB) return seriesA - seriesB;
      return numA - numB;
    });
  }, [tickets]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSecondsLeft = calculateSecondsUntilNextDraw();
      setSecondsLeft(newSecondsLeft > 0 ? newSecondsLeft : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/tickets/active-batch");
        // Transform the response to fit your frontend shape
        const mappedTickets = response.data.map((ticket: any) => ({
          id: ticket.id,
          oid: ticket.oid,
          numbers:
            ticket.ticketKey?.split(" ").map((n: string) => Number(n)) || [],
          slot: ticket.availableSlot ?? 0,
        }));
        setTickets(mappedTickets);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const formatTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const { days, hours, minutes, seconds } = formatTime(secondsLeft);

  return (
    <article className="home-page d-flex flex-column w-100">
      <section className="hero-section position-relative">
        <picture className="hero-banner">
          <source
            srcSet="/images/hero-banner-home.webp"
            media="(min-width: 768px)"
          />
          <img src="/images/hero-banner-mobile.webp" alt="" />
        </picture>

        <div className="draw-timer d-flex flex-column justify-content-center align-items-center gap-2 position-absolute">
          <h2>NEXT DRAW in</h2>
          <div className="timer-box d-flex justify-content-center align-items-center gap-4">
            {parseInt(days, 10) > 0 && (
              <div className="timer-box__item d-flex flex-column justify-content-center align-items-center">
                <h3>{days}</h3>
                <p>days</p>
              </div>
            )}
            <div className="timer-box__item d-flex flex-column justify-content-center align-items-center">
              <h3>{hours}</h3>
              <p>hours</p>
            </div>
            <div className="timer-box__item d-flex flex-column justify-content-center align-items-center">
              <h3>{minutes}</h3>
              <p>minutes</p>
            </div>
            <div
              className={`timer-box__item ${
                parseInt(days, 10) > 0 ? "d-none d-sm-flex" : "d-flex"
              } flex-column justify-content-center align-items-center`}
            >
              <h3>{seconds}</h3>
              <p>seconds</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sub-header">
        <p>
          ഓരോ ആഴ്ചയും വെറും ₹100-ക്ക് O! Millionaire നറുക്കെടുപ്പിൽ ഒരു
          ടിക്കറ്റെടുക്കൂ, ഭാഗ്യം നിങ്ങളെ തേടിയെത്തും!
        </p>
      </section>

      <section className="scratch-card-container">
        <div className="container-fluid auto-grid">
          {loading && (
            <Spinner color="success" className="mx-auto">
              Loading...
            </Spinner>
          )}
          {error && <p className="text-danger">{error}</p>}
          {!loading && tickets.length === 0 && <p>No active tickets found.</p>}
          {!loading &&
            sortedTickets.map((ticket) => (
              <ScratchCard
                key={ticket.oid}
                isAuthenticated={isAuthenticated}
                userExtra={userExtra}
                ticket={ticket}
              />
            ))}
        </div>
      </section>

      {isAuthenticated && <CartRibbon />}
    </article>
  );
};

export default Home;
