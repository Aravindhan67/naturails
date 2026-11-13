import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('naturalis_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('naturalis_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        showNotification(`Updated quantity of "${product.name}" in your basket!`);
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + qty } : item
        );
      } else {
        showNotification(`Added "${product.name}" to your basket!`);
        return [
          ...prev,
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category,
            volumeOrWeight: product.volumeOrWeight,
            stock: product.stock,
            qty,
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    showNotification('Item removed from basket', 'info');
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, qty: newQty } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = Math.round(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Indian standard: Free shipping above ₹499, otherwise ₹50 delivery charge
  const shipping = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 50;
  // Automatic special discount on orders above ₹1499
  const discount = subtotal >= 1499 ? 100 : 0;
  const totalPrice = Math.max(0, subtotal + shipping - discount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        shipping,
        discount,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        notification,
        dismissNotification: () => setNotification(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
