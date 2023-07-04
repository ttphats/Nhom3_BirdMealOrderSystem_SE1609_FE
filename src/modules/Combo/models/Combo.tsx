import { Product } from "../../Product/models/Product";
import { BirdSpecies } from "./BirdSpecies";

export type Combo = {
  id: number;
  name: string;
  description: string;
  createdById: number;
  createdDate: string;
  updatedById: number;
  updatedDate: string;
  price: number;
  imgUrl: string;
  status: boolean;
  products: Product[];
  birdSpecies: BirdSpecies[];
};
