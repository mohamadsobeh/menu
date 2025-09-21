import React, { useEffect, useRef, useState } from "react";
import { useCheckout } from "../hooks";
import { formatSYPPrice } from "../../../shared/utils";
import { TableSelector } from "./table-selector.component";
import { CouponInput } from "./coupon-input.component";
import { OrderSummaryComponent as OrderSummary } from "./order-summary.component";
import { PlaceOrderButton } from "./place-order-button.component";
import type { PhoneNumberForm } from "../../../shared/types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced?: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderPlaced,
}) => {
  const {
    checkoutState,
    formData,
    setFormData,
    tableOptions,
    selectTable,
    applyCoupon,
    removeCoupon,
    updateOrderSummary,
    prepareOrderRequest,
    resetCheckout,
  } = useCheckout();

  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsVisible(true);
      updateOrderSummary();
    } else {
      setIsVisible(false);
    }
  }, [isOpen, updateOrderSummary]);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handlePlaceOrder = async () => {
    try {
      const orderRequest = prepareOrderRequest();
      console.log("Placing order:", orderRequest);

      const orderId = `ORD-${Date.now()}`;
      onOrderPlaced?.(orderId);

      resetCheckout();
      handleClose();
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  const handlePhoneSubmitted = (phoneData: PhoneNumberForm) => {
    console.log("Phone number submitted:", phoneData);
    resetCheckout();
    handleClose();
  };

  const handlePhoneSkip = () => {
    console.log("Phone collection skipped");
    resetCheckout();
    handleClose();
  };

  // تحديث الكمية (زيادة/نقصان)
  const updateQuantity = (id: string, newQty: number) => {
    const item = checkoutState.orderSummary.items.find((i) => i.id === id);
    if (!item) return;
    item.quantity = Math.max(1, newQty); // لا يقل عن 1
    updateOrderSummary();
  };

  if (!isVisible) return null;

  const transform = isClosing ? "translateY(100%)" : "translateY(0)";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={handleClose}
      />

      {/* Full Page Checkout Modal */}
      <div
        ref={modalRef}
        className="relative w-full h-full bg-white flex flex-col"
        style={{ transform }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button onClick={handleClose} className="p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-800 arabic-text">
            تشيك اوت
          </h1>
          <button
            onClick={resetCheckout}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Order Items */}
        <div className="flex-1 overflow-y-auto bg-white">
          {checkoutState.orderSummary.items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center gap-4 p-4 border-b border-gray-100"
            >
              {/* Product Image */}
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 arabic-text text-sm mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 arabic-text mb-1">
                  {item.selectedAdditions?.map((add) => add.name).join(", ") ||
                    "وصف قصير للمنتج"}
                </p>
                <p className="text-sm font-bold text-gray-800 arabic-text">
                  {formatSYPPrice(item.price_in_syp * item.quantity)}
                </p>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full"
                >
                  −
                </button>
                <span className="text-sm font-semibold text-gray-800 mx-2">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* Add More */}
          <div className="flex items-center justify-center p-4 border-t border-b border-gray-200 text-[#50BF63] cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#50BF63] rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium arabic-text">اضف المزيد</span>
            </div>
          </div>
        </div>

        {/* Table & Coupon Section */}
        <div className="bg-gray-50 p-4 space-y-3">
          <TableSelector
            tableOptions={tableOptions}
            selectedTable={checkoutState.selectedTable}
            onSelectTable={selectTable}
          />

          <CouponInput
            value={formData.couponCode}
            onChange={(code) =>
              setFormData((prev) => ({ ...prev, couponCode: code }))
            }
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={removeCoupon}
            appliedCoupon={checkoutState.appliedCoupon}
            isLoading={checkoutState.isLoading}
            error={checkoutState.error}
          />
        </div>

        {/* Order Summary */}
        <OrderSummary orderSummary={checkoutState.orderSummary} />

        {/* Place Order Button */}
        <PlaceOrderButton
          onPlaceOrder={handlePlaceOrder}
          onPhoneSubmitted={handlePhoneSubmitted}
          onPhoneSkipped={handlePhoneSkip}
          isLoading={checkoutState.isLoading}
          disabled={checkoutState.orderSummary.items.length === 0}
        />
      </div>
    </div>
  );
};
