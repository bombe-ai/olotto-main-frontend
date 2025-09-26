import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import Lottie from "lottie-react";
import axios from "axios";

import { useAppSelector } from "@/app/config/store";
import TicketImage from "@components/ticket-image/ticket-image";
import tickAnimation from "../../lotties/tick-pop.json";
import "./purchase-success.scss";

type PurchaseItem = {
  id?: number;
  ticketId?: number;
  ticketOid?: number;
  ticketNumbers?: string[] | string;
  ticketNumber?: string | number;
  slot?: any;
  slotNo?: number;
};

const sanitize = (s?: string | null) =>
  (s || "").replace(/[^a-zA-Z0-9._-]/g, "");

const getRedirectOrderId = (params: URLSearchParams) =>
  sanitize(
    params.get("orderId") || params.get("reference_id") || params.get("refNo")
  );

const getRedirectStatus = (params: URLSearchParams) => {
  const raw =
    params.get("status") ||
    params.get("TxnStatus") ||
    params.get("message") ||
    "";
  const s = raw.toLowerCase();
  if (s.includes("success") || s === "captured" || s === "settled")
    return "success";
  if (s === "authorized" || s.includes("pend")) return "pending";
  return s.includes("cancel") || s.includes("fail") ? "failure" : s || "";
};

const PurchaseSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location as any;

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const orderId = getRedirectOrderId(params);
  const redirectStatus = getRedirectStatus(params); // "success" | "pending" | "failure" | ""
  const warn = params.get("warn") || ""; // e.g. warn=delay

  const [tickets, setTickets] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const recheckedRef = useRef<boolean>(false);

  // --- axios helpers ---
  const fetchAccountId = async (): Promise<number | null> => {
    try {
      const { data } = await axios.get("/api/account");
      const possibleId = data?.id ?? data?.user?.id ?? null;
      return typeof possibleId === "number" ? possibleId : null;
    } catch {
      return null;
    }
  };

  const fetchPurchasesByUserId = async (userId: number) => {
    try {
      const { data } = await axios.get(`/api/purchases/by-user/${userId}`);
      if (Array.isArray(data) && data.length > 0) {
        setTickets(data);
        setError(false);
      } else {
        setTickets([]);
      }
    } catch {
      setError(true);
    }
  };

  // One-time reconciliation with the gateway (updates DB, may fulfill if SUCCESS)
  const reconcileWithGateway = async (oid: string) => {
    if (!oid) return;
    try {
      await axios.post(`/api/payment/status-check/${oid}`);
    } catch {
      // ignore; DB polling still handles eventual consistency
    }
  };

  const startPendingPolling = () => {
    if (!orderId) return;
    setPending(true);
    startTimeRef.current = Date.now();
    recheckedRef.current = false;

    pollRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get(`/api/transactions/status/${orderId}`);
        const s = String(data?.status || "").toUpperCase(); // INITIATED|PENDING|SUCCESS|FAILED

        if (s === "SUCCESS") {
          if (pollRef.current) clearInterval(pollRef.current);
          setPending(false);
          const uid = await fetchAccountId();
          if (uid != null) await fetchPurchasesByUserId(uid);
          setLoading(false);
          return;
        }

        if (s === "FAILED") {
          if (pollRef.current) clearInterval(pollRef.current);
          setPending(false);
          setError(true);
          setLoading(false);
          return;
        }

        // Still INITIATED/PENDING → after ~10s, attempt one extra gateway reconciliation (only once)
        if (
          !recheckedRef.current &&
          Date.now() - startTimeRef.current > 10000
        ) {
          recheckedRef.current = true;
          await reconcileWithGateway(orderId);
        }
      } catch {
        // endpoint might not exist yet or webhook still racing — ignore
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    (async () => {
      // 1) If tickets came via navigation state, prefer that
      if (state?.purchasedTickets?.length > 0) {
        setTickets(state.purchasedTickets);
        setError(false);
        setLoading(false);
        return;
      }

      // 2) If explicitly failed, just show failure
      if (redirectStatus === "failure") {
        setError(true);
        setLoading(false);
        return;
      }

      // 3) If pending, reconcile once with gateway then poll DB by orderId
      if (redirectStatus === "pending") {
        if (orderId) {
          await reconcileWithGateway(orderId); // one-time reconciliation on landing
        }
        startPendingPolling();
        setLoading(false);
        return;
      }

      // 4) Success or unknown → do a quick reconciliation if we have an orderId, then load purchases
      const uid = await fetchAccountId();
      if (uid != null) {
        if (orderId) {
          await reconcileWithGateway(orderId); // safety: if webhook missed, this fixes DB
        }
        await fetchPurchasesByUserId(uid);
        setLoading(false);
      } else {
        // user not logged in → still show success message, just no list
        setError(false);
        setTickets([]);
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectStatus, orderId, state]);

  const title = error
    ? "Payment Failed or No Tickets"
    : pending
    ? "Finalizing Your Payment…"
    : warn === "delay"
    ? "Purchased — Finalizing Your Tickets…"
    : "Purchased Successfully";

  return (
    <article className="purchase-success w-100 vh-100">
      <div className="page-wrapper w-100 h-100 d-flex flex-column gap-4">
        <header className="purchase-success-header d-flex align-items-center gap-3">
          <Button
            className="cta-btn cta-btn--text d-flex align-items-center gap-3"
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            <h1>Go Home</h1>
          </Button>
        </header>

        <Container fluid className="purchase-success-content">
          <Row className="h-100">
            {/* Mobile header card */}
            <Col className="d-md-none">
              <section className="success-message d-flex flex-column align-items-center mb-5">
                <Lottie
                  animationData={tickAnimation}
                  loop={false}
                  autoplay
                  className="success-animation"
                />
                <h2>{title}</h2>
                {orderId && (
                  <small className="text-muted mt-2">Order ID: {orderId}</small>
                )}
                <Button
                  className="view-btn cta-btn cta-btn--primary"
                  onClick={() => navigate("/profile/my-tickets")}
                >
                  View My Tickets
                </Button>
              </section>
            </Col>

            {/* Tickets list (optional, keep commented if you prefer redirect to profile) */}
            {/* <Col md="6" lg="5" className="h-100">
              <h2>{error ? "No Tickets Found" : "Purchased Tickets"}</h2>
              <section className="ticket-list w-100 overflow-y-auto d-flex flex-column align-items-center">
                {loading ? (
                  <p className="p-3">Loading…</p>
                ) : !error && tickets.length > 0 ? (
                  tickets.map((item: PurchaseItem) => {
                    const ticketId =
                      item.ticketId || item.ticketOid || item.id || 0;
                    const ticketNumbersRaw =
                      item.ticketNumbers ??
                      (item.ticketNumber != null
                        ? String(item.ticketNumber)
                        : "");
                    const ticketNumbers = Array.isArray(ticketNumbersRaw)
                      ? ticketNumbersRaw
                      : String(ticketNumbersRaw)
                          .split(" ")
                          .filter((n) => n);

                    const slot =
                      item?.slot?.slotNumber ??
                      item?.slot?.slotNo ??
                      item?.slotNo ??
                      item?.slot ??
                      0;

                    return (
                      <article
                        key={`${ticketId}-${ticketNumbers.join(",")}`}
                        className="ticket-list__item d-flex flex-column gap-3 mx-auto"
                      >
                        <TicketImage
                          ticketId={String(ticketId)}
                          ticketNumbers={ticketNumbers.map((num) =>
                            Number(num)
                          )}
                        />
                        <div className="ticket-list__item-footer d-flex justify-content-between align-items-center gap-2">
                          <div className="people-bought d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faUser} />
                            <span>{slot}/10</span>
                          </div>
                          <div className="ticket-numbers d-flex align-items-center">
                            {ticketNumbers.map((num) => (
                              <span
                                className="ticket-numbers__item d-flex justify-content-center align-items-center rounded-5"
                                key={`${ticketId}-${num}`}
                              >
                                {num}
                              </span>
                            ))}
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : pending ? (
                  <p className="p-3">Waiting for confirmation…</p>
                ) : (
                  <p className="p-3">No Tickets Bought</p>
                )}
              </section>
            </Col> */}

            {/* Desktop side card */}
            <Col md="6" lg="7" className="d-none d-md-block mx-auto">
              <section className="success-message d-flex flex-column justify-content-center align-items-center h-100">
                <Lottie
                  animationData={tickAnimation}
                  loop={false}
                  autoplay
                  className="success-animation"
                />
                <h2>{title}</h2>
                {orderId && (
                  <small className="text-muted mt-2">Order ID: {orderId}</small>
                )}
                <Button
                  className="view-btn cta-btn cta-btn--primary"
                  onClick={() => navigate("/profile/my-tickets")}
                >
                  View My Tickets
                </Button>
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </article>
  );
};

export default PurchaseSuccess;
