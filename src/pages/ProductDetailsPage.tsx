import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../router/AppRoutes";
import StarIcon from "@mui/icons-material/Star";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useEffect, useState } from "react";
import { Product } from "../modules/Product/models";
import productApi from "../modules/Product/apis/productApi";
import { useAppSelector } from "../redux/hooks";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { CartItemType } from "../modules/Cart/CartItemType";
import {
  addToCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { AddShoppingCart } from "@mui/icons-material";
import { Cart } from "../modules/Cart";
import { Feedback } from "../modules/Feedback/models";
import feedbackApi from "../modules/Feedback/apis/feedbackApi";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";

const StyledButton = styled(IconButton)`
  position: fixed;
  z-index: 9999;
  right: 20px;
  background-color: #fff;
  color: #000;
  border-radius: 20px;
  width: 45px;
  height: 30px;
  top: 100px;
`;

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product>();
  const user = useAppSelector((state) => state.profile.user.data);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [cartOpen, setCartOpen] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);

  const fetchFeedbackData = () => {
    if (product) {
      feedbackApi
        .fetch(product?.id, 0)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          console.log(response.data);
          setFeedbackData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching feedback:", error);
        });
    }
  };

  const submitFeedback = () => {
    if (product) {
      const formData = {
        itemId: product.id,
        itemType: 0,
        content: feedback,
      };
      if (feedback) {
        feedbackApi
          .send(formData)
          .then(() => {
            toast.success("Comment Successfully");
            fetchFeedbackData();
          })
          .catch((error) => {
            toast.error(error?.response?.data);
            console.error("Error submitting feedback:", error);
          });
      }
    }
  };

  const fetchProductDetails = () => {
    if (typeof id === "string") {
      const productId = parseInt(id, 10);
      productApi
        .getDetails(productId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          const product = response.data;
          setProduct(product);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const getTotalItems = (items: CartItemType[]): number => {
    return items.reduce(
      (total: number, item: CartItemType) =>
        total + (item.productQuantity ?? 0) + (item.comboQuantity ?? 0),
      0
    );
  };
  const handleAddToCart = (item: Product) => {
    const existingCartItem = cartItems.find(
      (cartItem) => cartItem.product?.id === item.id
    );

    if (existingCartItem) {
      const updatedQuantity = (existingCartItem.productQuantity ?? 0) + 1;
      dispatch(
        updateCartItemQuantity({
          item: existingCartItem,
          quantity: updatedQuantity,
          isProduct: true,
        })
      );
    } else {
      dispatch(addToCart({ product: item, productQuantity: 1 }));
    }
  };

  const handleUpdateQuantity = (
    item: CartItemType,
    quantity: number,
    isProduct: boolean
  ) => {
    const updatedItem: {
      item: CartItemType;
      quantity: number;
      isProduct: boolean;
    } = {
      item,
      quantity,
      isProduct,
    };

    dispatch(updateCartItemQuantity(updatedItem));
  };
  const handleRemoveItem = (item: CartItemType) => {
    dispatch(removeCartItem(item));
  };

  useEffect(() => {
    fetchFeedbackData();
  }, [feedback, product]);

  return (
    <>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          removeCartItem={handleRemoveItem}
          updateCartItemQuantity={handleUpdateQuantity}
        />
      </Drawer>
      {user.role == "Customer" && (
        <StyledButton onClick={() => setCartOpen(true)}>
          <Badge badgeContent={getTotalItems(cartItems)} color="error">
            <AddShoppingCart />
          </Badge>
        </StyledButton>
      )}
      <Stack display={"flex"} flexDirection={"column"}>
        <Stack display={"flex"} flexDirection={"row"}>
          <Box
            component="img"
            sx={{
              height: 253,
              width: 370,
              p: 3,
            }}
            alt="The house from the offer."
            src={product?.imgUrl}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "#000", fontWeight: 700, textAlign: "left", mt: 2 }}
            >
              {product?.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                color: "orange",
              }}
            >
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
            </Box>
            <Box
              sx={{
                color: "#000",
                maxWidth: "60rem",
                m: 2,
                ml: 0,
                textAlign: "left",
              }}
            >
              <Typography variant="body2">
                <strong>Description:</strong> {product?.description}
              </Typography>
              <Typography variant="body2">
                <strong>Unit In Stock:</strong> {product?.unitInStock}
              </Typography>
              <Typography variant="body2">
                <strong>Expired Date: </strong>
                {product?.expiredDate &&
                  new Date(product.expiredDate).toLocaleDateString("vi-VN")  || "N/A"}
              </Typography>
              <Typography variant="h6">
                Price:{" "}
                {product?.price?.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
            </Box>
            {user.role == "Customer" && (
              <Stack direction="row" spacing={2} sx={{ m: 2, ml: 0 }}>
                <Button variant="outlined" startIcon={<FavoriteIcon />}>
                  Wishlist
                </Button>
                <Button
                  variant="contained"
                  endIcon={<AddShoppingCartIcon />}
                  onClick={() => product && handleAddToCart(product)}
                >
                  Add To Cart
                </Button>
              </Stack>
            )}
            {user.role == "Staff" && (
              <Stack direction="row" spacing={2} sx={{ m: 2, ml: 0 }}>
                <Button
                  variant="outlined"
                  startIcon={<DeleteForeverIcon />}
                  color="error"
                >
                  Delete
                </Button>
                <Link to={`/editProduct/${id}`}>
                  <Button variant="contained" endIcon={<EditIcon />} sx={{backgroundColor: 'lightseagreen'}}>
                    Edit
                  </Button>
                </Link>
              </Stack>
            )}
            {!user.role && (
              <Stack direction="row" spacing={2} sx={{ m: 2, ml: 0 }}>
                <Button variant="outlined" startIcon={<FavoriteIcon />}>
                  Wishlist
                </Button>
                <Button
                  variant="contained"
                  endIcon={<AddShoppingCartIcon />}
                  onClick={() => navigate(AppRoutes.login, { replace: true })}
                >
                  Add To Cart
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              p: 1,
              pl: 3,
              color: "#363636",
              textDecoration: "underline",
              textAlign: "left",
            }}
          >
            Feedbacks
          </Typography>
          <Paper
            sx={{
              height: 70,
              m: "auto",
              mt: 2,
              display: "flex",
              alignItems: "center",
              width: "90%",
            }}
          >
            <Avatar
              alt="User Avatar"
              src="/static/images/avatar/1.jpg"
              sx={{ ml: 2 }}
            />
            <TextField
              label="Add your feedback here"
              variant="outlined"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ flex: 1, ml: 2, mr: 2 }}
            />
            <Button
              variant="contained"
              onClick={submitFeedback}
              startIcon={<SendIcon />}
              sx={{mr: 2}}
            >
              Send
            </Button>
          </Paper>
          {feedbackData.map((feedbackItem) => (
            <Paper
              key={feedbackItem.id}
              sx={{ width: "90%", m: "auto", mt: 4 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Avatar alt="User Avatar" sx={{ ml: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    ml: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "20px", fontWeight: 700, color: "#363636" }}
                  >
                    {feedbackItem?.customer?.email}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        border: 1,
                        borderColor: "orange",
                        minWidth: "80px",
                        borderRadius: 1,
                        height: "18px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "orange",
                        }}
                      >
                        customer
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        border: 1,
                        borderColor: "#ccc",
                        minWidth: "80px",
                        borderRadius: 1,
                        height: "18px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        ml: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#ccc",
                        }}
                      >
                        {feedbackItem?.createdDate &&
                          new Date(feedbackItem.createdDate).toLocaleTimeString(
                            "vi-VN"
                          )}
                        &nbsp;
                        {feedbackItem?.createdDate &&
                          new Date(feedbackItem.createdDate).toLocaleDateString(
                            "vi-VN"
                          )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#363636",
                  p: 2,
                  textAlign: "left",
                }}
              >
                {feedbackItem?.content}
              </Typography>
              <Box
                sx={{
                  borderTop: 1,
                  borderTopColor: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Box
                  sx={{
                    fontWeight: 700,
                    color: "#363636",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1.5,
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: "15px" }} />

                  <Typography
                    variant="body2"
                    sx={{ fontSize: "10px", ml: "5px" }}
                  >
                    Yêu thích
                  </Typography>
                </Box>
                <Box
                  sx={{
                    fontWeight: 700,
                    color: "#363636",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1.5,
                  }}
                >
                  <ChatBubbleIcon sx={{ fontSize: "15px" }} />

                  <Typography
                    variant="body2"
                    sx={{ fontSize: "10px", ml: "5px" }}
                  >
                    Reply
                  </Typography>
                </Box>
                <Box
                  sx={{
                    fontWeight: 700,
                    color: "#363636",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1.5,
                  }}
                >
                  <ReportProblemIcon sx={{ fontSize: "15px" }} />

                  <Typography
                    variant="body2"
                    sx={{ fontSize: "10px", ml: "5px" }}
                  >
                    Báo cáo
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Stack>
    </>
  );
}
