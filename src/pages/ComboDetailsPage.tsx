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
import { BirdSpecies, Combo } from "../modules/Combo/models";
import { useEffect, useState } from "react";
import comboApi from "../modules/Combo/apis/comboApi";
import { Product } from "../modules/Product/models";
import { AddShoppingCart } from "@mui/icons-material";
import { useAppSelector } from "../redux/hooks";
import { CartItemType } from "../modules/Cart/CartItemType";
import { Cart } from "../modules/Cart";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  addToCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../redux/slices/cartSlice";
import feedbackApi from "../modules/Feedback/apis/feedbackApi";
import { Feedback } from "../modules/Feedback/models";
import { toast } from "react-toastify";
import SendIcon from "@mui/icons-material/Send";
import DifferenceIcon from "@mui/icons-material/Difference";

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

const ComboDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [combo, setCombo] = useState<Combo>();
  const user = useAppSelector((state) => state.profile.user.data);
  const [cartOpen, setCartOpen] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState("");
  const [reply, setReply] = useState("");
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [isShowReply, setIsShowReply] = useState(false);

  const fetchFeedbackData = () => {
    if (combo) {
      feedbackApi
        .fetch(combo?.id, 1)
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
    if (combo) {
      const formData = {
        itemId: combo.id,
        itemType: 1,
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

  const submitReply = (feedbackId: number) => {
    if (combo) {
      const formData = {
        replyContent: reply,
      };
      if (reply) {
        feedbackApi
          .reply(feedbackId, formData)
          .then(() => {
            toast.success("Reply Successfully");
            fetchFeedbackData();
          })
          .catch((error) => {
            toast.error(error?.response?.data);
            console.error("Error submitting feedback:", error);
          });
      }
    }
  };

  const productNames =
    combo?.products?.map((product: Product) => product.name) ?? [];
  const concatenatedNames = productNames.join(", ");

  const birdName =
    combo?.birdSpecies?.map((bird: BirdSpecies) => bird.name) ?? [];
  const concatenatedNamesBird = birdName.join(", ");

  const fetchComboDetails = () => {
    if (typeof id === "string") {
      const comboId = parseInt(id, 10); // Convert id to number
      comboApi
        .getDetails(comboId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          const combo = response.data;
          setCombo(combo);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleAddToCart = (item: Combo) => {
    const existingCartItemIndex: number = cartItems.findIndex(
      (cartItem) => cartItem.combo?.id === item.id
    );

    if (existingCartItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingCartItemIndex] = {
        ...updatedCartItems[existingCartItemIndex],
        comboQuantity:
          (updatedCartItems[existingCartItemIndex].comboQuantity ?? 0) + 1,
      };
      const quantity =
        updatedCartItems[existingCartItemIndex].comboQuantity || 0; // Handle undefined case
      dispatch(
        updateCartItemQuantity({
          item: updatedCartItems[existingCartItemIndex],
          quantity,
          isProduct: false,
        })
      );
    } else {
      dispatch(addToCart({ combo: item, comboQuantity: 1 }));
    }
  };

  useEffect(() => {
    fetchComboDetails();
  }, []);

  useEffect(() => {
    fetchFeedbackData();
  }, [feedback, combo]);

  const getTotalItems = (items: CartItemType[]): number => {
    return items.reduce(
      (total: number, item: CartItemType) =>
        total + (item.productQuantity ?? 0) + (item.comboQuantity ?? 0),
      0
    );
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
            src={combo?.imgUrl}
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
              {combo?.name}
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
                <strong>Description:</strong> {combo?.description}
              </Typography>
              <Typography variant="body2">
                <strong>Ingredients:</strong> {concatenatedNames}
              </Typography>
              <Typography variant="body2">
                <strong>Suitable for:</strong> {concatenatedNamesBird}
              </Typography>
              <Typography variant="h6">
                Price:{" "}
                {combo?.price.toLocaleString("vi", {
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
                  onClick={() => combo && handleAddToCart(combo)}
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
                <Link to={`/duplicateCombo/${combo?.id}`}>
                  <Button
                    variant="contained"
                    endIcon={<DifferenceIcon />}
                    sx={{ backgroundColor: "lightpink" }}
                  >
                    Duplicate
                  </Button>
                </Link>
                <Link to={`/editCombo/${id}`}>
                  <Button
                    variant="contained"
                    endIcon={<EditIcon />}
                    sx={{ backgroundColor: "lightseagreen" }}
                  >
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
          {user.role == "Customer" && (
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
                sx={{ mr: 2 }}
              >
                Send
              </Button>
            </Paper>
          )}
          {feedbackData.map((feedbackItem) => (
            <>
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
                      sx={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#363636",
                      }}
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
                            new Date(
                              feedbackItem.createdDate
                            ).toLocaleTimeString("vi-VN")}
                          &nbsp;
                          {feedbackItem?.createdDate &&
                            new Date(
                              feedbackItem.createdDate
                            ).toLocaleDateString("vi-VN")}
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
                      "&:hover": {
                        cursor: "pointer",
                        backgroundColor: "#f8f8f8",
                      },
                    }}
                    onClick={() =>
                      isShowReply ? setIsShowReply(false) : setIsShowReply(true)
                    }
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
              {user.role == "Staff" &&
                isShowReply &&
                feedbackItem.replyContent === null && (
                  <Paper
                    sx={{
                      height: 70,
                      m: "auto",
                      mt: 2,
                      display: "flex",
                      alignItems: "center",
                      width: "80%",
                      ml: 12,
                    }}
                  >
                    <Avatar
                      alt="User Avatar"
                      src="/static/images/avatar/1.jpg"
                      sx={{ ml: 2 }}
                    />
                    <TextField
                      label="Add your reply here"
                      variant="outlined"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      sx={{ flex: 1, ml: 2, mr: 2 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => submitReply(feedbackItem.id)}
                      startIcon={<SendIcon />}
                      sx={{ mr: 2 }}
                    >
                      Reply
                    </Button>
                  </Paper>
                )}
              {isShowReply && feedbackItem.replyContent !== null && (
                <Paper
                  key={feedbackItem.id}
                  sx={{ width: "80%", m: "auto", mt: 1, ml: 12 }}
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
                        sx={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#363636",
                        }}
                      >
                        staff@gmail.com
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
                            Staff
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
                            {feedbackItem?.repliedDate &&
                              new Date(
                                feedbackItem.repliedDate
                              ).toLocaleTimeString("vi-VN")}
                            &nbsp;
                            {feedbackItem?.repliedDate &&
                              new Date(
                                feedbackItem.repliedDate
                              ).toLocaleDateString("vi-VN")}
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
                    {feedbackItem?.replyContent}
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
              )}
              {isShowReply &&
                user.role == "Customer" &&
                feedbackItem.replyContent === null && (
                  <Paper
                    key={feedbackItem.id}
                    sx={{ width: "90%", m: "auto", mt: 1}}
                  >
                    <Typography variant="h6" color={"#000"}>
                      Nhân viên chưa phản hồi
                    </Typography>
                  </Paper>
                )}
            </>
          ))}
        </Box>
      </Stack>
    </>
  );
};
export default ComboDetailsPage;
