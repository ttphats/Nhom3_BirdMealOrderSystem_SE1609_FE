export interface CreateComboForm {
  form: {
    Name: string;
    Status: number;
    Description: string;
    ComboProducts: {
        productId: number;
        quantity: number;
    }[];
    BirdSpecies: {
        id: number;
    }[];
  };
  imageFile: File | null;
}
