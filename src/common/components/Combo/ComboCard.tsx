import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Box, LinearProgress, Typography } from "@mui/material";

export default function ComboCard() {
  return (
    <Card
      sx={{
        width: "260px",
        height: "350px",
        backgroundColor: "#272d40",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        component="img"
        height="194"
        image="https://avianreport.com/wp-content/uploads/2020/07/mosaic_optimized2.jpg"
        alt="Paella dish"
      />
      <Box
        sx={{
          width: "200px",
          height: "auto",
          border: 3,
          borderColor: "#fff",
          borderRadius: 3,
          backgroundColor: "#282d3e",
          color: "#fff",
          m: "auto",
          position: "relative",
          transform: "translateY(-50%)",
        }}
      >
        <Typography gutterBottom variant="body1" component="div">
          Backyard Bird Seed
        </Typography>
      </Box>
      <CardContent sx={{ color: "#fff", textAlign: "left", p: 2, pt: 0 }}>
        <Typography variant="body2">
          Here is your comprehensive guide to the different types of bird seed
          you can use at your feeders.
        </Typography>
      </CardContent>
      <Box sx={{ width: "90%", pl: 2, pr: 2 }}>
        <Typography variant="body2" sx={{ color: "#fff", textAlign: "left" }}>
          Ordered quantity: 20/100
        </Typography>
        <LinearProgress variant="determinate" value={20} />
      </Box>
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bottom: 0,
        }}
      >
        <IconButton aria-label="add to favorites" sx={{ color: "#fff" }}>
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share" sx={{ color: "#fff" }}>
          <AddShoppingCartIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
