import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Button,
  Collapse,
  Modal,
  ModalBody,
  ModalFooter,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  Offcanvas,
} from "reactstrap";
import {
  faBars,
  faChevronDown,
  faChevronUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAppSelector } from "@/app/config/store";

import "./header.scss";
import axios from "axios";

interface IHeaderProps {
  className?: string;
}

const Header: React.FC<IHeaderProps> = ({ className }) => {
  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated
  );
  const account = useAppSelector((state) => state.authentication.account);
  const cartItems = useAppSelector((state) => state.cart.items);
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleProfileCollapse = () => setIsProfileOpen(!isProfileOpen);
  const toggleSignOutModal = () => setSignOutModalOpen(!signOutModalOpen);

  const [userExtra, setUserExtra] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account?.id) {
      setLoading(true);

      axios

        .get(`/api/user-extras/user/${account.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        })

        .then((response) => {
          setUserExtra(response.data);

          setLoading(false);
        })

        .catch((error) => {
          console.error("Failed to load userExtra", error);

          setLoading(false);
        });
    }
  }, [account?.id]);

  return (
    <header className={`app-header ${className}`}>
      <Navbar
        data-cy="navbar"
        expand="true"
        container="fluid"
        fixed="top"
        className="top-nav d-flex justify-content-between align-items-center"
      >
        <NavbarBrand tag={NavLink} to="/">
          <picture className="brand-logo">
            <img
              src={
                className?.includes("admin-portal")
                  ? "/images/O!-logo-green.svg"
                  : "/images/O!-logo.svg"
              }
              alt="Omillionaire"
            />
          </picture>
        </NavbarBrand>

        <nav className="d-flex align-items-center gap-4">
          <div className="nav-link-group d-none d-lg-flex align-items-center gap-3">
            <NavItem>
              <NavLink
                to="/how-to-participate"
                className="nav-link-group__item d-flex flex-column justify-content-center align-items-center gap-1"
              >
                How to Participate
              </NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink
                to="/winners"
                className="nav-link-group__item d-flex flex-column justify-content-center align-items-center gap-1"
              >
                Winners
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/past-winnings"
                className="nav-link-group__item d-flex flex-column justify-content-center align-items-center gap-1"
              >
                Past Winnings
              </NavLink>
            </NavItem> */}
          </div>

          <Button
            className="user-menu-btn cta-btn cta-btn--text d-lg-none d-flex justify-content-center align-items-center"
            onClick={toggleUserMenu}
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>

          {isAuthenticated ? (
            <Button
              className="user-profile-btn cta-btn cta-btn--text d-none d-lg-block"
              onClick={() => navigate("/profile/my-profile")}
            >
              <picture>
                <img src="/images/profile-placeholder.png" alt="User Profile" />
              </picture>
            </Button>
          ) : (
            <div className="d-none d-lg-flex flex-wrap align-items-center gap-3 text-white">
              <Button
                className="login-btn cta-btn cta-btn"
                onClick={() => navigate("/login")}
              >
                LOGIN
              </Button>
              <Button
                className="register-btn cta-btn cta-btn"
                onClick={() => navigate("/register")}
              >
                REGISTER
              </Button>
            </div>
          )}
        </nav>

        <Offcanvas
          className="user-sidemenu"
          direction="end"
          toggle={toggleUserMenu}
          isOpen={userMenuOpen}
        >
          {isAuthenticated ? (
            <>
              <picture className="top-bg">
                <img src="/images/login-mobile.svg" alt="User Profile" />
              </picture>
              <div className="user-sidemenu-header position-relative">
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
                  <h1>
                    {userExtra?.user?.login || account?.login || "User Name"}
                  </h1>
                </section>

                <Button
                  className="toggle-btn cta-btn cta-btn--text position-absolute z-index-1"
                  onClick={toggleUserMenu}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              </div>
              <div className="user-sidemenu-body d-flex flex-column gap-2">
                <div className="user-sidemenu-body__item">
                  <Button
                    className="user-sidemenu-body__item--btn cta-btn cta-btn--text d-flex justify-content-between align-items-center gap-2 w-100"
                    onClick={toggleProfileCollapse}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="item-icon d-flex justify-content-center align-items-center">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 21"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.85 15.8986C4.7 15.2539 5.65 14.7455 6.7 14.3735C7.75 14.0015 8.85 13.8155 10 13.8155C11.15 13.8155 12.25 14.0015 13.3 14.3735C14.35 14.7455 15.3 15.2539 16.15 15.8986C16.7333 15.2208 17.1875 14.452 17.5125 13.5923C17.8375 12.7326 18 11.815 18 10.8396C18 8.64074 17.2208 6.7684 15.6625 5.22258C14.1042 3.67677 12.2167 2.90386 10 2.90386C7.78333 2.90386 5.89583 3.67677 4.3375 5.22258C2.77917 6.7684 2 8.64074 2 10.8396C2 11.815 2.1625 12.7326 2.4875 13.5923C2.8125 14.452 3.26667 15.2208 3.85 15.8986ZM10 11.8316C9.01667 11.8316 8.1875 11.4968 7.5125 10.8272C6.8375 10.1576 6.5 9.33512 6.5 8.35968C6.5 7.38425 6.8375 6.56174 7.5125 5.89216C8.1875 5.22258 9.01667 4.88779 10 4.88779C10.9833 4.88779 11.8125 5.22258 12.4875 5.89216C13.1625 6.56174 13.5 7.38425 13.5 8.35968C13.5 9.33512 13.1625 10.1576 12.4875 10.8272C11.8125 11.4968 10.9833 11.8316 10 11.8316ZM10 20.7593C8.61667 20.7593 7.31667 20.4989 6.1 19.9781C4.88333 19.4573 3.825 18.7505 2.925 17.8578C2.025 16.965 1.3125 15.9152 0.7875 14.7083C0.2625 13.5014 0 12.2118 0 10.8396C0 9.46738 0.2625 8.17782 0.7875 6.97093C1.3125 5.76403 2.025 4.7142 2.925 3.82143C3.825 2.92866 4.88333 2.22188 6.1 1.7011C7.31667 1.18031 8.61667 0.919922 10 0.919922C11.3833 0.919922 12.6833 1.18031 13.9 1.7011C15.1167 2.22188 16.175 2.92866 17.075 3.82143C17.975 4.7142 18.6875 5.76403 19.2125 6.97093C19.7375 8.17782 20 9.46738 20 10.8396C20 12.2118 19.7375 13.5014 19.2125 14.7083C18.6875 15.9152 17.975 16.965 17.075 17.8578C16.175 18.7505 15.1167 19.4573 13.9 19.9781C12.6833 20.4989 11.3833 20.7593 10 20.7593Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <div className="item__info d-flex flex-column align-items-start gap-1">
                        <h2>My Profile</h2>
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={isProfileOpen ? faChevronUp : faChevronDown}
                    />
                  </Button>
                  <Collapse isOpen={isProfileOpen} className="profile-collapse">
                    <Button
                      className="profile-item cta-btn cta-btn--text d-flex align-items-center gap-2 w-100 mt-3"
                      onClick={() => {
                        navigate("/profile/my-profile", {
                          state: { tab: "profile" },
                        });
                        toggleUserMenu();
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="M480-492.31q-57.75 0-98.87-41.12Q340-574.56 340-632.31q0-57.75 41.13-98.87 41.12-41.13 98.87-41.13 57.75 0 98.87 41.13Q620-690.06 620-632.31q0 57.75-41.13 98.88-41.12 41.12-98.87 41.12ZM180-187.69v-88.93q0-29.38 15.96-54.42 15.96-25.04 42.66-38.5 59.3-29.07 119.65-43.61 60.35-14.54 121.73-14.54t121.73 14.54q60.35 14.54 119.65 43.61 26.7 13.46 42.66 38.5Q780-306 780-276.62v88.93H180Zm60-60h480v-28.93q0-12.15-7.04-22.5-7.04-10.34-19.11-16.88-51.7-25.46-105.42-38.58Q534.7-367.69 480-367.69q-54.7 0-108.43 13.11-53.72 13.12-105.42 38.58-12.07 6.54-19.11 16.88-7.04 10.35-7.04 22.5v28.93Zm240-304.62q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 384.62Z" />
                      </svg>
                      Personal Information
                    </Button>
                    <Button
                      className="profile-item cta-btn cta-btn--text d-flex align-items-center gap-2 w-100"
                      onClick={() => {
                        navigate("/profile/my-profile", {
                          state: { tab: "change-password" },
                        });
                        toggleUserMenu();
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.30775 19.5C3.80258 19.5 3.375 19.325 3.025 18.975C2.675 18.625 2.5 18.1974 2.5 17.6923V6.30775C2.5 5.80258 2.675 5.375 3.025 5.025C3.375 4.675 3.80258 4.5 4.30775 4.5H19.6923C20.1974 4.5 20.625 4.675 20.975 5.025C21.325 5.375 21.5 5.80258 21.5 6.30775V17.6923C21.5 18.1974 21.325 18.625 20.975 18.975C20.625 19.325 20.1974 19.5 19.6923 19.5H4.30775ZM6.577 14.9423H7.55375V9.05775H6.76925L5.077 10.2693L5.6 11.0345L6.577 10.3462V14.9423ZM9.65775 14.9423H13.4423V14.0577H11.0153L10.9845 13.9885C11.309 13.6872 11.5885 13.415 11.823 13.172C12.0577 12.9292 12.2705 12.709 12.4615 12.5115C12.7487 12.218 12.9608 11.926 13.098 11.6355C13.2352 11.3452 13.3038 11.0333 13.3038 10.7C13.3038 10.2295 13.1301 9.83817 12.7828 9.526C12.4353 9.21383 11.991 9.05775 11.45 9.05775C11.0487 9.05775 10.6794 9.17308 10.3423 9.40375C10.0051 9.63458 9.76667 9.93717 9.627 10.3115L10.5115 10.673C10.6013 10.4563 10.7302 10.2855 10.898 10.1605C11.066 10.0355 11.25 9.973 11.45 9.973C11.7192 9.973 11.9378 10.0445 12.1058 10.1875C12.2738 10.3305 12.3577 10.518 12.3577 10.75C12.3577 10.9462 12.3212 11.1234 12.248 11.2817C12.175 11.4401 12.0218 11.6423 11.7885 11.8885C11.5282 12.168 11.231 12.4715 10.897 12.799C10.5632 13.1267 10.1501 13.5334 9.65775 14.0192V14.9423ZM17 14.9423C17.568 14.9423 18.0273 14.7804 18.378 14.4567C18.7285 14.1331 18.9038 13.7142 18.9038 13.2C18.9038 12.868 18.8157 12.5869 18.6395 12.3568C18.4632 12.1266 18.2154 11.9577 17.8962 11.85V11.8C18.1551 11.6987 18.3544 11.5471 18.4943 11.3453C18.6339 11.1432 18.7038 10.891 18.7038 10.5885C18.7038 10.1385 18.54 9.77083 18.2125 9.4855C17.885 9.20033 17.4642 9.05775 16.95 9.05775C16.5077 9.05775 16.1298 9.17858 15.8163 9.42025C15.5029 9.66192 15.2898 9.92567 15.177 10.2115L16.0423 10.573C16.1154 10.3795 16.2334 10.226 16.3962 10.1125C16.5591 9.999 16.7437 9.94225 16.95 9.94225C17.1858 9.94225 17.3794 10.0096 17.5307 10.1443C17.6821 10.2789 17.7578 10.4475 17.7578 10.65C17.7578 10.8962 17.668 11.0923 17.4885 11.2385C17.309 11.3847 17.0795 11.4577 16.8 11.4577H16.4078V12.3423H16.85C17.2025 12.3423 17.4752 12.4137 17.6683 12.5568C17.8612 12.6997 17.9578 12.8975 17.9578 13.15C17.9578 13.3858 17.8612 13.591 17.6683 13.7655C17.4752 13.9398 17.2525 14.027 17 14.027C16.7167 14.027 16.492 13.9645 16.326 13.8395C16.16 13.7145 16.0154 13.5001 15.8923 13.1962L15.027 13.5385C15.1565 13.9833 15.394 14.3285 15.7395 14.574C16.085 14.8195 16.5052 14.9423 17 14.9423Z"
                          fill="currentColor"
                        />
                      </svg>
                      Change Password
                    </Button>

                    <Button className="profile-item cta-btn cta-btn--text d-flex align-items-center gap-2 w-100">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 18.8845V17.3848H6.30775V9.923C6.30775 8.57817 6.72283 7.38908 7.553 6.35575C8.383 5.32242 9.44867 4.6615 10.75 4.373V3.75C10.75 3.40283 10.8714 3.10767 11.1143 2.8645C11.3571 2.6215 11.6519 2.5 11.9988 2.5C12.3458 2.5 12.641 2.6215 12.8845 2.8645C13.1282 3.10767 13.25 3.40283 13.25 3.75V4.373C14.5513 4.6615 15.617 5.32242 16.447 6.35575C17.2772 7.38908 17.6923 8.57817 17.6923 9.923V17.3848H19.5V18.8845H4.5ZM11.9983 21.6923C11.5008 21.6923 11.0754 21.5153 10.7223 21.1613C10.3689 20.8073 10.1923 20.3817 10.1923 19.8845H13.8077C13.8077 20.3833 13.6306 20.8093 13.2762 21.1625C12.9219 21.5157 12.4959 21.6923 11.9983 21.6923Z"
                          fill="currentColor"
                        />
                      </svg>
                      My Notifications
                    </Button>

                    <Button
                      className="profile-item cta-btn cta-btn--text d-flex align-items-center gap-2 w-100"
                      onClick={() => {
                        navigate("/profile/transactions");

                        toggleUserMenu();
                      }}
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
                    </Button>

                    {/* <Button
                  className="profile-item cta-btn cta-btn--text d-flex align-items-center gap-2 w-100"
                  onClick={() => {
                    navigate("/profile/my-profile", {
                      state: { tab: "delete-account" },
                    });
                    toggleUserMenu();
                  }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_40000236_15444"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    >
                      <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_40000236_15444)">
                      <path
                        d="M14.623 10.9885L10.5308 6.89625C10.7256 6.77058 10.9471 6.67308 11.1953 6.60375C11.4433 6.53458 11.7243 6.5 12.0385 6.5C12.868 6.5 13.5689 6.78942 14.1413 7.36825C14.7138 7.94708 15 8.65767 15 9.5C15 9.77567 14.9622 10.0536 14.8865 10.3337C14.8108 10.6137 14.723 10.832 14.623 10.9885ZM6.19625 17.4845C7.08458 16.8473 7.99608 16.3573 8.93075 16.0145C9.86542 15.6715 10.8885 15.5 12 15.5C12.7872 15.5 13.5042 15.5958 14.151 15.7875C14.7978 15.9792 15.3289 16.1769 15.7443 16.3807L11.852 12.4885C11.0558 12.427 10.3978 12.1395 9.878 11.626C9.358 11.1125 9.07367 10.4577 9.025 9.6615L6.0405 6.677C5.43017 7.36033 4.9375 8.1465 4.5625 9.0355C4.1875 9.92467 4 10.9128 4 12C4 13.1115 4.19775 14.1198 4.59325 15.025C4.98875 15.9302 5.52308 16.75 6.19625 17.4845ZM18.0307 17.2462C18.5897 16.5629 19.0577 15.7895 19.4345 14.926C19.8115 14.0625 20 13.0872 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C10.977 4 10.0209 4.17567 9.13175 4.527C8.24258 4.87817 7.44992 5.35892 6.75375 5.96925L18.0307 17.2462ZM12 21C10.7487 21 9.57558 20.7663 8.48075 20.299C7.38592 19.8317 6.43242 19.1919 5.62025 18.3798C4.80808 17.5676 4.16833 16.6141 3.701 15.5192C3.23367 14.4244 3 13.2513 3 12C3 10.7448 3.23367 9.57083 3.701 8.478C4.16833 7.385 4.80808 6.43242 5.62025 5.62025C6.43242 4.80808 7.38592 4.16833 8.48075 3.701C9.57558 3.23367 10.7487 3 12 3C13.2552 3 14.4292 3.23367 15.522 3.701C16.615 4.16833 17.5676 4.80808 18.3798 5.62025C19.1919 6.43242 19.8317 7.385 20.299 8.478C20.7663 9.57083 21 10.7448 21 12C21 13.2513 20.7663 14.4244 20.299 15.5192C19.8317 16.6141 19.1919 17.5676 18.3798 18.3798C17.5676 19.1919 16.615 19.8317 15.522 20.299C14.4292 20.7663 13.2552 21 12 21Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                  Delete Account
                </Button> */}
                  </Collapse>
                </div>
                <div className="user-sidemenu-body__item">
                  <Button
                    className="user-sidemenu-body__item--btn cta-btn cta-btn--text d-flex align-items-center gap-3 w-100"
                    onClick={() => {
                      navigate("/profile/help");
                      toggleUserMenu();
                    }}
                  >
                    <div className="item-icon d-flex justify-content-center align-items-center">
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="M480.07-100q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100ZM364-182l58.77-133.85q-37.45-13.22-64.65-40.99-27.2-27.78-41.5-65.16l-135.39 56q23.39 64 71.39 112T364-182Zm-47.38-356q13.54-37.38 40.96-64.65Q385-629.92 422-643.38l-56-135.39q-64.38 24.39-112.38 72.39T181.23-594l135.39 56Zm163.29 171.85q47.4 0 80.67-33.18t33.27-80.58q0-47.4-33.18-80.67t-80.58-33.27q-47.4 0-80.67 33.18t-33.27 80.58q0 47.4 33.18 80.67t80.58 33.27ZM596-182q63-24 110.5-71.5T778-364l-133.85-58.77q-12.69 37-40.23 64.23-27.54 27.23-63.92 41.92L596-182Zm47.38-358L778-596q-24-63-71.5-110.5T596-778l-56 135.85q35.61 13.84 62.15 40.31 26.54 26.46 41.23 61.84Z" />
                      </svg>
                    </div>
                    <div className="item__info d-flex flex-column align-items-start gap-2">
                      <h2>Help & Support</h2>
                    </div>
                  </Button>
                </div>
                <div className="user-sidemenu-body__item">
                  <Button
                    className="user-sidemenu-body__item--btn cta-btn cta-btn--text d-flex align-items-center gap-3 w-100"
                    onClick={() => {
                      navigate("/how-to-participate");
                      toggleUserMenu();
                    }}
                  >
                    <div className="item-icon d-flex justify-content-center align-items-center">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_40001912_28972"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_40001912_28972)">
                          <path
                            d="M11.989 17.6152C12.2745 17.6152 12.5157 17.5168 12.7125 17.3198C12.9093 17.1226 13.0078 16.8812 13.0078 16.5955C13.0078 16.31 12.9092 16.0688 12.712 15.872C12.5148 15.6753 12.2735 15.577 11.988 15.577C11.7025 15.577 11.4613 15.6756 11.2645 15.8728C11.0677 16.0699 10.9692 16.3113 10.9692 16.5968C10.9692 16.8822 11.0678 17.1234 11.265 17.3203C11.4622 17.5169 11.7035 17.6152 11.989 17.6152ZM12.0017 21.5C10.6877 21.5 9.45267 21.2507 8.2965 20.752C7.14033 20.2533 6.13467 19.5766 5.2795 18.7218C4.42433 17.8669 3.74725 16.8617 3.24825 15.706C2.74942 14.5503 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74933 9.45267 3.248 8.2965C3.74667 7.14033 4.42342 6.13467 5.27825 5.2795C6.13308 4.42433 7.13833 3.74725 8.294 3.24825C9.44967 2.74942 10.6844 2.5 11.9983 2.5C13.3123 2.5 14.5473 2.74933 15.7035 3.248C16.8597 3.74667 17.8653 4.42342 18.7205 5.27825C19.5757 6.13308 20.2528 7.13833 20.7518 8.294C21.2506 9.44967 21.5 10.6844 21.5 11.9983C21.5 13.3123 21.2507 14.5473 20.752 15.7035C20.2533 16.8597 19.5766 17.8653 18.7218 18.7205C17.8669 19.5757 16.8617 20.2528 15.706 20.7518C14.5503 21.2506 13.3156 21.5 12.0017 21.5ZM12.081 7.71925C12.5423 7.71925 12.9416 7.8645 13.2788 8.155C13.6161 8.4455 13.7848 8.80858 13.7848 9.24425C13.7848 9.61092 13.677 9.93908 13.4615 10.2288C13.2462 10.5186 13 10.7885 12.723 11.0385C12.36 11.3605 12.0404 11.7147 11.7643 12.1012C11.4881 12.4876 11.3404 12.9179 11.3212 13.3923C11.3147 13.5744 11.3788 13.727 11.5135 13.85C11.6482 13.973 11.8052 14.0345 11.9845 14.0345C12.1768 14.0345 12.3397 13.9704 12.473 13.8422C12.6063 13.7141 12.6916 13.5571 12.7288 13.3713C12.7954 13.0276 12.9374 12.7215 13.1547 12.453C13.3721 12.1843 13.6075 11.9289 13.861 11.6868C14.2255 11.3314 14.5436 10.9441 14.8152 10.5247C15.0871 10.1052 15.223 9.63742 15.223 9.12125C15.223 8.32892 14.9108 7.67792 14.2865 7.16825C13.6622 6.65875 12.9333 6.404 12.1 6.404C11.5052 6.404 10.9443 6.53567 10.4173 6.799C9.89042 7.0625 9.48017 7.44683 9.1865 7.952C9.0955 8.10717 9.06633 8.27042 9.099 8.44175C9.1315 8.61325 9.21942 8.74342 9.36275 8.83225C9.54525 8.93375 9.73267 8.96275 9.925 8.91925C10.1173 8.87558 10.2807 8.766 10.4152 8.5905C10.6179 8.32767 10.8632 8.11675 11.151 7.95775C11.4388 7.79875 11.7488 7.71925 12.081 7.71925Z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="item__info d-flex flex-column align-items-start gap-2">
                      <h2>How to Participate</h2>
                    </div>
                  </Button>
                </div>
                {/* <div className="user-sidemenu-body__item">
                  <Button
                    className="user-sidemenu-body__item--btn cta-btn cta-btn--text d-flex align-items-center gap-3 w-100"
                    onClick={() => {
                      navigate("/winners");
                      toggleUserMenu();
                    }}
                  >
                    <div className="item-icon d-flex justify-content-center align-items-center">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_40001912_28980"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_40001912_28980)">
                          <path
                            d="M7.327 10.8577V7H5.30775C5.21792 7 5.14417 7.02883 5.0865 7.0865C5.02883 7.14417 5 7.21792 5 7.30775V8C5 8.6975 5.21858 9.31 5.65575 9.8375C6.09292 10.365 6.65 10.7051 7.327 10.8577ZM16.673 10.8577C17.35 10.7051 17.9071 10.365 18.3443 9.8375C18.7814 9.31 19 8.6975 19 8V7.30775C19 7.21792 18.9712 7.14417 18.9135 7.0865C18.8558 7.02883 18.7821 7 18.6923 7H16.673V10.8577ZM11.25 19V15.573C10.382 15.4473 9.61758 15.1079 8.95675 14.5548C8.29592 14.0016 7.8475 13.3064 7.6115 12.4692C6.45767 12.3321 5.484 11.8423 4.6905 11C3.89683 10.1577 3.5 9.15767 3.5 8V7.30775C3.5 6.80908 3.67658 6.38308 4.02975 6.02975C4.38308 5.67658 4.80908 5.5 5.30775 5.5H7.327V5.30775C7.327 4.80908 7.50358 4.38308 7.85675 4.02975C8.20992 3.67658 8.63592 3.5 9.13475 3.5H14.8652C15.3641 3.5 15.7901 3.67658 16.1432 4.02975C16.4964 4.38308 16.673 4.80908 16.673 5.30775V5.5H18.6923C19.1909 5.5 19.6169 5.67658 19.9703 6.02975C20.3234 6.38308 20.5 6.80908 20.5 7.30775V8C20.5 9.15767 20.1032 10.1577 19.3095 11C18.516 11.8423 17.5423 12.3321 16.3885 12.4692C16.1525 13.3064 15.7041 14.0016 15.0433 14.5548C14.3824 15.1079 13.618 15.4473 12.75 15.573V19H15.5577C15.7706 19 15.9487 19.0718 16.0922 19.2155C16.2359 19.359 16.3077 19.5372 16.3077 19.75C16.3077 19.9628 16.2359 20.141 16.0922 20.2845C15.9487 20.4282 15.7706 20.5 15.5577 20.5H8.44225C8.22942 20.5 8.05125 20.4282 7.90775 20.2845C7.76408 20.141 7.69225 19.9628 7.69225 19.75C7.69225 19.5372 7.76408 19.359 7.90775 19.2155C8.05125 19.0718 8.22942 19 8.44225 19H11.25Z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="item__info d-flex flex-column align-items-start gap-2">
                      <h2>Winners</h2>
                    </div>
                  </Button>
                </div>
                <div className="user-sidemenu-body__item">
                  <Button
                    className="user-sidemenu-body__item--btn cta-btn cta-btn--text d-flex align-items-center gap-3 w-100"
                    onClick={() => {
                      navigate("/past-winnings");
                      toggleUserMenu();
                    }}
                  >
                    <div className="item-icon d-flex justify-content-center align-items-center">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_40001912_28988"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_40001912_28988)">
                          <path
                            d="M7.475 20.5C6.09933 20.5 4.92625 20.0148 3.95575 19.0443C2.98525 18.0738 2.5 16.9007 2.5 15.525C2.5 14.2007 2.95192 13.061 3.85575 12.1058C4.75958 11.1506 5.87367 10.6372 7.198 10.5655C7.26217 10.5655 7.32633 10.5703 7.3905 10.5798C7.4545 10.5895 7.51858 10.6007 7.58275 10.6135L4.58075 4.57504C4.42692 4.27387 4.43625 3.98095 4.60875 3.69629C4.78108 3.41162 5.03975 3.26929 5.38475 3.26929H8.698C9.04283 3.26929 9.35667 3.3597 9.6395 3.54054C9.92217 3.72137 10.1455 3.96237 10.3095 4.26354L12 7.65404L13.6905 4.26354C13.8545 3.96237 14.0778 3.72137 14.3605 3.54054C14.6433 3.3597 14.9572 3.26929 15.302 3.26929H18.6057C18.9506 3.26929 19.2108 3.41162 19.3865 3.69629C19.5622 3.98095 19.5731 4.27387 19.4193 4.57504L16.4423 10.554C16.4999 10.5412 16.5592 10.5315 16.6202 10.525C16.6811 10.5187 16.7436 10.5155 16.8077 10.5155C18.1283 10.5975 19.2404 11.1161 20.1443 12.0713C21.0481 13.0263 21.5 14.1692 21.5 15.5C21.5 16.8924 21.0148 18.0738 20.0443 19.0443C19.0737 20.0148 17.8923 20.5 16.5 20.5C16.3308 20.5 16.1574 20.4926 15.9798 20.4778C15.8023 20.4631 15.6321 20.4327 15.4693 20.3865C16.3218 19.9147 16.9567 19.2333 17.374 18.3423C17.7913 17.4513 18 16.5039 18 15.5C18 13.8244 17.4189 12.4055 16.2568 11.2433C15.0946 10.0811 13.6757 9.50004 12 9.50004C10.3243 9.50004 8.90542 10.0811 7.74325 11.2433C6.58108 12.4055 6 13.8244 6 15.5C6 16.5244 6.19008 17.4981 6.57025 18.4213C6.95042 19.3443 7.59883 19.9994 8.5155 20.3865C8.34617 20.4327 8.17433 20.4631 8 20.4778C7.82567 20.4926 7.65067 20.5 7.475 20.5ZM12 20C10.75 20 9.6875 19.5625 8.8125 18.6875C7.9375 17.8125 7.5 16.75 7.5 15.5C7.5 14.25 7.9375 13.1875 8.8125 12.3125C9.6875 11.4375 10.75 11 12 11C13.25 11 14.3125 11.4375 15.1875 12.3125C16.0625 13.1875 16.5 14.25 16.5 15.5C16.5 16.75 16.0625 17.8125 15.1875 18.6875C14.3125 19.5625 13.25 20 12 20ZM12 16.725L13.148 17.5923C13.2417 17.6628 13.3321 17.6654 13.4193 17.6C13.5064 17.5347 13.5333 17.4501 13.5 17.3463L13.0635 15.9173L14.202 15.1C14.2955 15.0295 14.3256 14.945 14.2923 14.8463C14.2589 14.7475 14.1853 14.698 14.0712 14.698H12.6673L12.2213 13.1885C12.1879 13.0847 12.1142 13.0328 12 13.0328C11.8858 13.0328 11.8121 13.0847 11.7788 13.1885L11.3328 14.698H9.92875C9.81475 14.698 9.74108 14.7475 9.70775 14.8463C9.67442 14.945 9.7045 15.0295 9.798 15.1L10.9365 15.9173L10.5 17.3463C10.4667 17.4501 10.4936 17.5347 10.5808 17.6C10.6679 17.6654 10.7583 17.6628 10.852 17.5923L12 16.725Z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="item__info d-flex flex-column align-items-start gap-2">
                      <h2>Past Winnings</h2>
                    </div>
                  </Button>
                </div> */}
                <div className="user-sidemenu-body__item">
                  <Button
                    className="user-sidemenu-body__item--btn cta-btn cta-btn--text d-flex align-items-center gap-3 w-100"
                    onClick={toggleSignOutModal}
                  >
                    <div className="item-icon d-flex justify-content-center align-items-center">
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="M212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h268.07v60H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h268.07v60H212.31Zm436.92-169.23-41.54-43.39L705.08-450H363.85v-60h341.23l-97.39-97.38 41.54-43.39L820-480 649.23-309.23Z" />
                      </svg>
                    </div>
                    <div className="item__info d-flex flex-column align-items-start gap-2">
                      <h2>Logout</h2>
                    </div>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="user-sidemenu-header d-flex justify-content-end align-items-center">
                <Button
                  className="toggle-btn toggle-btn--black cta-btn cta-btn--text position-absolute z-index-1"
                  onClick={toggleUserMenu}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              </div>
              <div className="user-sidemenu-body d-flex flex-column gap-2">
                <div className="user-sidemenu-body__item">
                  <Button
                    className="user-sidemenu-body__item--btn cta-btn cta-btn--text d-flex align-items-center gap-3 w-100"
                    onClick={() => {
                      navigate("/how-to-participate");
                      toggleUserMenu();
                    }}
                  >
                    <div className="item-icon d-flex justify-content-center align-items-center">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_40001912_28972"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_40001912_28972)">
                          <path
                            d="M11.989 17.6152C12.2745 17.6152 12.5157 17.5168 12.7125 17.3198C12.9093 17.1226 13.0078 16.8812 13.0078 16.5955C13.0078 16.31 12.9092 16.0688 12.712 15.872C12.5148 15.6753 12.2735 15.577 11.988 15.577C11.7025 15.577 11.4613 15.6756 11.2645 15.8728C11.0677 16.0699 10.9692 16.3113 10.9692 16.5968C10.9692 16.8822 11.0678 17.1234 11.265 17.3203C11.4622 17.5169 11.7035 17.6152 11.989 17.6152ZM12.0017 21.5C10.6877 21.5 9.45267 21.2507 8.2965 20.752C7.14033 20.2533 6.13467 19.5766 5.2795 18.7218C4.42433 17.8669 3.74725 16.8617 3.24825 15.706C2.74942 14.5503 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74933 9.45267 3.248 8.2965C3.74667 7.14033 4.42342 6.13467 5.27825 5.2795C6.13308 4.42433 7.13833 3.74725 8.294 3.24825C9.44967 2.74942 10.6844 2.5 11.9983 2.5C13.3123 2.5 14.5473 2.74933 15.7035 3.248C16.8597 3.74667 17.8653 4.42342 18.7205 5.27825C19.5757 6.13308 20.2528 7.13833 20.7518 8.294C21.2506 9.44967 21.5 10.6844 21.5 11.9983C21.5 13.3123 21.2507 14.5473 20.752 15.7035C20.2533 16.8597 19.5766 17.8653 18.7218 18.7205C17.8669 19.5757 16.8617 20.2528 15.706 20.7518C14.5503 21.2506 13.3156 21.5 12.0017 21.5ZM12.081 7.71925C12.5423 7.71925 12.9416 7.8645 13.2788 8.155C13.6161 8.4455 13.7848 8.80858 13.7848 9.24425C13.7848 9.61092 13.677 9.93908 13.4615 10.2288C13.2462 10.5186 13 10.7885 12.723 11.0385C12.36 11.3605 12.0404 11.7147 11.7643 12.1012C11.4881 12.4876 11.3404 12.9179 11.3212 13.3923C11.3147 13.5744 11.3788 13.727 11.5135 13.85C11.6482 13.973 11.8052 14.0345 11.9845 14.0345C12.1768 14.0345 12.3397 13.9704 12.473 13.8422C12.6063 13.7141 12.6916 13.5571 12.7288 13.3713C12.7954 13.0276 12.9374 12.7215 13.1547 12.453C13.3721 12.1843 13.6075 11.9289 13.861 11.6868C14.2255 11.3314 14.5436 10.9441 14.8152 10.5247C15.0871 10.1052 15.223 9.63742 15.223 9.12125C15.223 8.32892 14.9108 7.67792 14.2865 7.16825C13.6622 6.65875 12.9333 6.404 12.1 6.404C11.5052 6.404 10.9443 6.53567 10.4173 6.799C9.89042 7.0625 9.48017 7.44683 9.1865 7.952C9.0955 8.10717 9.06633 8.27042 9.099 8.44175C9.1315 8.61325 9.21942 8.74342 9.36275 8.83225C9.54525 8.93375 9.73267 8.96275 9.925 8.91925C10.1173 8.87558 10.2807 8.766 10.4152 8.5905C10.6179 8.32767 10.8632 8.11675 11.151 7.95775C11.4388 7.79875 11.7488 7.71925 12.081 7.71925Z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="item__info d-flex flex-column align-items-start gap-2">
                      <h2>How to Participate</h2>
                    </div>
                  </Button>
                </div>
                {/* <div className="user-sidemenu-body__item">
                  <Button
                    className="user-sidemenu-body__item--btn cta-btn cta-btn--text d-flex align-items-center gap-3 w-100"
                    onClick={() => {
                      navigate("/winners");
                      toggleUserMenu();
                    }}
                  >
                    <div className="item-icon d-flex justify-content-center align-items-center">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_40001912_28980"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_40001912_28980)">
                          <path
                            d="M7.327 10.8577V7H5.30775C5.21792 7 5.14417 7.02883 5.0865 7.0865C5.02883 7.14417 5 7.21792 5 7.30775V8C5 8.6975 5.21858 9.31 5.65575 9.8375C6.09292 10.365 6.65 10.7051 7.327 10.8577ZM16.673 10.8577C17.35 10.7051 17.9071 10.365 18.3443 9.8375C18.7814 9.31 19 8.6975 19 8V7.30775C19 7.21792 18.9712 7.14417 18.9135 7.0865C18.8558 7.02883 18.7821 7 18.6923 7H16.673V10.8577ZM11.25 19V15.573C10.382 15.4473 9.61758 15.1079 8.95675 14.5548C8.29592 14.0016 7.8475 13.3064 7.6115 12.4692C6.45767 12.3321 5.484 11.8423 4.6905 11C3.89683 10.1577 3.5 9.15767 3.5 8V7.30775C3.5 6.80908 3.67658 6.38308 4.02975 6.02975C4.38308 5.67658 4.80908 5.5 5.30775 5.5H7.327V5.30775C7.327 4.80908 7.50358 4.38308 7.85675 4.02975C8.20992 3.67658 8.63592 3.5 9.13475 3.5H14.8652C15.3641 3.5 15.7901 3.67658 16.1432 4.02975C16.4964 4.38308 16.673 4.80908 16.673 5.30775V5.5H18.6923C19.1909 5.5 19.6169 5.67658 19.9703 6.02975C20.3234 6.38308 20.5 6.80908 20.5 7.30775V8C20.5 9.15767 20.1032 10.1577 19.3095 11C18.516 11.8423 17.5423 12.3321 16.3885 12.4692C16.1525 13.3064 15.7041 14.0016 15.0433 14.5548C14.3824 15.1079 13.618 15.4473 12.75 15.573V19H15.5577C15.7706 19 15.9487 19.0718 16.0922 19.2155C16.2359 19.359 16.3077 19.5372 16.3077 19.75C16.3077 19.9628 16.2359 20.141 16.0922 20.2845C15.9487 20.4282 15.7706 20.5 15.5577 20.5H8.44225C8.22942 20.5 8.05125 20.4282 7.90775 20.2845C7.76408 20.141 7.69225 19.9628 7.69225 19.75C7.69225 19.5372 7.76408 19.359 7.90775 19.2155C8.05125 19.0718 8.22942 19 8.44225 19H11.25Z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="item__info d-flex flex-column align-items-start gap-2">
                      <h2>Winners</h2>
                    </div>
                  </Button>
                </div>
                <div className="user-sidemenu-body__item">
                  <Button
                    className="user-sidemenu-body__item--btn cta-btn cta-btn--text d-flex align-items-center gap-3 w-100"
                    onClick={() => {
                      navigate("/past-winnings");
                      toggleUserMenu();
                    }}
                  >
                    <div className="item-icon d-flex justify-content-center align-items-center">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_40001912_28988"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_40001912_28988)">
                          <path
                            d="M7.475 20.5C6.09933 20.5 4.92625 20.0148 3.95575 19.0443C2.98525 18.0738 2.5 16.9007 2.5 15.525C2.5 14.2007 2.95192 13.061 3.85575 12.1058C4.75958 11.1506 5.87367 10.6372 7.198 10.5655C7.26217 10.5655 7.32633 10.5703 7.3905 10.5798C7.4545 10.5895 7.51858 10.6007 7.58275 10.6135L4.58075 4.57504C4.42692 4.27387 4.43625 3.98095 4.60875 3.69629C4.78108 3.41162 5.03975 3.26929 5.38475 3.26929H8.698C9.04283 3.26929 9.35667 3.3597 9.6395 3.54054C9.92217 3.72137 10.1455 3.96237 10.3095 4.26354L12 7.65404L13.6905 4.26354C13.8545 3.96237 14.0778 3.72137 14.3605 3.54054C14.6433 3.3597 14.9572 3.26929 15.302 3.26929H18.6057C18.9506 3.26929 19.2108 3.41162 19.3865 3.69629C19.5622 3.98095 19.5731 4.27387 19.4193 4.57504L16.4423 10.554C16.4999 10.5412 16.5592 10.5315 16.6202 10.525C16.6811 10.5187 16.7436 10.5155 16.8077 10.5155C18.1283 10.5975 19.2404 11.1161 20.1443 12.0713C21.0481 13.0263 21.5 14.1692 21.5 15.5C21.5 16.8924 21.0148 18.0738 20.0443 19.0443C19.0737 20.0148 17.8923 20.5 16.5 20.5C16.3308 20.5 16.1574 20.4926 15.9798 20.4778C15.8023 20.4631 15.6321 20.4327 15.4693 20.3865C16.3218 19.9147 16.9567 19.2333 17.374 18.3423C17.7913 17.4513 18 16.5039 18 15.5C18 13.8244 17.4189 12.4055 16.2568 11.2433C15.0946 10.0811 13.6757 9.50004 12 9.50004C10.3243 9.50004 8.90542 10.0811 7.74325 11.2433C6.58108 12.4055 6 13.8244 6 15.5C6 16.5244 6.19008 17.4981 6.57025 18.4213C6.95042 19.3443 7.59883 19.9994 8.5155 20.3865C8.34617 20.4327 8.17433 20.4631 8 20.4778C7.82567 20.4926 7.65067 20.5 7.475 20.5ZM12 20C10.75 20 9.6875 19.5625 8.8125 18.6875C7.9375 17.8125 7.5 16.75 7.5 15.5C7.5 14.25 7.9375 13.1875 8.8125 12.3125C9.6875 11.4375 10.75 11 12 11C13.25 11 14.3125 11.4375 15.1875 12.3125C16.0625 13.1875 16.5 14.25 16.5 15.5C16.5 16.75 16.0625 17.8125 15.1875 18.6875C14.3125 19.5625 13.25 20 12 20ZM12 16.725L13.148 17.5923C13.2417 17.6628 13.3321 17.6654 13.4193 17.6C13.5064 17.5347 13.5333 17.4501 13.5 17.3463L13.0635 15.9173L14.202 15.1C14.2955 15.0295 14.3256 14.945 14.2923 14.8463C14.2589 14.7475 14.1853 14.698 14.0712 14.698H12.6673L12.2213 13.1885C12.1879 13.0847 12.1142 13.0328 12 13.0328C11.8858 13.0328 11.8121 13.0847 11.7788 13.1885L11.3328 14.698H9.92875C9.81475 14.698 9.74108 14.7475 9.70775 14.8463C9.67442 14.945 9.7045 15.0295 9.798 15.1L10.9365 15.9173L10.5 17.3463C10.4667 17.4501 10.4936 17.5347 10.5808 17.6C10.6679 17.6654 10.7583 17.6628 10.852 17.5923L12 16.725Z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="item__info d-flex flex-column align-items-start gap-2">
                      <h2>Past Winnings</h2>
                    </div>
                  </Button>
                </div> */}
              </div>
              <div className="button-group d-flex flex-column gap-3 mt-auto mb-3">
                <Button
                  className="login-btn cta-btn cta-btn w-100"
                  onClick={() => {
                    navigate("/login");
                    toggleUserMenu();
                  }}
                >
                  LOGIN
                </Button>
                <Button
                  className="register-btn cta-btn cta-btn w-100"
                  onClick={() => {
                    navigate("/register");
                    toggleUserMenu();
                  }}
                >
                  REGISTER
                </Button>
              </div>
            </>
          )}
        </Offcanvas>

        <Modal
          isOpen={signOutModalOpen}
          toggle={toggleSignOutModal}
          className="signout-modal"
          centered={true}
        >
          <ModalBody className="p-5">
            Are you sure you want to Signout ?
          </ModalBody>
          <ModalFooter className="d-flex justify-content-end align-items-center gap-3">
            <Button
              className="cta-btn cta-btn--secondary"
              onClick={toggleSignOutModal}
            >
              No
            </Button>
            <Button
              className="cta-btn cta-btn--primary"
              onClick={() => {
                navigate("/logout");
                toggleSignOutModal();
              }}
            >
              Yes
            </Button>
          </ModalFooter>
        </Modal>
      </Navbar>

      {/* Mobile Bottom Nav  */}
      <Navbar
        expand="true"
        container="fluid"
        fixed="bottom"
        className="bottom-nav d-flex d-lg-none"
      >
        <Nav className="w-100 justify-content-between align-items-center gap-2">
          <NavItem>
            <NavLink
              to="/"
              className="d-flex flex-column justify-content-center align-items-center gap-1"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.037 6.81969L14.2774 2.78969C12.7075 1.68969 10.2977 1.74969 8.7878 2.91969L3.77815 6.82969C2.77823 7.60969 1.98828 9.20969 1.98828 10.4697V17.3697C1.98828 19.9197 4.05814 21.9997 6.60795 21.9997H17.3872C19.937 21.9997 22.0069 19.9297 22.0069 17.3797V10.5997C22.0069 9.2497 21.1369 7.58969 20.037 6.81969ZM12.7475 17.9997C12.7475 18.4097 12.4075 18.7497 11.9976 18.7497C11.5876 18.7497 11.2476 18.4097 11.2476 17.9997V14.9997C11.2476 14.5897 11.5876 14.2497 11.9976 14.2497C12.4075 14.2497 12.7475 14.5897 12.7475 14.9997V17.9997Z"
                  fill="currentColor"
                />
              </svg>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/my-tickets"
              className="d-flex flex-column justify-content-center align-items-center gap-1"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_40000456_6984"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_40000456_6984)">
                  <path
                    d="M9.93075 15L12 13.4L14.0193 14.9615L13.2385 12.4463L15.3845 10.7845H12.8307L12 8.23075L11.1692 10.7845H8.6155L10.7115 12.4463L9.93075 15ZM4.6155 19C4.168 19 3.78683 18.8427 3.472 18.528C3.15733 18.2132 3 17.832 3 17.3845V15.2788C3 15.1339 3.03592 15.0013 3.10775 14.8808C3.17958 14.7603 3.2815 14.6705 3.4135 14.6115C3.89033 14.3372 4.274 13.9738 4.5645 13.5213C4.85483 13.0686 5 12.5615 5 12C5 11.4385 4.85483 10.9314 4.5645 10.4788C4.274 10.0263 3.89033 9.66283 3.4135 9.3885C3.2815 9.3295 3.17958 9.23975 3.10775 9.11925C3.03592 8.99875 3 8.86608 3 8.72125V6.6155C3 6.168 3.15733 5.78683 3.472 5.472C3.78683 5.15733 4.168 5 4.6155 5H19.3845C19.832 5 20.2132 5.15733 20.528 5.472C20.8427 5.78683 21 6.168 21 6.6155V8.72125C21 8.86608 20.9641 8.99875 20.8923 9.11925C20.8204 9.23975 20.7185 9.3295 20.5865 9.3885C20.1097 9.66283 19.726 10.0263 19.4355 10.4788C19.1452 10.9314 19 11.4385 19 12C19 12.5615 19.1452 13.0686 19.4355 13.5213C19.726 13.9738 20.1097 14.3372 20.5865 14.6115C20.7185 14.6705 20.8204 14.7603 20.8923 14.8808C20.9641 15.0013 21 15.1339 21 15.2788V17.3845C21 17.832 20.8427 18.2132 20.528 18.528C20.2132 18.8427 19.832 19 19.3845 19H4.6155Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
              My Tickets
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/winnings"
              className="d-flex flex-column justify-content-center align-items-center gap-1"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_40000456_6989"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_40000456_6989)">
                  <path
                    d="M8.3845 20V19H11.5V15.2463C10.6192 15.0884 9.84833 14.7201 9.1875 14.1412C8.52667 13.5624 8.07183 12.8448 7.823 11.9885C6.76533 11.8642 5.86375 11.4305 5.11825 10.6875C4.37275 9.9445 4 9.04867 4 8V7C4 6.732 4.09967 6.49833 4.299 6.299C4.49833 6.09967 4.732 6 5 6H7.65375V4H16.3462V6H19C19.268 6 19.5017 6.09967 19.701 6.299C19.9003 6.49833 20 6.732 20 7V8C20 9.04867 19.6273 9.9445 18.8818 10.6875C18.1363 11.4305 17.2347 11.8642 16.177 11.9885C15.9282 12.8448 15.4733 13.5624 14.8125 14.1412C14.1517 14.7201 13.3808 15.0884 12.5 15.2463V19H15.6155V20H8.3845ZM7.65375 10.9155V7H5V8C5 8.7615 5.25383 9.41567 5.7615 9.9625C6.26917 10.5093 6.89992 10.827 7.65375 10.9155ZM16.3462 10.9155C17.1001 10.827 17.7308 10.5093 18.2385 9.9625C18.7462 9.41567 19 8.7615 19 8V7H16.3462V10.9155Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
              Winnings
            </NavLink>
          </NavItem>
          <NavItem className="position-relative">
            {cartItems.length > 0 && (
              <span className="cart-item-count position-absolute z-index-1">
                {cartItems.length}
              </span>
            )}
            <NavLink
              to="/cart"
              className="d-flex flex-column justify-content-center align-items-center gap-1"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.30372 21.7129C4.79859 21.7129 4.37103 21.536 4.02106 21.1822C3.67108 20.8283 3.49609 20.3961 3.49609 19.8854V8.37662C3.49609 7.86593 3.67108 7.43368 4.02106 7.07986C4.37103 6.72604 4.79859 6.54913 5.30372 6.54913H7.49581C7.49581 5.28683 7.93361 4.21307 8.80922 3.32784C9.68482 2.44261 10.7469 2 11.9955 2C13.2441 2 14.3062 2.44261 15.1818 3.32784C16.0574 4.21307 16.4952 5.28683 16.4952 6.54913H18.6873C19.1924 6.54913 19.62 6.72604 19.9699 7.07986C20.3199 7.43368 20.4949 7.86593 20.4949 8.37662V19.8854C20.4949 20.3961 20.3199 20.8283 19.9699 21.1822C19.62 21.536 19.1924 21.7129 18.6873 21.7129H5.30372ZM8.99571 6.54913H14.9953C14.9953 5.7067 14.7036 4.99063 14.1203 4.40093C13.5371 3.81123 12.8288 3.51638 11.9955 3.51638C11.1622 3.51638 10.4539 3.81123 9.87064 4.40093C9.28735 4.99063 8.99571 5.7067 8.99571 6.54913ZM11.98 13.6256C13.1107 13.6256 14.1264 13.2387 15.027 12.465C15.9276 11.6912 16.3728 10.8131 16.3624 9.83082C16.3624 9.62207 16.2932 9.44414 16.1547 9.29706C16.0164 9.14997 15.8408 9.07642 15.628 9.07642C15.4523 9.07642 15.2953 9.13767 15.1568 9.26016C15.0183 9.38265 14.9202 9.55341 14.8625 9.77244C14.7177 10.458 14.3722 11.0189 13.8261 11.4551C13.28 11.8912 12.6646 12.1092 11.98 12.1092C11.2955 12.1092 10.6777 11.8912 10.1264 11.4551C9.57508 11.0189 9.23219 10.458 9.0977 9.77244C9.04004 9.54296 8.94704 9.36959 8.81872 9.25232C8.69056 9.13506 8.53865 9.07642 8.363 9.07642C8.15018 9.07642 7.97203 9.14997 7.82854 9.29706C7.68488 9.44414 7.61305 9.62207 7.61305 9.83082C7.61305 10.8131 8.05827 11.6912 8.94871 12.465C9.83898 13.2387 10.8494 13.6256 11.98 13.6256Z"
                  fill="currentColor"
                />
              </svg>
              Cart
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    </header>
  );
};

export default Header;
