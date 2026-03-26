export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  // Shipping price (If > ₹500 -> free, else ₹50)
  state.shippingPrice = addDecimals(state.itemsPrice > 500 ? 0 : 50);
  // Tax price (18% GST)
  state.taxPrice = addDecimals(Number((0.18 * state.itemsPrice).toFixed(2)));
  // Total
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem('cart', JSON.stringify(state));
  return state;
};
