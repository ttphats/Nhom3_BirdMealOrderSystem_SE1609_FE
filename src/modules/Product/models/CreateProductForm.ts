export interface CreateProductForm {
  form: {
    Name: string;
    Description: string;
    UnitInStock: number;
    Price: number;
    ExpiredDate: Date | null | undefined;
    Status: number;
  };
  imageFile: File | null;
}
