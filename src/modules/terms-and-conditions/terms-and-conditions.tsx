import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import "./terms-and-conditions.scss";

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="terms-and-conditions-page">
      <Container fluid className="h-100">
        <Row className="h-100 justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <div className="terms-content">
              <header className="terms-header">
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
                  <h1 className="page-title mb-0">Terms and Conditions</h1>
                </div>
                <div className="terms-meta">
                  <p className="text-muted mb-4">
                    <strong>Valid from:</strong> September 4, 2025
                  </p>
                </div>
              </header>

              <div className="terms-intro">
                <p className="lead">
                  These Terms and Conditions govern your participation in the
                  ticket-sharing game offered on this platform. By creating an
                  account and purchasing a share, you agree to these Terms and
                  Conditions, Legal Disclaimer, and{" "}
                  <Link
                    to="/data-privacy-policy"
                    className="privacy-policy-link"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="terms-sections">
                <section id="general" className="terms-section">
                  <h2 className="section-title">1. General</h2>
                  <div className="section-content">
                    <p>
                      1.1. This platform ("the Website"/"the App") is operated
                      by Omillionaire.
                    </p>
                    <p>
                      1.2. These Terms & Conditions govern participation in the
                      ticket-sharing game ("the Game") offered on this platform.
                    </p>
                    <p>
                      1.3. By creating an account and purchasing a share, the
                      user ("User") agrees to these Terms & Conditions, Legal
                      Disclaimer, and{" "}
                      <Link
                        to="/data-privacy-policy"
                        className="privacy-policy-link"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                    <p>
                      1.4. The Company reserves the right to amend these Terms
                      at any time. Updated terms will be posted on the Website.
                    </p>
                  </div>
                </section>

                <section id="registration" className="terms-section">
                  <h2 className="section-title">2. Registration</h2>
                  <div className="section-content">
                    <p>2.1. To register, a User must:</p>
                    <ul className="terms-list">
                      <li>
                        Be at least <strong>18 years old</strong>;
                      </li>
                      <li>
                        Not be legally restricted from participating in games of
                        chance in their jurisdiction;
                      </li>
                      <li>
                        Provide correct personal details including name, mobile
                        number, and country of residence.
                      </li>
                    </ul>
                    <p>
                      2.2. The User's mobile phone number will serve as their
                      username.
                    </p>
                    <p>
                      2.3. Users are responsible for ensuring the accuracy of
                      their registration details.
                    </p>
                  </div>
                </section>

                <section id="the-game" className="terms-section">
                  <h2 className="section-title">3. The Game</h2>
                  <div className="section-content">
                    <p>
                      3.1. A full ticket is divided into{" "}
                      <strong>10 equal shares</strong>.
                    </p>
                    <p>
                      3.2. Each share costs <strong>INR 100</strong>.
                    </p>
                    <p>
                      3.3. Purchasing one share entitles the User to{" "}
                      <strong>1/10th of the ticket's participation</strong> in
                      the draw.
                    </p>
                    <p>
                      3.4. If the ticket wins,{" "}
                      <strong>
                        the prize will be split proportionally among the Users
                      </strong>{" "}
                      holding shares of that ticket. Example: if a User holds 2
                      shares, they are entitled to 2/10th (20%) of the winnings.
                    </p>
                    <p>
                      3.5. All results are determined by the official
                      lottery/draw operator. The platform has no influence over
                      the outcome.
                    </p>
                  </div>
                </section>

                <section id="eligibility" className="terms-section">
                  <h2 className="section-title">
                    4. Eligibility and Ineligible Players
                  </h2>
                  <div className="section-content">
                    <p>
                      4.1. Users must be at least 18 years old and legally
                      allowed to participate in games of chance in their
                      jurisdiction.
                    </p>
                    <p>4.2. The following are prohibited from participating:</p>
                    <ul className="terms-list">
                      <li>
                        Employees of the Company and their immediate family
                        members;
                      </li>
                      <li>
                        Persons residing in jurisdictions where such activities
                        are illegal;
                      </li>
                      <li>
                        Individuals who have been previously banned or suspended
                        from the platform.
                      </li>
                    </ul>
                    <p>
                      4.3. The Company reserves the right to verify eligibility
                      at any time and may request documentation to confirm
                      identity and age.
                    </p>
                  </div>
                </section>

                <section id="payment-wallet" className="terms-section">
                  <h2 className="section-title">5. Payment and Wallet</h2>
                  <div className="section-content">
                    <p>
                      5.1. All payments must be made through the platform's
                      integrated payment system.
                    </p>
                    <p>
                      5.2. Users can add funds to their wallet using approved
                      payment methods.
                    </p>
                    <p>
                      5.3. Share purchases are deducted from the User's wallet
                      balance.
                    </p>
                    <p>
                      5.4. The Company is not responsible for payment processing
                      issues caused by third-party payment providers.
                    </p>
                    <p>
                      5.5. All transactions are final. Refunds may only be
                      provided in exceptional circumstances at the Company's
                      discretion.
                    </p>
                  </div>
                </section>

                <section id="winnings" className="terms-section">
                  <h2 className="section-title">6. Winnings</h2>
                  <div className="section-content">
                    <p>
                      6.1. Winnings are automatically credited to the User's
                      wallet upon official confirmation of results.
                    </p>
                    <p>
                      6.2. Users can withdraw winnings to their registered bank
                      account or approved payment method.
                    </p>
                    <p>
                      6.3. Withdrawal requests may take 3-7 business days to
                      process.
                    </p>
                    <p>
                      6.4. The Company reserves the right to withhold winnings
                      pending identity verification or compliance checks.
                    </p>
                    <p>
                      6.5. Users are responsible for any applicable taxes on
                      winnings in their jurisdiction.
                    </p>
                  </div>
                </section>

                <section id="user-obligations" className="terms-section">
                  <h2 className="section-title">7. User Obligations</h2>
                  <div className="section-content">
                    <p>
                      7.1. Users must provide accurate and truthful information
                      during registration and transactions.
                    </p>
                    <p>
                      7.2. Users are responsible for maintaining the
                      confidentiality of their account credentials.
                    </p>
                    <p>
                      7.3. Users must not attempt to manipulate, hack, or
                      interfere with the platform's operation.
                    </p>
                    <p>
                      7.4. Users must comply with all applicable laws and
                      regulations in their jurisdiction.
                    </p>
                    <p>
                      7.5. Users must not create multiple accounts or engage in
                      fraudulent activities.
                    </p>
                  </div>
                </section>

                <section id="liability" className="terms-section">
                  <h2 className="section-title">8. Liability</h2>
                  <div className="section-content">
                    <p>
                      8.1. The Company provides the platform "as is" without
                      warranties of any kind.
                    </p>
                    <p>8.2. The Company is not liable for:</p>
                    <ul className="terms-list">
                      <li>Technical failures, interruptions, or downtime;</li>
                      <li>Losses due to User error or negligence;</li>
                      <li>
                        Actions of third-party payment processors or lottery
                        operators;
                      </li>
                      <li>
                        Any indirect, incidental, or consequential damages.
                      </li>
                    </ul>
                    <p>
                      8.3. The Company's total liability is limited to the
                      amount paid by the User for shares.
                    </p>
                  </div>
                </section>

                <section id="data-protection" className="terms-section">
                  <h2 className="section-title">9. Data Protection</h2>
                  <div className="section-content">
                    <p>
                      9.1. The Company collects and processes personal data in
                      accordance with its{" "}
                      <Link
                        to="/data-privacy-policy"
                        className="privacy-policy-link"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                    <p>
                      9.2. Users consent to the collection, processing, and
                      storage of their personal data for the purposes outlined
                      in the{" "}
                      <Link
                        to="/data-privacy-policy"
                        className="privacy-policy-link"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                    <p>
                      9.3. The Company implements appropriate security measures
                      to protect User data.
                    </p>
                  </div>
                </section>

                <section id="complaints-disputes" className="terms-section">
                  <h2 className="section-title">10. Complaints & Disputes</h2>
                  <div className="section-content">
                    <p>
                      10.1. Users can submit complaints or disputes through the
                      platform's customer support system.
                    </p>
                    <p>
                      10.2. The Company will investigate all complaints in good
                      faith and respond within a reasonable timeframe.
                    </p>
                    <p>
                      10.3. If a dispute cannot be resolved through customer
                      support, it may be escalated to mediation or arbitration.
                    </p>
                    <p>
                      10.4. Users agree to attempt resolution through the
                      Company's complaint process before pursuing legal action.
                    </p>
                  </div>
                </section>

                <section id="termination" className="terms-section">
                  <h2 className="section-title">11. Termination</h2>
                  <div className="section-content">
                    <p>
                      11.1. Users may terminate their account at any time by
                      contacting customer support.
                    </p>
                    <p>
                      11.2. The Company may suspend or terminate accounts for
                      violations of these Terms.
                    </p>
                    <p>
                      11.3. Upon termination, Users may withdraw their wallet
                      balance subject to any pending investigations.
                    </p>
                    <p>
                      11.4. Termination does not affect rights to winnings from
                      shares purchased before termination.
                    </p>
                  </div>
                </section>

                <section id="governing-law" className="terms-section">
                  <h2 className="section-title">12. Governing Law</h2>
                  <div className="section-content">
                    <p>12.1. These Terms are governed by the laws of India.</p>
                    <p>
                      12.2. Any disputes arising from these Terms will be
                      subject to the exclusive jurisdiction of Indian courts.
                    </p>
                    <p>
                      12.3. If any provision of these Terms is found to be
                      invalid, the remaining provisions will continue in full
                      force.
                    </p>
                  </div>
                </section>

                <section id="rules-of-the-game" className="terms-section">
                  <h2 className="section-title">13. Rules of the Game</h2>
                  <div className="section-content">
                    <h3 className="subsection-title">Ticket Split</h3>
                    <ul className="terms-list">
                      <li>
                        Each official lottery ticket is divided into{" "}
                        <strong>10 equal shares</strong>.
                      </li>
                      <li>
                        Each share costs <strong>INR 100</strong>.
                      </li>
                    </ul>

                    <h3 className="subsection-title">Participation</h3>
                    <ul className="terms-list">
                      <li>
                        A User can purchase one or more shares of a ticket.
                      </li>
                      <li>
                        The number of shares held determines the User's
                        percentage entitlement to winnings.
                      </li>
                    </ul>

                    <h3 className="subsection-title">
                      Winning and Prize Distribution
                    </h3>
                    <ul className="terms-list">
                      <li>
                        If the ticket wins, the prize money will be split
                        equally across the 10 shares.
                      </li>
                      <li>
                        Example: If a ticket wins ₹1,00,000, each share is worth
                        ₹10,000.
                      </li>
                    </ul>

                    <h3 className="subsection-title">Official Results</h3>
                    <ul className="terms-list">
                      <li>
                        The outcome of the Game is based entirely on the{" "}
                        <strong>official lottery/draw results</strong>.
                      </li>
                      <li>
                        The platform has no role in influencing or altering
                        outcomes.
                      </li>
                    </ul>

                    <h3 className="subsection-title">Winnings Credit</h3>
                    <ul className="terms-list">
                      <li>
                        Wins are credited directly to the User's wallet on the
                        platform.
                      </li>
                      <li>
                        Withdrawals must comply with the withdrawal policy
                        outlined in the Terms & Conditions.
                      </li>
                    </ul>

                    <h3 className="subsection-title">Eligibility</h3>
                    <ul className="terms-list">
                      <li>
                        Users must be at least <strong>18 years old</strong>.
                      </li>
                      <li>
                        Participation may be restricted by local laws; it is the
                        User's responsibility to ensure compliance.
                      </li>
                    </ul>

                    <h3 className="subsection-title">Fair Play</h3>
                    <ul className="terms-list">
                      <li>
                        Collusion, multiple accounts, or attempts to manipulate
                        results will lead to disqualification and possible
                        account suspension.
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="legal-disclaimer" className="terms-section">
                  <h2 className="section-title">14. Legal Disclaimer</h2>
                  <div className="section-content">
                    <p>
                      By using the platform, Users acknowledge that
                      participation is at their own risk. The Company makes no
                      guarantees regarding winnings and shall not be liable for
                      indirect or consequential losses.
                    </p>
                    <p>
                      Users participate in the ticket-sharing game with full
                      understanding of the risks involved, including the
                      possibility of losing their investment. The platform
                      serves as a facilitator only and does not guarantee any
                      specific outcomes or returns.
                    </p>
                  </div>
                </section>

                <section id="contact-information" className="terms-section">
                  <h2 className="section-title">15. Contact Information</h2>
                  <div className="section-content">
                    <p>
                      For questions about these Terms and Conditions, please
                      contact us:
                    </p>
                    <p>
                      <strong>Omillionaire</strong>
                    </p>
                    <p>Email: support@olotto.co</p>
                    <p>Phone: +91-8129170165</p>
                    <p>
                      We will respond to your inquiries within a reasonable
                      timeframe.
                    </p>
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

export default TermsAndConditions;
