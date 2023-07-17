import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";

import AppRoutes from "../../router/AppRoutes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { AccountMenu } from ".";
import { logout } from "../../redux/slices/authSlice";
import { remove } from "../../redux/slices/profileSlice";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;

export default function Navbar({ window }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.profile.user.data);
  const [navItems, setNavItems] = useState([
    {
      title: "Combo",
      path: AppRoutes.combo,
    },
    {
      title: "Product",
      path: AppRoutes.product,
    },
  ]);

  console.log(user.role === "Customer");

  useEffect(() => {
    if (auth.isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let updatedNavItems: any[] = [];

      if (user.role === "Staff") {
        updatedNavItems = [
          {
            title: "Manage Combo",
            path: AppRoutes.combo,
          },
          {
            title: "Manage Product",
            path: AppRoutes.product,
          },
          {
            title: "Manage Orders",
            path: AppRoutes.manageOrders,
          },
          {
            title: "My Profile",
            path: AppRoutes.profile,
          },
        ];
      } else if (user.role === "Admin") {
        updatedNavItems = [
          {
            title: "Dashboard",
            path: AppRoutes.dashboard,
          },
          {
            title: "Customer",
            path: AppRoutes.customers,
          },
          {
            title: "Combo",
            path: AppRoutes.combo,
          },
          {
            title: "Product",
            path: AppRoutes.product,
          },
          {
            title: "My Profile",
            path: AppRoutes.profile,
          },
        ];
      } else if (user.role === "Customer") {
        updatedNavItems = [
          {
            title: "Combo",
            path: AppRoutes.combo,
          },
          {
            title: "Product",
            path: AppRoutes.product,
          },
          {
            title: "Orders",
            path: AppRoutes.order,
          },
          {
            title: "My Profile",
            path: AppRoutes.profile,
          },
        ];
      }

      setNavItems(updatedNavItems);
    } else {
      setNavItems([
        {
          title: "Combo",
          path: AppRoutes.combo,
        },
        {
          title: "Product",
          path: AppRoutes.product,
        },
      ]);
    }
  }, [auth.isAuthenticated, user]);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const routeChange = (path: string) => {
    navigate(path, { replace: true });
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        BMOS
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => routeChange(item.path)}
            >
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
        {auth.isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ textAlign: "center" }}
                onClick={() => routeChange(AppRoutes.profile)}
              >
                <ListItemText primary="Tài khoản" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ textAlign: "center" }}
                onClick={() => {
                  dispatch(logout());
                  dispatch(remove());
                }}
              >
                <ListItemText primary="Đăng xuất" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ textAlign: "center" }}
                onClick={() => routeChange(AppRoutes.login)}
              >
                <ListItemText primary="Đăng nhập" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ textAlign: "center" }}
                onClick={() => routeChange(AppRoutes.register)}
              >
                <ListItemText primary="Đăng ký" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  const rootPath = `/${location.pathname.split("/")[1]}`;

  return (
    <Box
      sx={{
        display: "flex",
        height: {
          xs: "56px",
          sm: "4rem",
        },
      }}
    >
      <AppBar component="nav">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#27374D",
          }}
        >
          {/* Mobile icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop logo */}
          <Link
            to={AppRoutes.home}
            underline="none"
            sx={{ display: "flex", alignItems: "center", color: "#fff" }}
            component={RouterLink}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3418/3418582.png"
              alt="BMOS Logo"
              width="48"
              height="48"
            />
            <Typography
              variant="h6"
              component="div"
              display={{ xs: "none", md: "block" }}
            >
              BMOS
            </Typography>
          </Link>

          {/* Desktop navbar */}
          <Box
            sx={{ display: { xs: "none", md: "block", height: "4rem", p: 0 } }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                sx={{
                  color: "#fff",
                  height: "100%",
                  borderBottom: 3,
                  borderBottomColor: "#000",
                  borderRadius: 0,
                  "&:hover": {
                    borderBottom: 3,
                    borderBottomColor: "#fff",
                    borderRadius: 0,
                  },
                  "&:focus": {
                    borderBottom: 3,
                    borderBottomColor: "#fff",
                    borderRadius: 0,
                  },
                  "&.active": {
                    borderBottom: 3,
                    borderBottomColor: "#fff",
                  },
                }}
                className={
                  rootPath !== "/"
                    ? rootPath === `${item.path.toLowerCase()}`
                      ? "active"
                      : ""
                    : item.path === AppRoutes.combo
                    ? "active"
                    : ""
                }
                onClick={() => routeChange(item.path)}
              >
                {item.title}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "space-between",
            }}
          >
            {auth.isAuthenticated ? (
              <Box
                sx={{
                  m: 1,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <AccountMenu />
              </Box>
            ) : (
              <>
                <Box sx={{ m: 1 }}>
                  <Button
                    variant="text"
                    sx={{
                      color: "#fff",
                      "&:hover": {
                        textDecoration: "underline #fff",
                      },
                    }}
                    onClick={() => navigate(AppRoutes.login)}
                  >
                    Đăng Nhập
                  </Button>
                </Box>
                <Box sx={{ m: 1 }}>
                  <Button
                    variant="contained"
                    sx={{
                      background: "#fff",
                      color: "#000",
                      "&:hover": {
                        backgroundColor: "#EEEEEE",
                        textDecoration: "underline #000000",
                      },
                    }}
                    onClick={() => navigate(AppRoutes.register)}
                  >
                    Đăng ký
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile navbar */}
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
