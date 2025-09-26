import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faUser } from "@fortawesome/free-solid-svg-icons";

import { useAppDispatch, useAppSelector } from "@/app/config/store";
import { removeFromCart, clearCart } from "@shared/reducers/cart.reducer";
import TicketImage from "@components/ticket-image/ticket-image";
import "./my-cart.scss";

const MyCart = () => {
  const [userExtra, setUserExtra] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  const account = useAppSelector((state) => state.authentication.account);

  const subTotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.price,
    0
  );

  useEffect(() => {
    if (account?.id) {
      axios
        .get(`/api/user-extras/user/${account.id}`)
        .then((response) => {
          setUserExtra(response.data);
        })
        .catch((error) => {
          console.error("Failed to load userExtra", error);
        });
    }
  }, [account?.id]);

  const handleRemoveItem = (ticketId: string) => {
    dispatch(removeFromCart(ticketId));
  };

  const handleRemoveAll = () => {
    dispatch(clearCart());
  };

  const handleCheckout = async () => {
    if (!userExtra) {
      toast.error("User info not loaded. Please wait a moment and try again.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const totalAmount = cartItems.reduce(
        (sum: number, item: any) => sum + item.price,
        0
      );

      console.log("📦 Sending payment request:", {
        userExtraId: userExtra.id,
        email: userExtra.user?.email || account?.email,
        mobile: userExtra.phoneNumber || "0000000000",
        amount: totalAmount,
        items: cartItems.map((i: any) => ({
          ticketId: Number(i.ticketId),
          slot: Number(i.slot),
          price: Number(i.price),
        })),
      });

      // 1) Ask backend to prepare Any2Pay payload
      const response = await axios.post("/api/payment/initiate", {
        userExtraId: userExtra.id,
        email: userExtra.user?.email || account?.email || "demo@example.com",
        mobile: userExtra.phoneNumber || "0000000000",
        amount: totalAmount,
        items: cartItems.map((i: any) => ({
          ticketId: Number(i.ticketId),
          slot: Number(i.slot),
          price: Number(i.price),
        })),
      });

      const { encData, apiKey, url /* , orderId */ } = response.data;

      // 2) Build hidden form and submit to Any2Pay
      const form = document.createElement("form");
      form.method = "POST";
      form.action = url;

      const inputEnc = document.createElement("input");
      inputEnc.type = "hidden";
      inputEnc.name = "encData";
      inputEnc.value = encData;

      const inputKey = document.createElement("input");
      inputKey.type = "hidden";
      inputKey.name = "apiKey";
      inputKey.value = apiKey;

      form.appendChild(inputEnc);
      form.appendChild(inputKey);
      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Payment initiation failed!"
      );
    } finally {
      setLoading(false);
      dispatch(clearCart());
    }
  };

  return (
    <article className="cart-page w-100 min-vh-100">
      <div className="page-wrapper w-100 d-flex flex-column gap-3">
        <div className="cart-page-header d-flex align-items-center gap-3">
          <Button
            className="cta-btn cta-btn--text"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <h1>My Cart</h1>
        </div>

        <Container fluid className="cart-page-content px-0">
          <Row>
            <Col md="8">
              <section className="cart-list">
                {cartItems.length > 0 ? (
                  <div className="cart-list-container auto-grid overflow-y-auto p-3">
                    {cartItems.map((item: any) => (
                      <article
                        key={item.ticketId}
                        className="cart-list__item d-flex flex-column gap-3 mx-auto"
                      >
                        <TicketImage
                          ticketId={item.ticketOid}
                          ticketNumbers={item.ticketNumbers}
                        />
                        <div className="cart-list__item-footer d-flex justify-content-between align-items-center gap-2">
                          <div className="people-bought d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faUser} />
                            <span>{item.slot}/10</span>
                          </div>
                          <div className="cart-item-price">
                            ₹{item.price.toFixed(2)}
                          </div>
                          <Button
                            className="card-remove-btn cta-btn"
                            onClick={() => handleRemoveItem(item.ticketId)}
                          >
                            Remove
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="text-center mt-4">Your cart is empty.</p>
                )}
              </section>
            </Col>

            <Col md="4">
              <section className="cart-summary d-flex flex-column gap-4 mt-4">
                <div className="cart-summary-details d-flex flex-column gap-3">
                  <h2>Summary</h2>

                  <div className="item-list border-bottom pb-3">
                    {cartItems.map((item: any) => (
                      <div
                        className="d-flex justify-content-between align-items-center"
                        key={item.ticketId}
                      >
                        <span>{item.ticketOid}</span>
                        <span>₹{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="cumulative-summary d-flex flex-column gap-2 pb-3">
                    <div className="d-flex justify-content-between">
                      <span>Subtotal</span>
                      <span>₹{subTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="total-amount d-flex justify-content-between font-weight-bold">
                    <span>Total Amount</span>
                    <span>₹{subTotal.toFixed(2)}</span>
                  </div>

                  <Button
                    className="checkout-btn cta-btn cta-btn--primary rounded-5"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || loading}
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </Button>

                  {cartItems.length > 0 && (
                    <Button
                      className="clear-cart-btn cta-btn cta-btn--secondary rounded-5"
                      onClick={handleRemoveAll}
                    >
                      Clear Cart
                    </Button>
                  )}
                </div>
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </article>
  );
};

export default MyCart;
