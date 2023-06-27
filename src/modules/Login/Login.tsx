import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Copyright from "../../common/components/Copyright";
import AppRoutes from "../../router/AppRoutes";
import { Navigate, useNavigate } from "react-router-dom";
import authApi from "./apis/authApi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { login } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { fetchUserProfile } from "../../redux/slices/profileSlice";

const loginSchema = object({
  email: string().nonempty("Email is required").email("Email is invalid"),
  password: string()
    .nonempty("Password is required")
    .min(6, "Password must be more than 8 characters")
    .max(100, "Password must be less than 32 characters"),
});

type logininput = TypeOf<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const routeChange = (path: string) => {
    navigate(path, { replace: true });
  };
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm<logininput>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<logininput> = (values) => {
    authApi
          .login({
            email: values.email.trim().toLowerCase(),
            password: values.password,
          })
          .then((response) => {
            dispatch(login(response.data.accessToken));
            dispatch(fetchUserProfile());
            navigate(AppRoutes.home);
            toast.success("Đăng nhập thành công");
          })
          .catch(() => {
            toast.error("Email hoặc mật khẩu không chính xác.");
          });
    console.log(values);
  };
  console.log(errors);
  if (auth.isAuthenticated) return <Navigate to={AppRoutes.home} />;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: "2rem", color: "#000", fontWeight: 700 }}
        >
          Log in
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            error={!!errors["email"]}
            helperText={errors["email"] ? errors["email"].message : ""}
            {...register("email")}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={!!errors["password"]}
            helperText={errors["password"] ? errors["password"].message : ""}
            {...register("password")}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            sx={{
              justifyContent: "flex-start",
              display: "flex",
              color: "#000",
              fontWeight: 700,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log in
          </Button>
          <Grid container>
            <Grid
              item
              xs
              sx={{
                justifyContent: "flex-start",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link variant="body2" sx={{ m: 2 , cursor: "pointer"}} onClick={() => routeChange(AppRoutes.register)}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ m: 5 }} />
    </>
  );
}
