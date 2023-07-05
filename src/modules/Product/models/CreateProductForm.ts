export interface CreateProductForm {
  form: {
    Name: string;
    Description: string;
    UnitInStock: number;
    Price: number;
    ExpiredDate: Date;
    Status: number;
  };
  imageFile: File | null;
}
