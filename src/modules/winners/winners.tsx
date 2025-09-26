import React from "react";
import { Col, Container, Row } from "reactstrap";
import "./winners.scss";

const Winners: React.FC = () => {
  const winners = [
    {
      id: 1,
      prizeRank: ["1", "st"],
      name: "Rahul K",
      location: "Kerala",
      comment:
        "ജീവിതത്തിൽ ഇങ്ങനെ ഒരു ദിവസം വരുമെന്ന് വിചാരിച്ചില്ല. O! Millionaire കൊണ്ടാണ് എൻ്റെ മക്കൾക്കു നല്ലൊരു ഭാവി കൊടുക്കാനും പറ്റിയത്… അടുത്ത ആഴ്ച ഞങ്ങൾ ദുബായ് ട്രിപ്പ് പ്ലാൻ ചെയ്തിട്ടുണ്ട്!.",
      image: "/images/winner-placeholder-2.png",
    },
    {
      id: 2,
      prizeRank: ["2", "nd"],
      name: "Varun Kumar",
      location: "Tamil Nadu",
      comment:
        "എനിക്ക് എന്നും ചെറിയെ സ്വപ്നനഗലെ ഉണ്ടായിരുന്നുള്ളു. സ്വന്തം വീട്, കുട്ടികൾക്ക് നല്ല വിദ്യാഭ്യാസം. വെറും ₹100 ടിക്കറ്റ് കൊണ്ടാണ് ഇന്നത് സാധിച്ചത്. ഞാൻ ഇന്ന് O! മില്ലിയനായരെ ഫാനാണ്.",
      image: "/images/winner-placeholder-3.png",
    },
    {
      id: 3,
      prizeRank: ["3", "rd"],
      name: "Sony",
      location: "Kerala",
      comment:
        "രജിസ്റ്റർ പ്രോസസ്സ് എന്ത് എളുപ്പമായിരുന്നു. മൂന്നാം സമ്മാനം അടിച്ചപ്പോൾ ഒന്ന് കൂടെ സ്പിരിറ്റ് കേറി. ഇനി ജാക്ക്പോട് അടിക്കാൻ വരെ ടിക്കറ്റ് വാങ്ങും.",
      image: "/images/winner-placeholder-1.png",
    },
    {
      id: 4,
      prizeRank: ["4", "th"],
      name: "Varun Kumar",
      location: "Tamil Nadu",
      comment:
        "ഫ്രണ്ട്സിനോട് പറഞ്ഞപ്പോൾ അവർ ചിരിച്ചു: ‘ഇത് നടക്കുമോ?’ രണ്ടാമത്തെ സമ്മാനം അടിച്ചപ്പോൾ എല്ലാവരും ഷോക്ക് ആയി! ഇനി ഞാൻ എല്ലാവര്ക്കും 5-സ്റ്റാറിൽ ചായ വാങ്ങും.",
      image: "/images/winner-placeholder-3.png",
    },
  ];

  return (
    <main className="winners-page min-vh-100 w-100">
      <Container fluid className="h-100 w-100 d-flex flex-column">
        <section className="winners-page-header d-flex flex-column gap-2">
          <h1>
            Meet Our <span>Winners</span>
          </h1>
          <p>
            Celebrating our lucky winners who turned their dreams into reality
          </p>
        </section>
        <section className="winners-page-content">
          <div className="winners-card-container auto-grid">
            {winners.map((winner) => (
              <div
                key={winner.id}
                className="winners-card-item d-flex flex-column gap-3 position-relative"
              >
                {winner.id === 1 && (
                  <picture className="confetti position-absolute z-index-1">
                    <img src="/images/confetti.png" alt="Confetti" />
                  </picture>
                )}
                <Row className="position-relative z-index-2">
                  <Col xs="5">
                    <picture>
                      <img src={winner.image} alt={winner.name} />
                    </picture>
                  </Col>
                  <Col xs="7" className="d-flex flex-column gap-2 h-100">
                    <div className="winner-details d-flex gap-2">
                      <h2 className="prize-rank">
                        {winner.prizeRank[0]}
                        <span>{winner.prizeRank[1]}</span>
                      </h2>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="winner-details__name">{winner.name}</h3>
                        <p className="winner-details__location">
                          {winner.location}
                        </p>
                      </div>
                    </div>
                    <div className="winner-comment position-relative d-none d-md-block">
                      <span className="quote-icon position-absolute">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          viewBox="0 0 45 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18.4426 30H1.32787C0.442623 30 0 29.5545 0 28.6634V1.33663C0 0.445545 0.442623 0 1.32787 0H5.7541C6.34426 0 6.78689 0.445545 7.08197 1.33663L10.0328 10.099H18.4426C19.3279 10.099 19.7705 10.5941 19.7705 11.5842V28.6634C19.7705 29.5545 19.3279 30 18.4426 30ZM45 28.6634C45 29.5545 44.5574 30 43.6721 30H26.7049C25.7213 30 25.2295 29.5545 25.2295 28.6634V1.33663C25.2295 0.445545 25.7213 0 26.7049 0H31.1311C31.7213 0 32.1639 0.445545 32.459 1.33663L35.2623 10.099H43.6721C44.5574 10.099 45 10.5941 45 11.5842V28.6634Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <p>{winner.comment}</p>
                    </div>
                  </Col>
                </Row>
                <Row className="w-100 d-md-none">
                  <div className="winner-comment position-relative">
                    <span className="quote-icon position-absolute">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 45 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.4426 30H1.32787C0.442623 30 0 29.5545 0 28.6634V1.33663C0 0.445545 0.442623 0 1.32787 0H5.7541C6.34426 0 6.78689 0.445545 7.08197 1.33663L10.0328 10.099H18.4426C19.3279 10.099 19.7705 10.5941 19.7705 11.5842V28.6634C19.7705 29.5545 19.3279 30 18.4426 30ZM45 28.6634C45 29.5545 44.5574 30 43.6721 30H26.7049C25.7213 30 25.2295 29.5545 25.2295 28.6634V1.33663C25.2295 0.445545 25.7213 0 26.7049 0H31.1311C31.7213 0 32.1639 0.445545 32.459 1.33663L35.2623 10.099H43.6721C44.5574 10.099 45 10.5941 45 11.5842V28.6634Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <p>{winner.comment}</p>
                  </div>
                </Row>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
};

export default Winners;
