import React, { useEffect, useState, useCallback } from "react";
import { Container, Button, Spinner } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "./past-winnings.scss";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Draw {
  id: string;
  drawDate: string;
  winningTicketKey: string;
  verificationStatus: string;
}

const PastWinnings: React.FC = () => {
  const [pastWinnings, setPastWinnings] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const PAGE_SIZE = 20;

  const fetchPastWinnings = useCallback(
    async (page: number = 0, append: boolean = false) => {
      try {
        if (page === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const requestUrl = `/api/draws?page=${page}&size=${PAGE_SIZE}&sort=drawDate,desc&cacheBuster=${new Date().getTime()}`;
        const response = await axios.get(requestUrl);
        const { data, headers } = response;

        const verifiedDraws = (data || []).filter(
          (d: Draw) => d.verificationStatus === "VERIFIED"
        );

        if (append) {
          setPastWinnings((prev) => [...prev, ...verifiedDraws]);
        } else {
          setPastWinnings(verifiedDraws);
        }

        // Get total count from headers (JHipster standard)
        const totalCount = headers["x-total-count"]
          ? parseInt(headers["x-total-count"], 10)
          : verifiedDraws.length;
        setTotalElements(totalCount);

        // Check if there are more pages
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);
        setHasMore(page + 1 < totalPages);

        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching past winnings:", error);
        toast.error("❌ Failed to load previous winning numbers.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [PAGE_SIZE]
  );

  const loadMoreWinnings = () => {
    if (!loadingMore && hasMore) {
      fetchPastWinnings(currentPage + 1, true);
    }
  };

  useEffect(() => {
    fetchPastWinnings(0);
  }, [fetchPastWinnings]);

  return (
    <main className="past-winnings-page min-vh-100 w-100">
      <Container fluid className="h-100 w-100 d-flex flex-column">
        <section className="past-winnings-page-header d-flex flex-column gap-2">
          <h1>
            Past <span>Winning Numbers</span>
          </h1>
          <p>Complete history of all draws and winnings</p>
        </section>
        <section className="past-winnings-page-content">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Spinner
                color="success"
                style={{ width: "3rem", height: "3rem" }}
              />
              <span className="ms-3">Loading winning numbers...</span>
            </div>
          ) : (
            <>
              <div className="past-winnings-card-container auto-grid">
                {pastWinnings.length === 0 ? (
                  <p className="text-center">No past winnings available</p>
                ) : (
                  pastWinnings.map((draw: Draw) => (
                    <div
                      className="past-winnings-card d-flex flex-column gap-3"
                      key={draw.id}
                    >
                      <div className="past-winnings-card-header d-flex align-items-center gap-2">
                        <div className="calendar-icon">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="40"
                              height="40"
                              rx="20"
                              fill="#00B611"
                              fillOpacity="0.1"
                            />
                            <mask
                              id="mask0_40001899_26588"
                              style={{ maskType: "alpha" }}
                              maskUnits="userSpaceOnUse"
                              x="10"
                              y="10"
                              width="20"
                              height="20"
                            >
                              <rect
                                x="10"
                                y="10"
                                width="20"
                                height="20"
                                fill="#D9D9D9"
                              />
                            </mask>
                            <g mask="url(#mask0_40001899_26588)">
                              <path
                                d="M14.4361 27.9167C14.0152 27.9167 13.6589 27.7708 13.3672 27.4792C13.0755 27.1875 12.9297 26.8312 12.9297 26.4102V15.2565C12.9297 14.8355 13.0755 14.4792 13.3672 14.1875C13.6589 13.8958 14.0152 13.75 14.4361 13.75H15.5899V12.6281C15.5899 12.4455 15.6511 12.293 15.7734 12.1706C15.8958 12.0484 16.0483 11.9873 16.2309 11.9873C16.4137 11.9873 16.5662 12.0484 16.6884 12.1706C16.8108 12.293 16.872 12.4455 16.872 12.6281V13.75H23.1861V12.6123C23.1861 12.4349 23.2459 12.2864 23.3655 12.1667C23.4852 12.0471 23.6338 11.9873 23.8111 11.9873C23.9885 11.9873 24.137 12.0471 24.2566 12.1667C24.3763 12.2864 24.4361 12.4349 24.4361 12.6123V13.75H25.5899C26.0109 13.75 26.3672 13.8958 26.6588 14.1875C26.9505 14.4792 27.0963 14.8355 27.0963 15.2565V26.4102C27.0963 26.8312 26.9505 27.1875 26.6588 27.4792C26.3672 27.7708 26.0109 27.9167 25.5899 27.9167H14.4361ZM14.4361 26.6667H25.5899C25.6541 26.6667 25.7128 26.6399 25.7661 26.5865C25.8196 26.5331 25.8463 26.4744 25.8463 26.4102V18.5898H14.1797V26.4102C14.1797 26.4744 14.2064 26.5331 14.2599 26.5865C14.3132 26.6399 14.372 26.6667 14.4361 26.6667Z"
                                fill="currentColor"
                              />
                            </g>
                          </svg>
                        </div>
                        <h2>
                          {dayjs
                            .utc(draw.drawDate)
                            .tz("Asia/Kolkata")
                            .format("MMM D, YYYY")}
                        </h2>
                      </div>
                      <div className="past-winnings-card-body d-flex justify-content-center align-items-center gap-1">
                        {draw.winningTicketKey &&
                          draw.winningTicketKey
                            .split(" ")
                            .map((num: string, index: number) => (
                              <div
                                className="winning-number d-flex justify-content-center align-items-center"
                                key={`${draw.id}-${num}-${index}`}
                              >
                                {Number(num) || 0}
                              </div>
                            ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Load More Button */}
              {pastWinnings.length > 0 && hasMore && (
                <div className="d-flex justify-content-center mt-4">
                  <Button
                    color="success"
                    outline
                    onClick={loadMoreWinnings}
                    disabled={loadingMore}
                    className="load-more-btn"
                  >
                    {loadingMore ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Loading more...
                      </>
                    ) : (
                      `Load More (${Math.max(
                        0,
                        totalElements - pastWinnings.length
                      )} remaining)`
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </Container>
    </main>
  );
};

export default PastWinnings;
