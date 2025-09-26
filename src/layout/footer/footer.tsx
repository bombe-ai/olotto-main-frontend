import { Col, Row } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import "./footer.scss";

const Footer = () => {
  const { pathname } = useLocation();

  const isUserProfilePage = pathname.includes("/profile");
  return (
    <footer
      className={`app-footer mt-auto ${
        isUserProfilePage ? "d-none" : "d-block"
      }`}
    >
      <div className="container-fluid w-100 d-flex flex-column">
        <Row>
          <Col>
            <div className="branding">
              <picture className="branding__logo">
                <img src="/images/O!-logo.svg" alt="Omillionaire" />
              </picture>
            </div>
          </Col>
        </Row>
        <Row className="middle-row">
          <Col md="4">
            <p className="slogan">
              Buy slots for just ₹100 and stand a chance to win crores every
              week!
            </p>
          </Col>
          <Col md="8">
            <div className="link-group d-flex flex-wrap w-100">
              <ul className="link-group-list list-unstyled d-flex flex-column gap-2">
                <li className="link-group-list__title">Quick Links</li>
                <li className="link-group-list__item">
                  <Link to="/">Home</Link>
                </li>
                <li className="link-group-list__item">
                  <Link to="/profile/my-tickets">My Tickets</Link>
                </li>
                <li className="link-group-list__item">
                  <Link to="/profile/winnings">Winnings</Link>
                </li>
                <li className="link-group-list__item">
                  <Link to="/profile/transactions">Transactions</Link>
                </li>
                <li className="link-group-list__item">
                  <Link to="/profile/help">Help & Support</Link>
                </li>
              </ul>
              <ul className="link-group-list list-unstyled d-flex flex-column gap-2">
                <li className="link-group-list__title">Support</li>
                <li className="link-group-list__item--support">
                  <a
                    href="mailto:support@olotto.co"
                    className="d-flex align-items-center gap-2"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="24"
                        height="24"
                        rx="12"
                        fill="url(#paint0_linear_40001752_17274)"
                      />
                      <mask
                        id="mask0_40001752_17274"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="5"
                        y="5"
                        width="14"
                        height="14"
                      >
                        <rect
                          x="5"
                          y="5"
                          width="14"
                          height="14"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_40001752_17274)">
                        <path
                          d="M7.33464 16.6666C7.0138 16.6666 6.73915 16.5523 6.51068 16.3239C6.2822 16.0954 6.16797 15.8208 6.16797 15.4999V8.49992C6.16797 8.17909 6.2822 7.90443 6.51068 7.67596C6.73915 7.44749 7.0138 7.33325 7.33464 7.33325H16.668C16.9888 7.33325 17.2635 7.44749 17.4919 7.67596C17.7204 7.90443 17.8346 8.17909 17.8346 8.49992V15.4999C17.8346 15.8208 17.7204 16.0954 17.4919 16.3239C17.2635 16.5523 16.9888 16.6666 16.668 16.6666H7.33464ZM12.0013 12.4812C12.0499 12.4812 12.101 12.4739 12.1544 12.4593C12.2079 12.4447 12.2589 12.4228 12.3076 12.3937L16.4346 9.81242C16.5124 9.76381 16.5707 9.70304 16.6096 9.63013C16.6485 9.55721 16.668 9.477 16.668 9.3895C16.668 9.19506 16.5853 9.04922 16.4201 8.952C16.2548 8.85478 16.0846 8.85964 15.9096 8.96659L12.0013 11.4166L8.09297 8.96659C7.91797 8.85964 7.74783 8.85721 7.58255 8.95929C7.41727 9.06138 7.33464 9.20478 7.33464 9.3895C7.33464 9.48672 7.35408 9.57179 7.39297 9.64471C7.43186 9.71763 7.49019 9.77353 7.56797 9.81242L11.6951 12.3937C11.7437 12.4228 11.7947 12.4447 11.8482 12.4593C11.9016 12.4739 11.9527 12.4812 12.0013 12.4812Z"
                          fill="#FAFAFA"
                        />
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_40001752_17274"
                          x1="0"
                          y1="12"
                          x2="43.5497"
                          y2="12"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#00B611" />
                          <stop offset="1" stop-color="#007A33" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <span>support@olotto.co</span>
                  </a>
                </li>
                <li className="link-group-list__item--support">
                  <a
                    href="tel:+918129170165"
                    className="d-flex align-items-center gap-2"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="24"
                        height="24"
                        rx="12"
                        fill="url(#paint0_linear_40001752_17277)"
                      />
                      <mask
                        id="mask0_40001752_17277"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="5"
                        y="5"
                        width="14"
                        height="14"
                      >
                        <rect
                          x="5"
                          y="5"
                          width="14"
                          height="14"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_40001752_17277)">
                        <path
                          d="M16.6375 17.25C15.4222 17.25 14.2215 16.9851 13.0354 16.4552C11.8493 15.9253 10.7701 15.1743 9.79792 14.2021C8.82569 13.2299 8.07465 12.1507 7.54479 10.9646C7.01493 9.77847 6.75 8.57778 6.75 7.3625C6.75 7.1875 6.80833 7.04167 6.925 6.925C7.04167 6.80833 7.1875 6.75 7.3625 6.75H9.725C9.86111 6.75 9.98264 6.79618 10.0896 6.88854C10.1965 6.9809 10.2597 7.09028 10.2792 7.21667L10.6583 9.25833C10.6778 9.41389 10.6729 9.54514 10.6437 9.65208C10.6146 9.75903 10.5611 9.85139 10.4833 9.92917L9.06875 11.3583C9.26319 11.7181 9.4941 12.0656 9.76146 12.401C10.0288 12.7365 10.3229 13.0597 10.6437 13.3708C10.9451 13.6722 11.2611 13.9517 11.5917 14.2094C11.9222 14.467 12.2722 14.7028 12.6417 14.9167L14.0125 13.5458C14.1 13.4583 14.2142 13.3927 14.3552 13.349C14.4962 13.3052 14.6347 13.2931 14.7708 13.3125L16.7833 13.7208C16.9194 13.7597 17.0312 13.8302 17.1187 13.9323C17.2062 14.0344 17.25 14.1486 17.25 14.275V16.6375C17.25 16.8125 17.1917 16.9583 17.075 17.075C16.9583 17.1917 16.8125 17.25 16.6375 17.25Z"
                          fill="#FAFAFA"
                        />
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_40001752_17277"
                          x1="0"
                          y1="12"
                          x2="43.5497"
                          y2="12"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#00B611" />
                          <stop offset="1" stop-color="#007A33" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <span>+91 8129170165</span>
                  </a>
                </li>
              </ul>
              <ul className="link-group-list list-unstyled d-flex flex-column gap-2">
                <li className="link-group-list__title">Legal</li>
                <li className="link-group-list__item">
                  <Link to="/terms-and-conditions">Terms & Conditions</Link>
                </li>
                <li className="link-group-list__item">
                  <Link to="/data-privacy-policy">
                    Data Privacy & Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        <Row className="bottom-row">
          <Col md="9">
            <p className="disclaimer">
              <strong>Disclaimer</strong> : Olotto is a digital lottery platform
              operating under the provisions of the Lotteries (Regulation) Act,
              1998 and is intended for use only in Indian states where online
              lotteries are permitted. Participation is strictly prohibited for
              individuals under 18 years of age and for residents of states
              where online lotteries are banned. Please remember that lottery
              play involves financial risk; play only with amounts you can
              afford to lose. Olotto promotes responsible gaming and provides
              resources for players who may need help. If you believe you may
              have a gambling problem, please seek assistance from recognized
              support organizations such as the National Institute of Mental
              Health and Neurosciences (NIMHANS) Helpline – 080-46110007.
            </p>
          </Col>
          <Col md="2">
            <div className="d-flex flex-column justify-content-end align-items-stretch">
              <div className="badge-group d-flex align-items-center justify-content-evenly gap-3 flex-wrap">
                <picture className="upi-badge">
                  <img src="/images/upi-badge.svg" alt="UPI" />
                </picture>
                <picture className="age-restriction-badge">
                  <img src="/images/age-restriction-18plus.svg" alt="18+" />
                </picture>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
