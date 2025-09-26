import { useEffect, useState } from "react";
import { Button, Spinner } from "reactstrap";
import axios from "axios";
import TicketImage from "@components/ticket-image/ticket-image";
import { useNavigate } from "react-router-dom";

const Winnings = () => {
  const navigate = useNavigate();
  const [userExtraId, setUserExtraId] = useState<number | null>(null);
  const [winnings, setWinnings] = useState<any[]>([]);
  const [totalPrize, setTotalPrize] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/account")
      .then((accountRes) => {
        const accountId = accountRes.data.id;
        return axios.get(`/api/user-extras/user/${accountId}`);
      })
      .then((res) => {
        setUserExtraId(res.data.id);
      })
      .catch((err) => {
        console.error("Failed to load userExtra:", err);
      });
  }, []);

  useEffect(() => {
    if (userExtraId !== null) {
      setLoading(true);
      axios
        .get(`/api/winners/my-winnings/${userExtraId}`)
        .then((res) => {
          setWinnings(res.data);
          const total = res.data.reduce(
            (sum: number, item: any) => sum + item.prizeAmount,
            0
          );
          setTotalPrize(total);
        })
        .catch((err) => {
          console.error("Failed to load winnings:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userExtraId]);

  const handleWithdraw = (item: any) => {
    navigate("/withdrawal", {
      state: {
        item,

        userExtraId,
      },
    });
  };

  const formatAmount = (amount: number) =>
    "₹ " + amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  return (
    <article className="winnings d-flex flex-column">
      <div className="winnings-amount-card d-flex flex-column gap-2">
        <div className="winnings-amount-card-header d-flex justify-content-between align-items-center gap-2">
          <p className="text-small text-muted">total winning amount</p>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
            >
              <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0)">
              <path
                d="M13.4672 17.3943H15.3095L15.3193 17.3193L11.3193 13.0483L11.3442 12.975H11.5942C12.5328 12.975 13.3042 12.7128 13.9087 12.1885C14.5131 11.6642 14.8692 11.0097 14.977 10.225H15.9578V9.23275H14.9505C14.9015 8.93142 14.8032 8.65225 14.6557 8.39525C14.5082 8.13808 14.3237 7.90117 14.102 7.6845H15.9578V6.69225H8.04225V7.8385H11.5865C12.1288 7.8385 12.5743 7.96608 12.923 8.22125C13.2718 8.47625 13.4962 8.81342 13.5962 9.23275H8.04225V10.225H13.6212C13.5341 10.6802 13.3119 11.051 12.9548 11.3375C12.5977 11.624 12.1263 11.7673 11.5402 11.7673H9.4635V13.05L13.4672 17.3943ZM12.0017 21.5C10.6877 21.5 9.45267 21.2507 8.2965 20.752C7.14033 20.2533 6.13467 19.5766 5.2795 18.7218C4.42433 17.8669 3.74725 16.8617 3.24825 15.706C2.74942 14.5503 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74933 9.45267 3.248 8.2965C3.74667 7.14033 4.42342 6.13467 5.27825 5.2795C6.13308 4.42433 7.13833 3.74725 8.294 3.24825C9.44967 2.74942 10.6844 2.5 11.9983 2.5C13.3123 2.5 14.5473 2.74933 15.7035 3.248C16.8597 3.74667 17.8653 4.42342 18.7205 5.27825C19.5757 6.13308 20.2528 7.13833 20.7518 8.294C21.2506 9.44967 21.5 10.6844 21.5 11.9983C21.5 13.3123 21.2507 14.5473 20.752 15.7035C20.2533 16.8597 19.5766 17.8653 18.7218 18.7205C17.8669 19.5757 16.8617 20.2528 15.706 20.7518C14.5503 21.2506 13.3156 21.5 12.0017 21.5Z"
                fill="#00B611"
              />
            </g>
          </svg>
        </div>
        <h3>{formatAmount(totalPrize)}</h3>
      </div>

      <h1 className="page-title">Winnings</h1>

      <section className="winnings-card-container d-flex flex-column gap-4">
        {loading ? (
          <div className="text-center mt-5">
            <Spinner color="primary" />
          </div>
        ) : winnings.length === 0 ? (
          <p className="text-muted">No winnings found.</p>
        ) : (
          winnings.map((item, index) => (
            <article
              key={index}
              className="winnings-card d-flex flex-wrap justify-content-between gap-4"
            >
              <section className="ticket-details d-flex justify-content-between flex-wrap gap-4">
                <div className="ticket-details__image">
                  <TicketImage
                    ticketId={item.ticketOid}
                    ticketNumbers={item.ticketKey.split(" ").map(Number)}
                  />
                </div>

                <div className="ticket-details__content d-flex flex-column gap-2">
                  <div className="d-flex flex-column gap-1">
                    <p className="text-small text-muted">Ticket Number</p>
                    <h4>{item.ticketKey}</h4>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <p className="text-small text-muted">Winnings Amount</p>
                    <h4>{formatAmount(item.prizeAmount)}</h4>
                  </div>
                </div>
                <div className="winnings-card-number d-flex flex-column gap-1">
                  <p className="text-small text-muted">Matched Numbers</p>
                  <h4>{item.matchCount}</h4>
                </div>
              </section>

              <section className="card-actions d-flex flex-wrap align-items-center gap-2">
                <Button className="download-btn cta-btn cta-btn--primary">
                  Download details
                </Button>

                <Button
                  className="withdraw-btn cta-btn cta-btn--primary"
                  onClick={() => handleWithdraw(item)}
                >
                  Withdraw
                </Button>
              </section>
            </article>
          ))
        )}
      </section>
    </article>
  );
};

export default Winnings;
