import { useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Spinner,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faChevronLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { useAppSelector } from "@/app/config/store";

import "./user-profile.scss";

const UserProfile = () => {
  const navigate = useNavigate();
  const account = useAppSelector((state) => state.authentication.account);
  const [loading, setLoading] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [userExtra, setUserExtra] = useState<any | null>(null);

  const toggle = () => setSignOutModalOpen(!signOutModalOpen);

  useEffect(() => {
    if (account?.id) {
      setLoading(true);
      axios
        .get(`/api/user-extras/user/${account.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        })
        .then((response) => setUserExtra(response.data))
        .catch((error) => console.error("Failed to load userExtra", error))
        .finally(() => setLoading(false));
    }
  }, [account?.id]);

  const userName = userExtra?.user?.login || account?.login || "User Name";

  if (loading) {
    return (
      <Spinner color="success" className="mx-auto">
        Loading...
      </Spinner>
    );
  }

  return (
    <article className="user-profile-page position-relative">
      <picture className="page-bg position-absolute d-none d-lg-block">
        <img src="/images/user-profile-bg.svg" alt="User Name" />
      </picture>
      <Container fluid className="page-wrapper position-relative h-100">
        <Row className="user-profile h-100">
          <Col lg="3" className="h-100 d-none d-lg-block">
            <aside className="user-profile-sidebar d-flex flex-column gap-3 h-100">
              <Button
                className="cta-btn cta-btn--text d-flex align-items-center gap-2"
                onClick={() => navigate("/")}
              >
                <FontAwesomeIcon icon={faChevronLeft} /> Home
              </Button>

              <section className="user-info d-flex flex-column justify-content-center align-items-center gap-3">
                <picture className="user-info__image position-relative">
                  <img
                    src="/images/user-profile-placeholder.svg"
                    alt="User Name"
                  />
                  <Button className="edit-btn cta-btn cta-btn--text d-flex justify-content-center align-items-center position-absolute z-index-1">
                    <svg
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="36"
                        height="36"
                        rx="18"
                        fill="currentColor"
                      />
                      <path
                        d="M9.01953 27.0003V23.7938L23.4091 9.41168C23.5454 9.27508 23.6947 9.17558 23.8567 9.11316C24.0187 9.05074 24.1803 9.01953 24.3415 9.01953C24.5189 9.01953 24.6858 9.05074 24.842 9.11316C24.9983 9.17558 25.1471 9.27754 25.2884 9.41905L26.6081 10.7459C26.7494 10.8825 26.8501 11.0289 26.9102 11.1852C26.9702 11.3412 27.0003 11.508 27.0003 11.6857C27.0003 11.8419 26.9702 12.0011 26.9102 12.1631C26.8501 12.3249 26.7494 12.4766 26.6081 12.6181L12.226 27.0003H9.01953ZM23.8727 13.5233L25.7177 11.6783L24.3415 10.3021L22.4965 12.1471L23.8727 13.5233Z"
                        fill="#FAFAFA"
                      />
                    </svg>
                  </Button>
                </picture>
                <h1>{userName}</h1>
              </section>

              <section className="user-profile-nav d-flex flex-column gap-2">
                <NavLink
                  to="my-profile"
                  className="cta-btn profile-nav-btn d-flex align-items-center gap-2"
                >
                  <FontAwesomeIcon icon={faUser} /> My Profile
                </NavLink>
                <NavLink
                  to="my-tickets"
                  className="cta-btn profile-nav-btn d-flex align-items-center gap-2"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_40000362_14836"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    >
                      <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_40000362_14836)">
                      <path
                        d="M9.93075 15L12 13.4L14.0193 14.9615L13.2385 12.4463L15.3845 10.7845H12.8307L12 8.23075L11.1692 10.7845H8.6155L10.7115 12.4463L9.93075 15ZM4.6155 19C4.168 19 3.78683 18.8427 3.472 18.528C3.15733 18.2132 3 17.832 3 17.3845V15.2788C3 15.1339 3.03592 15.0013 3.10775 14.8808C3.17958 14.7603 3.2815 14.6705 3.4135 14.6115C3.89033 14.3372 4.274 13.9738 4.5645 13.5213C4.85483 13.0686 5 12.5615 5 12C5 11.4385 4.85483 10.9314 4.5645 10.4788C4.274 10.0263 3.89033 9.66283 3.4135 9.3885C3.2815 9.3295 3.17958 9.23975 3.10775 9.11925C3.03592 8.99875 3 8.86608 3 8.72125V6.6155C3 6.168 3.15733 5.78683 3.472 5.472C3.78683 5.15733 4.168 5 4.6155 5H19.3845C19.832 5 20.2132 5.15733 20.528 5.472C20.8427 5.78683 21 6.168 21 6.6155V8.72125C21 8.86608 20.9641 8.99875 20.8923 9.11925C20.8204 9.23975 20.7185 9.3295 20.5865 9.3885C20.1097 9.66283 19.726 10.0263 19.4355 10.4788C19.1452 10.9314 19 11.4385 19 12C19 12.5615 19.1452 13.0686 19.4355 13.5213C19.726 13.9738 20.1097 14.3372 20.5865 14.6115C20.7185 14.6705 20.8204 14.7603 20.8923 14.8808C20.9641 15.0013 21 15.1339 21 15.2788V17.3845C21 17.832 20.8427 18.2132 20.528 18.528C20.2132 18.8427 19.832 19 19.3845 19H4.6155Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                  My Tickets
                </NavLink>
                <NavLink
                  to="winnings"
                  className="cta-btn profile-nav-btn d-flex align-items-center gap-2"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_40000362_14841"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    >
                      <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_40000362_14841)">
                      <path
                        d="M8.3845 20V19H11.5V15.2463C10.6192 15.0884 9.84833 14.7201 9.1875 14.1412C8.52667 13.5624 8.07183 12.8448 7.823 11.9885C6.76533 11.8642 5.86375 11.4305 5.11825 10.6875C4.37275 9.9445 4 9.04867 4 8V7C4 6.732 4.09967 6.49833 4.299 6.299C4.49833 6.09967 4.732 6 5 6H7.65375V4H16.3462V6H19C19.268 6 19.5017 6.09967 19.701 6.299C19.9003 6.49833 20 6.732 20 7V8C20 9.04867 19.6273 9.9445 18.8818 10.6875C18.1363 11.4305 17.2347 11.8642 16.177 11.9885C15.9282 12.8448 15.4733 13.5624 14.8125 14.1412C14.1517 14.7201 13.3808 15.0884 12.5 15.2463V19H15.6155V20H8.3845ZM7.65375 10.9155V7H5V8C5 8.7615 5.25383 9.41567 5.7615 9.9625C6.26917 10.5093 6.89992 10.827 7.65375 10.9155ZM16.3462 10.9155C17.1001 10.827 17.7308 10.5093 18.2385 9.9625C18.7462 9.41567 19 8.7615 19 8V7H16.3462V10.9155Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                  Winnings
                </NavLink>
                <NavLink
                  to="transactions"
                  className="cta-btn profile-nav-btn d-flex align-items-center gap-2"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_40000362_14846"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    >
                      <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_40000362_14846)">
                      <path
                        d="M5.6155 20C5.15517 20 4.77083 19.8458 4.4625 19.5375C4.15417 19.2292 4 18.8448 4 18.3845V5.6155C4 5.15517 4.15417 4.77083 4.4625 4.4625C4.77083 4.15417 5.15517 4 5.6155 4H18.3845C18.8448 4 19.2292 4.15417 19.5375 4.4625C19.8458 4.77083 20 5.15517 20 5.6155V7H13.6155C12.8167 7 12.1811 7.23625 11.7088 7.70875C11.2363 8.18108 11 8.81667 11 9.6155V14.3845C11 15.1833 11.2363 15.8189 11.7088 16.2913C12.1811 16.7638 12.8167 17 13.6155 17H20V18.3845C20 18.8448 19.8458 19.2292 19.5375 19.5375C19.2292 19.8458 18.8448 20 18.3845 20H5.6155ZM13.6155 16C13.1552 16 12.7708 15.8458 12.4625 15.5375C12.1542 15.2292 12 14.8448 12 14.3845V9.6155C12 9.15517 12.1542 8.77083 12.4625 8.4625C12.7708 8.15417 13.1552 8 13.6155 8H19.3845C19.8448 8 20.2292 8.15417 20.5375 8.4625C20.8458 8.77083 21 9.15517 21 9.6155V14.3845C21 14.8448 20.8458 15.2292 20.5375 15.5375C20.2292 15.8458 19.8448 16 19.3845 16H13.6155ZM16 13.5C16.4333 13.5 16.7917 13.3583 17.075 13.075C17.3583 12.7917 17.5 12.4333 17.5 12C17.5 11.5667 17.3583 11.2083 17.075 10.925C16.7917 10.6417 16.4333 10.5 16 10.5C15.5667 10.5 15.2083 10.6417 14.925 10.925C14.6417 11.2083 14.5 11.5667 14.5 12C14.5 12.4333 14.6417 12.7917 14.925 13.075C15.2083 13.3583 15.5667 13.5 16 13.5Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                  Transactions
                </NavLink>
                <NavLink
                  to="help"
                  className="cta-btn profile-nav-btn d-flex align-items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="M480.13-120q-74.67 0-140.41-28.34-65.73-28.34-114.36-76.92-48.63-48.58-76.99-114.26Q120-405.19 120-479.87q0-74.67 28.34-140.41 28.34-65.73 76.92-114.36 48.58-48.63 114.26-76.99Q405.19-840 479.87-840q74.67 0 140.41 28.34 65.73 28.34 114.36 76.92 48.63 48.58 76.99 114.26Q840-554.81 840-480.13q0 74.67-28.34 140.41-28.34 65.73-76.92 114.36-48.58 48.63-114.26 76.99Q554.81-120 480.13-120ZM364-182l69.54-157.69q-32.91-11.45-56.8-35.5-23.89-24.04-35.51-56.81l-160.77 66q23.77 64 71.77 112T364-182Zm-22.77-346q10.08-32.77 34.42-55.81Q400-606.85 432-618.77l-66-160.77q-64.77 24.77-112.77 72.77T180.46-594l160.77 66Zm138.59 155.69q44.8 0 76.33-31.36 31.54-31.35 31.54-76.15 0-44.8-31.36-76.33-31.35-31.54-76.15-31.54-44.8 0-76.33 31.36-31.54 31.35-31.54 76.15 0 44.8 31.36 76.33 31.35 31.54 76.15 31.54ZM596-182q63-24 110.5-71.5T778-364l-157.69-69.54q-10.39 32-34.46 55.96-24.08 23.96-55.85 36.35L596-182Zm22.77-348L778-596q-24-63-71.5-110.5T596-778l-66 159.69q30.23 12.69 53.31 35.12 23.07 22.42 35.46 53.19Z" />
                  </svg>
                  Help & Support
                </NavLink>
                <Button
                  className="cta-btn profile-nav-btn d-flex align-items-center gap-2"
                  onClick={toggle}
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  Sign Out
                </Button>
              </section>
            </aside>
          </Col>
          <Col lg="9" className="h-100">
            <section className="user-profile-content h-100">
              <Outlet />
            </section>
          </Col>
        </Row>
      </Container>

      <Modal
        isOpen={signOutModalOpen}
        toggle={toggle}
        className="signout-modal"
        centered={true}
      >
        <ModalBody className="p-5">
          Are you sure you want to Signout ?
        </ModalBody>
        <ModalFooter className="d-flex justify-content-end align-items-center gap-3">
          <Button className="cta-btn cta-btn--secondary" onClick={toggle}>
            No
          </Button>
          <Button
            className="cta-btn cta-btn--primary"
            onClick={() => {
              navigate("/logout");
              toggle();
            }}
          >
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </article>
  );
};

export default UserProfile;
