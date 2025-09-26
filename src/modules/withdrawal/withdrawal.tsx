import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  FormFeedback,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./withdrawal.scss";

const Withdrawal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item, userExtraId } = location.state || {};

  const [withdrawalSuccess, setWithdrawalSuccess] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const toggle = () => setOpenModal(!openModal);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    panCard: "",
    accountNumber: "",
    ifscCode: "",
    swiftCode: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    address: "",
    panCard: "",
    accountNumber: "",
    ifscCode: "",
    swiftCode: "",
  });

  // If you navigated here from Winnings page, we’ll use that amount.
  const requestedAmount: number | null = useMemo(() => {
    const amt = item?.prizeAmount;
    if (amt == null) return null;
    const n = Number(amt);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [item]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if ((errors as any)[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (pageError) setPageError(null);
  };

  const validateForm = () => {
    const newErrors: any = {
      fullName: "",
      address: "",
      panCard: "",
      accountNumber: "",
      ifscCode: "",
      swiftCode: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please provide a complete address";
    }

    if (!formData.panCard.trim()) {
      newErrors.panCard = "PAN card is required";
    } else if (
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard.toUpperCase())
    ) {
      newErrors.panCard = "Invalid PAN format (e.g., ABCDE1234F)";
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (!/^[0-9]{9,18}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be 9-18 digits";
    }

    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC code is required";
    } else if (
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())
    ) {
      newErrors.ifscCode = "Invalid IFSC format (e.g., SBIN0001234)";
    }

    if (
      formData.swiftCode.trim() &&
      !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(
        formData.swiftCode.toUpperCase()
      )
    ) {
      newErrors.swiftCode = "Invalid SWIFT format (e.g., SBININBB123)";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageError(null);

    // Hard guards so user sees a helpful message before we hit the backend
    if (!userExtraId) {
      setPageError(
        "User is not identified for this request. Please navigate from your Winnings page and try again."
      );
      return;
    }
    if (requestedAmount == null) {
      setPageError(
        "No prize amount found for this withdrawal. Go back and open this form from your winning ticket."
      );
      return;
    }

    if (validateForm()) {
      processWithdrawal();
    }
  };

  const processWithdrawal = async () => {
    try {
      setSubmitting(true);

      const payload = {
        userExtraId, // required
        // winnerId: item?.winnerId,       // optional: include if you track winnerId
        amount: requestedAmount, // required on backend
        fullName: formData.fullName,
        address: formData.address,
        panCard: formData.panCard.toUpperCase(),
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode.toUpperCase(),
        swiftCode: formData.swiftCode
          ? formData.swiftCode.toUpperCase()
          : undefined,
      };

      await axios.post("/api/withdrawals", payload);

      setWithdrawalSuccess(true);
      setOpenModal(true);
    } catch (err: any) {
      console.error(err);
      setWithdrawalSuccess(false);
      // Optional: show a banner message also
      setPageError(
        err?.response?.data?.message ||
          "Your withdrawal request could not be processed. You might already have a pending request."
      );
      setOpenModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="withdrawal-page position-relative min-vh-100">
      <picture className="page-bg position-absolute d-none d-md-block">
        <img src="/images/user-profile-bg.svg" alt="User Name" />
      </picture>

      <Container fluid className="page-wrapper position-relative h-100">
        <Row className="withdrawal h-100">
          <Col md="8" className="h-100 mx-auto">
            <section className="withdrawal-content h-100">
              <header className="withdrawal-header d-flex align-items-center gap-2">
                <Button
                  className="cta-btn cta-btn--text d-flex align-items-center gap-2 p-2"
                  onClick={() => navigate(-1)}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                  Back
                </Button>
              </header>

              <Form
                className="withdrawal-form d-flex flex-column gap-4"
                onSubmit={handleSubmit}
              >
                <h1 className="withdrawal-form__title">
                  Fill the withdrawal form
                </h1>

                {/* Helpful context for user */}
                {!userExtraId && (
                  <Alert color="warning">
                    Unable to identify your account. Please open this form from
                    your Winnings page.
                  </Alert>
                )}
                {requestedAmount == null && (
                  <Alert color="warning">
                    No prize amount detected for this request. Please start from
                    your winning ticket.
                  </Alert>
                )}
                {pageError && <Alert color="danger">{pageError}</Alert>}

                <section className="withdrawal-from-top-section d-flex flex-column gap-3">
                  <FormGroup>
                    <Label for="fullName">Full Name</Label>
                    <Input
                      type="text"
                      name="fullName"
                      id="fullName"
                      placeholder="Enter name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      invalid={!!errors.fullName}
                      disabled={submitting}
                    />
                    {errors.fullName && (
                      <FormFeedback>{errors.fullName}</FormFeedback>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="address">Address</Label>
                    <Input
                      type="textarea"
                      name="address"
                      id="address"
                      rows={4}
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      invalid={!!errors.address}
                      disabled={submitting}
                    />
                    {errors.address && (
                      <FormFeedback>{errors.address}</FormFeedback>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="panCard">PAN Card</Label>
                    <Input
                      type="text"
                      name="panCard"
                      id="panCard"
                      placeholder="PAN Card"
                      value={formData.panCard}
                      onChange={handleInputChange}
                      invalid={!!errors.panCard}
                      maxLength={10}
                      style={{ textTransform: "uppercase" }}
                      disabled={submitting}
                    />
                    {errors.panCard && (
                      <FormFeedback>{errors.panCard}</FormFeedback>
                    )}
                  </FormGroup>
                </section>

                <section className="withdrawal-from-bottom-section d-flex flex-column gap-3">
                  <h2>Bank Details</h2>

                  <FormGroup>
                    <Label for="accountNumber">Account number</Label>
                    <Input
                      type="text"
                      name="accountNumber"
                      id="accountNumber"
                      placeholder="Account number"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      invalid={!!errors.accountNumber}
                      maxLength={18}
                      disabled={submitting}
                    />
                    {errors.accountNumber && (
                      <FormFeedback>{errors.accountNumber}</FormFeedback>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="ifscCode">IFSC Code</Label>
                    <Input
                      type="text"
                      name="ifscCode"
                      id="ifscCode"
                      placeholder="IFSC Code"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      invalid={!!errors.ifscCode}
                      maxLength={11}
                      style={{ textTransform: "uppercase" }}
                      disabled={submitting}
                    />
                    {errors.ifscCode && (
                      <FormFeedback>{errors.ifscCode}</FormFeedback>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="swiftCode">SWIFT (optional)</Label>
                    <Input
                      type="text"
                      name="swiftCode"
                      id="swiftCode"
                      placeholder="SWIFT Code"
                      value={formData.swiftCode}
                      onChange={handleInputChange}
                      invalid={!!errors.swiftCode}
                      maxLength={11}
                      style={{ textTransform: "uppercase" }}
                      disabled={submitting}
                    />
                    {errors.swiftCode && (
                      <FormFeedback>{errors.swiftCode}</FormFeedback>
                    )}
                  </FormGroup>
                </section>

                <div className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    className="submit-btn cta-btn cta-btn--primary"
                    disabled={
                      submitting || !userExtraId || requestedAmount == null
                    }
                  >
                    {submitting ? <Spinner size="sm" /> : "Submit"}
                  </Button>
                </div>
              </Form>
            </section>
          </Col>
        </Row>
      </Container>

      <Modal
        isOpen={openModal}
        toggle={toggle}
        className="withdrawal-modal"
        centered
        backdrop="static"
      >
        <ModalBody className="p-5">
          <section className="d-flex flex-column align-items-center text-center gap-3">
            <div className="withdrawal-modal-icon">
              {withdrawalSuccess ? (
                <svg
                  viewBox="0 0 85 84"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M36.6654 61.1673L66.0404 31.7923L60.207 25.959L36.6654 49.5007L24.7904 37.6257L18.957 43.459L36.6654 61.1673ZM42.4987 83.6673C36.7348 83.6673 31.3181 82.5736 26.2487 80.3861C21.1793 78.1986 16.7695 75.2298 13.0195 71.4798C9.26953 67.7298 6.30078 63.3201 4.11328 58.2507C1.92578 53.1812 0.832031 47.7645 0.832031 42.0007C0.832031 36.2368 1.92578 30.8201 4.11328 25.7507C6.30078 20.6812 9.26953 16.2715 13.0195 12.5215C16.7695 8.77148 21.1793 5.80273 26.2487 3.61523C31.3181 1.42773 36.7348 0.333984 42.4987 0.333984C48.2626 0.333984 53.6793 1.42773 58.7487 3.61523C63.8181 5.80273 68.2279 8.77148 71.9779 12.5215C75.7279 16.2715 78.6966 20.6812 80.8841 25.7507C83.0716 30.8201 84.1654 36.2368 84.1654 42.0007C84.1654 47.7645 83.0716 53.1812 80.8841 58.2507C78.6966 63.3201 75.7279 67.7298 71.9779 71.4798C68.2279 75.2298 63.8181 78.1986 58.7487 80.3861C53.6793 82.5736 48.2626 83.6673 42.4987 83.6673Z"
                    fill="url(#paint0_linear_40001406_16389)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_40001406_16389"
                      x1="0.832031"
                      y1="42.0007"
                      x2="152.046"
                      y2="42.0007"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#00B611" />
                      <stop offset="1" stopColor="#007A33" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : (
                <svg
                  viewBox="0 0 101 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_40001406_16405"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="101"
                    height="100"
                  >
                    <rect x="0.5" width="100" height="100" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_40001406_16405)">
                    <path
                      d="M35.4987 70.834L50.4987 55.834L65.4987 70.834L71.332 65.0007L56.332 50.0007L71.332 35.0007L65.4987 29.1673L50.4987 44.1673L35.4987 29.1673L29.6654 35.0007L44.6654 50.0007L29.6654 65.0007L35.4987 70.834ZM50.4987 91.6673C44.7348 91.6673 39.3181 90.5736 34.2487 88.3861C29.1793 86.1986 24.7695 83.2298 21.0195 79.4798C17.2695 75.7298 14.3008 71.3201 12.1133 66.2507C9.92578 61.1812 8.83203 55.7645 8.83203 50.0007C8.83203 44.2368 9.92578 38.8201 12.1133 33.7507C14.3008 28.6812 17.2695 24.2715 21.0195 20.5215C24.7695 16.7715 29.1793 13.8027 34.2487 11.6152C39.3181 9.42773 44.7348 8.33398 50.4987 8.33398C56.2626 8.33398 61.6793 9.42773 66.7487 11.6152C71.8181 13.8027 76.2279 16.7715 79.9779 20.5215C83.7279 24.2715 86.6966 28.6812 88.8841 33.7507C91.0716 38.8201 92.1654 44.2368 92.1654 50.0007C92.1654 55.7645 91.0716 61.1812 88.8841 66.2507C86.6966 71.3201 83.7279 75.7298 79.9779 79.4798C76.2279 83.2298 71.8181 86.1986 66.7487 88.3861C61.6793 90.5736 56.2626 91.6673 50.4987 91.6673Z"
                      fill="#E92222"
                    />
                  </g>
                </svg>
              )}
            </div>
            <h3>
              {withdrawalSuccess
                ? "Withdrawal Successful"
                : "Withdrawal Failed"}
            </h3>
            <p>
              {withdrawalSuccess
                ? "Your payout request has been submitted. You can track its status in the Winnings section."
                : "Your withdrawal request could not be processed. Please review the details and try again."}
            </p>
          </section>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-center align-items-center gap-3">
          <Button
            className="modal-btn cta-btn cta-btn--text fw-bold"
            onClick={() => {
              navigate("/");
              toggle();
            }}
          >
            go to home
          </Button>
        </ModalFooter>
      </Modal>
    </article>
  );
};

export default Withdrawal;
