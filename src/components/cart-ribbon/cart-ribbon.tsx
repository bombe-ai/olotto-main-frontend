import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "./cart-ribbon.scss";
import { useAppDispatch, useAppSelector } from "@/app/config/store";
import { clearCart } from "@shared/reducers/cart.reducer";

const CartRibbon = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);

  const cartCount = cartItems.length || 0;
  const totalAmount = cartItems
    .reduce((sum: number, item: any) => sum + item.price, 0)
    .toFixed(2);

  const handleRemoveAll = () => {
    dispatch(clearCart());
  };

  if (cartCount === 0) {
    return null;
  }

  return (
    <section className="cart-ribbon position-sticky bottom-0 d-none d-lg-flex justify-content-end align-items-center w-100">
      <div className="selected-lottery d-flex align-items-center gap-3">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_40000183_12488"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_40000183_12488)">
            <path
              d="M12.0008 16.3077C12.1426 16.3077 12.2612 16.2597 12.3567 16.1637C12.4522 16.0677 12.5 15.9488 12.5 15.807C12.5 15.6652 12.452 15.5465 12.356 15.451C12.26 15.3555 12.1411 15.3077 11.9993 15.3077C11.8574 15.3077 11.7388 15.3558 11.6433 15.4518C11.5478 15.5476 11.5 15.6664 11.5 15.8082C11.5 15.9502 11.548 16.069 11.644 16.1645C11.74 16.26 11.8589 16.3077 12.0008 16.3077ZM12.0008 12.5C12.1426 12.5 12.2612 12.452 12.3567 12.356C12.4522 12.26 12.5 12.1411 12.5 11.9992C12.5 11.8574 12.452 11.7388 12.356 11.6433C12.26 11.5478 12.1411 11.5 11.9993 11.5C11.8574 11.5 11.7388 11.548 11.6433 11.644C11.5478 11.74 11.5 11.8589 11.5 12.0008C11.5 12.1426 11.548 12.2613 11.644 12.3568C11.74 12.4523 11.8589 12.5 12.0008 12.5ZM12.0008 8.69225C12.1426 8.69225 12.2612 8.64425 12.3567 8.54825C12.4522 8.45242 12.5 8.33358 12.5 8.19175C12.5 8.04975 12.452 7.931 12.356 7.8355C12.26 7.74 12.1411 7.69225 11.9993 7.69225C11.8574 7.69225 11.7388 7.74025 11.6433 7.83625C11.5478 7.93225 11.5 8.05117 11.5 8.193C11.5 8.33483 11.548 8.4535 11.644 8.549C11.74 8.6445 11.8589 8.69225 12.0008 8.69225ZM19.3845 19H4.6155C4.17117 19 3.79083 18.8418 3.4745 18.5255C3.15817 18.2092 3 17.8288 3 17.3845V14.8077C3.5885 14.5897 4.06892 14.2273 4.44125 13.7203C4.81375 13.2131 5 12.6397 5 12C5 11.3603 4.81375 10.7869 4.44125 10.2798C4.06892 9.77275 3.5885 9.41025 3 9.19225V6.6155C3 6.17117 3.15817 5.79083 3.4745 5.4745C3.79083 5.15817 4.17117 5 4.6155 5H19.3845C19.8288 5 20.2092 5.15817 20.5255 5.4745C20.8418 5.79083 21 6.17117 21 6.6155V9.19225C20.4115 9.41025 19.9311 9.77275 19.5588 10.2798C19.1863 10.7869 19 11.3603 19 12C19 12.6397 19.1863 13.2131 19.5588 13.7203C19.9311 14.2273 20.4115 14.5897 21 14.8077V17.3845C21 17.8288 20.8418 18.2092 20.5255 18.5255C20.2092 18.8418 19.8288 19 19.3845 19Z"
              fill="currentColor"
            />
          </g>
        </svg>
        <p>Selected Tickets</p>
        <p className="count">{cartCount}</p>
      </div>

      <div className="total-amount d-flex align-items-center gap-3">
        <p>Total Amount:</p>
        <p className="amount">₹{totalAmount}</p>
      </div>

      <div className="cart-ribbon-actions d-flex align-items-center gap-3">
        <Button className="cart-remove-btn cta-btn" onClick={handleRemoveAll}>
          Remove all
        </Button>
        <Button
          className="cart-buy-btn cta-btn"
          onClick={() => navigate("/cart")}
        >
          Proceed to Buy
        </Button>
      </div>
    </section>
  );
};

export default CartRibbon;
