export interface CreateProductForm {
  form: {
    Name: string;
    UnitInStock: number;
    Price: number;
    ExpiredDate: string;
    Status: number;
  };
  imageFile: File;
}
