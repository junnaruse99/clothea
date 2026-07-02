"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "clothea_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // carrito corrupto: se ignora
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal =
      Math.round(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 100) /
      100;
    return {
      items,
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotal,
      addItem: (item) =>
        setItems((prev) => {
          const existing = prev.find(
            (i) => i.productId === item.productId && i.size === item.size
          );
          if (existing) {
            return prev.map((i) =>
              i === existing
                ? {
                    ...i,
                    quantity: Math.min(i.quantity + item.quantity, i.maxQuantity),
                  }
                : i
            );
          }
          return [...prev, item];
        }),
      updateQuantity: (productId, size, quantity) =>
        setItems((prev) =>
          prev
            .map((i) =>
              i.productId === productId && i.size === size
                ? { ...i, quantity: Math.min(Math.max(1, quantity), i.maxQuantity) }
                : i
            )
            .filter((i) => i.quantity > 0)
        ),
      removeItem: (productId, size) =>
        setItems((prev) =>
          prev.filter((i) => !(i.productId === productId && i.size === size))
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
