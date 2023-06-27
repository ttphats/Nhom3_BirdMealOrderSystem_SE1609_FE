import {
  Avatar,
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useForm, SubmitHandler } from "react-hook-form";
import { literal, object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import Copyright from "../../common/components/Copyright";
import AppRoutes from "../../router/AppRoutes";
import { useNavigate } from "react-router-dom";

const registerSchema = object({
  name: string()
    .nonempty("Name is required")
    .max(32, "Name must be less than 100 characters"),
  email: string().nonempty("Email is required").email("Email is invalid"),
  password: string()
    .nonempty("Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirm: string().nonempty("Please confirm your password"),
  terms: literal(true, {
    invalid_type_error: "Accept Terms is required",
  }),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

type registerinput = TypeOf<typeof registerSchema>;

const Register = () => {
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
    console.log(values);
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
        Register
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <TextField
          sx={{ mb: 2 }}
          label="Name"
          fullWidth
          required
          error={!!errors["name"]}
          helperText={errors["name"] ? errors["name"].message : ""}
          {...register("name")}
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
          error={!!errors["passwordConfirm"]}
          helperText={
            errors["passwordConfirm"] ? errors["passwordConfirm"].message : ""
          }
          {...register("passwordConfirm")}
        />

        <FormGroup>
          <FormControlLabel
            control={<Checkbox required />}
            {...register("terms")}
            label={
              <Typography
                color={errors["terms"] ? "error" : "inherit"}
                sx={{ color: "#000" }}
              >
                Accept Terms and Conditions
              </Typography>
            }
          />
          <FormHelperText error={!!errors["terms"]}>
            {errors["terms"] ? errors["terms"].message : ""}
          </FormHelperText>
        </FormGroup>

        <Button
          variant="contained"
          fullWidth
          type="submit"
          sx={{ py: "0.8rem", mt: "1rem" }}
        >
          Register
        </Button>
      </Box>
      <Link variant="body2" sx={{ m: 2 , cursor: "pointer"}} onClick={() => routeChange(AppRoutes.login)}>
        Already have an account? Sign in
      </Link>
      <Copyright sx={{ m: 2 }} />
    </Box>
  );
};

export default Register;
