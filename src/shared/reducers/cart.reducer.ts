import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Storage } from "react-jhipster";

export interface CartItem {
  ticketId: string;
  ticketNumbers: number[];
  slot: number;
  price: number;
  ticketOid?: string; // Optional field for ticket OID
}

interface CartState {
  items: CartItem[];
  showSticker: boolean;
}

const CART_SESSION_KEY = "cart-items";

// Load cart from session storage
const loadCartFromSession = (): CartItem[] => {
  const savedCart = Storage.session.get(CART_SESSION_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
};

// Save cart to session storage
const saveCartToSession = (items: CartItem[]) => {
  Storage.session.set(CART_SESSION_KEY, JSON.stringify(items));
};

const initialState: CartState = {
  items: loadCartFromSession(),
  showSticker: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const ticketAlreadyInCart = state.items.some(
        (item) => item.ticketId === action.payload.ticketId
      );

      if (!ticketAlreadyInCart) {
        state.items.push(action.payload);
        state.showSticker = true;
        saveCartToSession(state.items);
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.ticketId !== action.payload
      );
      saveCartToSession(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCartToSession(state.items);
    },
    hideCartSticker(state) {
      state.showSticker = false;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, hideCartSticker } =
  cartSlice.actions;
export default cartSlice.reducer;
