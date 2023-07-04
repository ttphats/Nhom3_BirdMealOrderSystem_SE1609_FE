import { BirdSpecies } from ".";
import { Product } from "../../Product/models";

export type ComboDetails = {
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
