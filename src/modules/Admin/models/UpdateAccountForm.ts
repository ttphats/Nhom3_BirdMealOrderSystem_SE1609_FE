export interface UpdateAccountForm {
  form: {
    Fullname: string;
    PhoneNum: string;
    Address: string;
    Password: string | "";
    ConfirmPassword: string | "";
    Status: number;
  };
  imageFile: File | null;
}
