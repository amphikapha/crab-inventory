import { Product } from "./product";

export interface ProductActionsProps {
  product: Product;
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onBuy: (productId: string, quantity: number) => void;
  onQuantityChange?: (quantity: number) => void;
  isCardView?: boolean;
}
