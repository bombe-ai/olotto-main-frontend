import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import { useAppDispatch, useAppSelector } from "@/app/config/store";
import { addToCart, removeFromCart } from "@shared/reducers/cart.reducer";
import { fetchPurchasesByUserId, PurchaseDTO } from "@/shared/api/purchase.api";
import TicketImage from "@/components/ticket-image/ticket-image";

import "./scractch-card.scss";

interface ScratchCardProps {
  isAuthenticated: boolean;
  userExtra: any;
  ticket: {
    id: string;
    numbers: number[];
    slot: number;
    oid: string;
  };
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  isAuthenticated,
  userExtra,
  ticket,
}) => {
  const [purchases, setPurchases] = useState<PurchaseDTO[]>([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const account = useAppSelector((state) => state.authentication.account);
  const cartItems = useAppSelector((state) => state.cart.items);

  const isInCart = cartItems.some(
    (item: any) => item.ticketId === String(ticket.id)
  );
  const hasAlreadyPurchased = purchases.some(
    (p) => String(p.ticket?.id) === String(ticket.id)
  );

  useEffect(() => {
    if (isAuthenticated && account?.id) {
      fetchPurchasesByUserId(account.id)
        .then((response) => setPurchases(response.data))
        .catch((err) => console.error(err));
    }
  }, [account?.id, isAuthenticated]);

  const handleAddToCartClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    } else if (cartItems.length >= 4) {
      alert("Your cart is full. Please proceed to checkout.");
      return;
    } else if (
      !userExtra?.user?.firstName ||
      !userExtra?.user?.lastName ||
      !userExtra?.user?.email
    ) {
      alert("Please fill up your profile info");

      navigate("/profile/my-profile", {
        state: { tab: "profile" },
      });
      return;
    }
    dispatch(
      addToCart({
        ticketId: String(ticket.id),
        ticketOid: ticket.oid,
        ticketNumbers: ticket.numbers,
        slot: 1,
        price: 100,
      })
    );
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(String(ticket.id)));
  };

  return (
    <article className="scratch-card d-flex flex-column gap-3 mx-auto">
      <TicketImage ticketId={ticket.oid} ticketNumbers={ticket.numbers} />
      <div className="scratch-card-footer d-flex justify-content-between align-items-center gap-2">
        <div className="people-bought d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faUser} />
          <span>{ticket.slot}/10</span>
        </div>
        <div className="ticket-numbers d-flex flex-wrap justify-content-center align-items-center">
          {ticket.numbers.map((num, index) => (
            <span
              key={`${ticket.id}-${num}-${index}`}
              className="ticket-numbers__item d-flex justify-content-center align-items-center rounded-5"
            >
              {num}
            </span>
          ))}
        </div>

        {isInCart ? (
          <Button
            className="card-remove-btn cta-btn"
            onClick={handleRemoveFromCart}
          >
            Remove
          </Button>
        ) : (
          <Button
            className="card-buy-btn cta-btn"
            onClick={handleAddToCartClick}
            disabled={hasAlreadyPurchased}
          >
            {hasAlreadyPurchased ? "Purchased" : "Add to cart"}
          </Button>
        )}
      </div>
    </article>
  );
};

export default ScratchCard;
