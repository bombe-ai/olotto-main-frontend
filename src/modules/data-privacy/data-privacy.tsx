import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import "./data-privacy.scss";

const DataPrivacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="data-privacy-page">
      <Container fluid className="h-100">
        <Row className="h-100 justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <div className="data-privacy-content">
              <header className="data-privacy-header">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <button
                    className="back-btn btn p-0 d-flex align-items-center justify-content-center"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z" />
                    </svg>
                  </button>
                  <h1 className="page-title mb-0">
                    Data Privacy and Cookie Policy
                  </h1>
                </div>
                <div className="policy-meta">
                  <p className="text-muted mb-2">
                    <strong>Effective Date:</strong> September 1, 2025
                  </p>
                  <p className="text-muted mb-4">
                    <strong>Last Updated:</strong> September 1, 2025
                  </p>
                </div>
              </header>

              <div className="policy-intro">
                <p className="lead">
                  This Data Privacy and Cookie Policy ("Policy") explains how{" "}
                  <strong>GreenBloom Global Limitada</strong> ("we", "us", or
                  "our") collects, processes, uses, discloses, and protects your
                  personal data when you access or use our website, mobile
                  application, or participate in our ticket-sharing game ("the
                  Game").
                </p>
              </div>

              <div className="policy-sections">
                <section id="definitions" className="policy-section">
                  <h2 className="section-title">1. Definitions</h2>
                  <div className="section-content">
                    <ul className="policy-list">
                      <li>
                        <strong>Personal Data</strong>: Any information that
                        identifies or can identify a natural person.
                      </li>
                      <li>
                        <strong>Cookies</strong>: Small text files placed on
                        your device to enable functionality, analytics, and
                        personalization.
                      </li>
                      <li>
                        <strong>Data Controller</strong>: GreenBloom Global
                        Limitada, responsible for determining how and why your
                        personal data is processed.
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="terms-of-use" className="policy-section">
                  <h2 className="section-title">2. Terms of Use</h2>
                  <div className="section-content">
                    <p>
                      2.1 By using the Platform, you consent to this Policy.
                    </p>
                    <p>
                      2.2 This Policy applies to website visitors, registered
                      users, and third-party integrations.
                    </p>
                    <p>
                      2.3 You must provide accurate and truthful information
                      when registering or transacting.
                    </p>
                  </div>
                </section>

                <section id="updates" className="policy-section">
                  <h2 className="section-title">3. Updates</h2>
                  <div className="section-content">
                    <p>
                      We may update this Policy at any time without prior
                      notice. Please review it periodically for changes.
                    </p>
                  </div>
                </section>

                <section id="third-party-websites" className="policy-section">
                  <h2 className="section-title">4. Third-Party Websites</h2>
                  <div className="section-content">
                    <p>
                      Our Platform may contain links to third-party websites. We
                      are not responsible for their content, practices, or
                      privacy standards.
                    </p>
                  </div>
                </section>

                <section id="what-data-we-collect" className="policy-section">
                  <h2 className="section-title">
                    5. What Data We Collect & Why
                  </h2>
                  <div className="section-content">
                    <ul className="policy-list">
                      <li>
                        <strong>Account Data</strong>: name, age, gender,
                        nationality, phone number (required), email (optional).
                      </li>
                      <li>
                        <strong>Payment Data</strong>: payment details for
                        buying shares and withdrawing winnings.
                      </li>
                      <li>
                        <strong>Game Data</strong>: shares purchased, winnings,
                        wallet transactions.
                      </li>
                      <li>
                        <strong>Technical Data</strong>: device type, browser,
                        IP address, geolocation (if enabled).
                      </li>
                      <li>
                        <strong>Support Data</strong>: messages, complaints, or
                        inquiries submitted to customer support.
                      </li>
                    </ul>
                    <p>We collect this data to:</p>
                    <ul className="policy-list">
                      <li>Create and manage accounts.</li>
                      <li>Process purchases and winnings.</li>
                      <li>
                        Verify user eligibility (18+ age and legal compliance).
                      </li>
                      <li>Prevent fraud and misuse.</li>
                      <li>Improve user experience and services.</li>
                      <li>Send communications, where consented.</li>
                    </ul>
                  </div>
                </section>

                <section id="legal-bases" className="policy-section">
                  <h2 className="section-title">
                    6. Legal Bases for Processing
                  </h2>
                  <div className="section-content">
                    <p>We process data under:</p>
                    <ul className="policy-list">
                      <li>
                        <strong>Contractual necessity</strong> (to provide the
                        Game).
                      </li>
                      <li>
                        <strong>Legitimate interests</strong> (fraud prevention,
                        analytics).
                      </li>
                      <li>
                        <strong>Legal obligations</strong> (anti-money
                        laundering, taxation).
                      </li>
                      <li>
                        <strong>Consent</strong> (marketing, cookies, optional
                        data).
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="sharing-of-data" className="policy-section">
                  <h2 className="section-title">7. Sharing of Data</h2>
                  <div className="section-content">
                    <p>We may share data with:</p>
                    <ul className="policy-list">
                      <li>Payment processors and banks.</li>
                      <li>IT service providers (hosting, security).</li>
                      <li>
                        Regulators or law enforcement (when legally required).
                      </li>
                      <li>
                        Marketing/analytics providers (only with consent).
                      </li>
                    </ul>
                    <p>
                      We do <strong>not</strong> sell personal data to third
                      parties.
                    </p>
                  </div>
                </section>

                <section id="cross-border-transfers" className="policy-section">
                  <h2 className="section-title">8. Cross-Border Transfers</h2>
                  <div className="section-content">
                    <p>
                      Data may be stored or processed outside your country.
                      Safeguards (such as contractual protections) will be
                      applied.
                    </p>
                  </div>
                </section>

                <section id="retention-of-data" className="policy-section">
                  <h2 className="section-title">9. Retention of Data</h2>
                  <div className="section-content">
                    <p>
                      We retain data only as long as needed for legal,
                      contractual, and operational purposes. Longer retention
                      may apply if required by law.
                    </p>
                  </div>
                </section>

                <section id="cookies" className="policy-section">
                  <h2 className="section-title">10. Cookies</h2>
                  <div className="section-content">
                    <p>10.1 We use cookies to:</p>
                    <ul className="policy-list">
                      <li>Ensure secure login.</li>
                      <li>Track game and wallet activity.</li>
                      <li>Analyze site performance.</li>
                      <li>Personalize content and ads (with consent).</li>
                    </ul>
                    <p>
                      10.2 Third-party cookies may be used for analytics and
                      advertising.
                    </p>
                    <p>
                      10.3 You can manage cookies via your browser settings, but
                      some features may not work properly if disabled.
                    </p>
                  </div>
                </section>

                <section id="your-rights" className="policy-section">
                  <h2 className="section-title">11. Your Rights</h2>
                  <div className="section-content">
                    <p>
                      Depending on your jurisdiction, you may have rights to:
                    </p>
                    <ul className="policy-list">
                      <li>Access your data.</li>
                      <li>Request correction or deletion.</li>
                      <li>Restrict or object to processing.</li>
                      <li>Data portability.</li>
                      <li>Withdraw marketing consent at any time.</li>
                    </ul>
                    <p>
                      Requests can be submitted to{" "}
                      <strong>support@olotto.co</strong>.
                    </p>
                  </div>
                </section>

                <section id="security" className="policy-section">
                  <h2 className="section-title">12. Security</h2>
                  <div className="section-content">
                    <p>
                      We use encryption, access controls, and monitoring to
                      protect data. However, no system is fully secure, and we
                      cannot guarantee absolute safety.
                    </p>
                  </div>
                </section>

                <section id="childrens-privacy" className="policy-section">
                  <h2 className="section-title">13. Children's Privacy</h2>
                  <div className="section-content">
                    <p>
                      The Game is restricted to persons{" "}
                      <strong>18 years and older</strong>. We do not knowingly
                      collect data from minors.
                    </p>
                  </div>
                </section>

                <section
                  id="effective-date-jurisdiction"
                  className="policy-section"
                >
                  <h2 className="section-title">
                    14. Effective Date & Jurisdiction
                  </h2>
                  <div className="section-content">
                    <p>
                      <strong>Effective Date:</strong> September 1, 2025
                    </p>
                    <p>
                      This Policy is governed by applicable international data
                      protection standards, including but not limited to
                      principles reflected in the EU General Data Protection
                      Regulation (GDPR), where relevant, as well as local laws
                      in the countries where we operate. By using our Platform,
                      you agree that your personal data may be processed in
                      accordance with these standards.
                    </p>
                  </div>
                </section>

                <section id="contact-us" className="policy-section">
                  <h2 className="section-title">15. Contact Us</h2>
                  <div className="section-content">
                    <p>
                      If you have questions, complaints, or wish to exercise
                      your rights, contact us:
                    </p>
                    <p>
                      <strong>GreenBloom Global Limitada</strong>
                    </p>
                    <p>Email: support@olotto.co</p>
                    <p>Phone: +91 8129170165</p>
                  </div>
                </section>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default DataPrivacy;
