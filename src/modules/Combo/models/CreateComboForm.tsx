export interface CreateComboForm {
  form: {
    Name: string;
    Status: number;
    ComboProducts: {
        productId: number;
        quantity: number;
    }[];
    BirdSpecies: {
        id: number;
    }[];
  };
  imageFile: File;
}
