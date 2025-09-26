import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "reactstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/app/config/store";
import { hideCartSticker } from "@shared/reducers/cart.reducer";
import { useNavigate } from "react-router-dom";
import "./cart-sticker.scss";

const CartSticker = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showSticker } = useAppSelector((state) => state.cart);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const TIMER_DURATION = 3000; // 3 seconds

  // Clear existing timers
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Start or restart the timer and progress animation
  const startTimer = useCallback(() => {
    clearTimers();

    // Reset progress to 100%
    setProgress(100);

    // Animate progress bar countdown
    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.max(0, prev - 100 / (TIMER_DURATION / 50));
        return newProgress;
      });
    }, 50);

    // Auto-hide after timer completes
    timerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      clearTimers();
    }, TIMER_DURATION);
  }, [clearTimers]);

  // Handle sticker visibility and timer reset
  useEffect(() => {
    if (showSticker) {
      if (isVisible) {
        // If sticker is already visible, just reset the timer
        startTimer();
      } else {
        // Show sticker and start timer
        setIsVisible(true);
        startTimer();
      }

      // Reset Redux state immediately to allow new additions
      setTimeout(() => {
        dispatch(hideCartSticker());
      }, 100);
    }
  }, [showSticker, dispatch, isVisible, startTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const handleViewCart = () => {
    setIsVisible(false);
    clearTimers();
    navigate("/cart");
  };

  return (
    <div className="cart-sticker-container">
      <AnimatePresence>
        {isVisible && (
          <motion.article
            className="cart-sticker d-flex d-lg-none align-items-center justify-content-between gap-2 position-fixed"
            initial={{ x: -400, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{
              x: -400,
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.3 },
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              duration: 0.5,
            }}
          >
            {/* Glossy progress bar overlay */}
            <div className="cart-sticker__progress-container">
              <motion.div
                className="cart-sticker__progress"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            <p className="message flex-shrink-1 mb-0">
              Ticket has been added to your cart.
            </p>
            <Button
              className="view-cart-btn cta-btn"
              onClick={handleViewCart}
              size="sm"
            >
              View Cart
            </Button>
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartSticker;
