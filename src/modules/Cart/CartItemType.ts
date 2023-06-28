import { Combo } from "../Combo/models";
import { Product } from "../Product/models";

export type CartItemType = {
  product?: Product;
  productQuantity?: number;
  combo?: Combo;
  comboQuantity?: number;
};