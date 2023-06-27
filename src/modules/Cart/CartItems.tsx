import {
  Box,
  Button,
  ButtonBase,
  Grid,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import { CartItemType } from "../../pages/ComboPage";

type Props = {
  item: CartItemType;
  addToCart: (clickedItem: CartItemType) => void;
  removeFromCart: (id: number) => void;
};

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

const CartItem = ({ item, addToCart, removeFromCart }: Props) => {
  return (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        mb: 2,
        maxWidth: 500,
        flexGrow: 1,
        backgroundColor: "#081d3a",
        color: "#fff",
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Img alt="complex" src={item.image} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {item.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {item.description}
              </Typography>
              <Box sx= {{display: 'flex', justifyContent: 'space-between'}}>
                <Button
                  size="small"
                  disableElevation
                  variant="contained"
                  onClick={() => removeFromCart(item.id)}
                >
                  -
                </Button>
                <Typography variant="body2">{item.amount}</Typography>
                <Button
                  size="small"
                  disableElevation
                  variant="contained"
                  onClick={() => addToCart(item)}
                >
                  +
                </Button>
              </Box>
            </Grid>
            <Grid item>
              <Typography sx={{ cursor: "pointer" }} variant="body2">
                Total: {(item.amount * item.price).toFixed(2)} VND
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: "#69ec69" }}
            >
              {item.price}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CartItem;
