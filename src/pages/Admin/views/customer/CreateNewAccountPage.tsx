import {
  Avatar,
  Box,
  Button,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useForm, SubmitHandler } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppRoutes from "../../../../router/AppRoutes";
import { Copyright } from "@mui/icons-material";
import authApi from "../../../../modules/Login/apis/authApi";

const registerSchema = object({
  fullname: string()
    .nonempty("Name is required")
    .max(32, "Name must be less than 100 characters"),
  email: string().nonempty("Email is required").email("Email is invalid"),
  phoneNum: string()
    .nonempty("Phone is required")
    .min(10, "Phone have to 10 digits"),
  address: string().nonempty("Address is required"),
  password: string()
    .nonempty("Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
  confirmPassword: string().nonempty("Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

type registerinput = TypeOf<typeof registerSchema>;

const CreateNewAccountPage = () => {
  const navigate = useNavigate();

  const routeChange = (path: string) => {
    navigate(path, { replace: true });
  };
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm<registerinput>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<registerinput> = (values) => {
    authApi
      .register(values)
      .then(() => {
        toast.success("Create New Account Successfully");
        navigate(AppRoutes.customers, { replace: true });
      })
      .catch((errors) => {
        console.log(errors);
        toast.error(errors?.response?.data);
      });
  };
  console.log(errors);

  return (
    <Box
      sx={{
        maxWidth: "30rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        m: "auto",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <AppRegistrationIcon />
      </Avatar>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: "2rem", color: "#000", fontWeight: 700 }}
      >
        Create New Account
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <TextField
          sx={{ mb: 2 }}
          label="Full Name"
          fullWidth
          required
          error={!!errors["fullname"]}
          helperText={errors["fullname"] ? errors["fullname"].message : ""}
          {...register("fullname")}
        />
        <TextField
          sx={{ mb: 2 }}
          label="Email"
          fullWidth
          required
          type="email"
          error={!!errors["email"]}
          helperText={errors["email"] ? errors["email"].message : ""}
          {...register("email")}
        />
        <TextField
          sx={{ mb: 2 }}
          label="Phone Number"
          fullWidth
          required
          error={!!errors["phoneNum"]}
          helperText={errors["phoneNum"] ? errors["phoneNum"].message : ""}
          {...register("phoneNum")}
        />
        <TextField
          sx={{ mb: 2 }}
          label="Address"
          fullWidth
          required
          type="address"
          error={!!errors["address"]}
          helperText={errors["address"] ? errors["address"].message : ""}
          {...register("address")}
        />
        <TextField
          sx={{ mb: 2 }}
          label="Password"
          fullWidth
          required
          type="password"
          error={!!errors["password"]}
          helperText={errors["password"] ? errors["password"].message : ""}
          {...register("password")}
        />
        <TextField
          sx={{ mb: 2 }}
          label="Confirm Password"
          fullWidth
          required
          type="password"
          error={!!errors["confirmPassword"]}
          helperText={
            errors["confirmPassword"] ? errors["confirmPassword"].message : ""
          }
          {...register("confirmPassword")}
        />

        <Button
          variant="contained"
          fullWidth
          type="submit"
          sx={{ py: "0.8rem", mt: "1rem" }}
        >
          Create
        </Button>
      </Box>
      <Link
        variant="body2"
        sx={{ m: 2, cursor: "pointer" }}
        onClick={() => routeChange(AppRoutes.dashboard)}
      >
        Back to Dashboard
      </Link>
      <Copyright sx={{ m: 2 }} />
    </Box>
  );
};

export default CreateNewAccountPage;
