import { useEffect, useState } from "react";
import {
  AppBar,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  Button,
  Modal,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import styled from "@emotion/styled";

// styled API bilan stil yaratish
const Title = styled(Typography)({
  flex: 1,
  color: "#87CEEB",
  fontFamily: "Montserrat",
  fontWeight: "bold",
  cursor: "pointer",
});

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    mode: "dark",
  },
});

const ModalContainer = styled(Box)({
  position: "fixed",
  top: 0,
  right: 0,
  width: "30%",
  height: "100%",
  backgroundColor: "#515151",
  color: "white",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
});

const CoinCard = styled(Card)({
  backgroundColor: "black",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  boxSizing: "border-box",
  height: "250px", // Adjust the height as needed
  paddingBottom: "20px", // Ensure consistent padding bottom
});

const RemoveButton = styled(Button)({
  backgroundColor: "red",
  color: "white",
  marginTop: "10px",
});

function Header() {
  const { currency, setCurrency, reload } = CryptoState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  console.log(data);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const card = JSON.parse(localStorage.getItem("card")) || [];
    if (card) {
      setData(card);
    }
  }, [reload]);

  const handelRemove = (id) => {
    const card = JSON.parse(localStorage.getItem("card"));

    if (card) {
      const cardUpdate = card?.filter((el) => el?.id !== id);
      localStorage.setItem("card", JSON.stringify(cardUpdate));
      setData(cardUpdate);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Title onClick={() => navigate(`/`)} variant="h6">
              Crypto Hunter
            </Title>
            <Select
              variant="outlined"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currency}
              style={{ width: 100, height: 40, marginLeft: 15 }}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"INR"}>INR</MenuItem>
              <MenuItem value={"EUR"}>EUR</MenuItem>
            </Select>
            <Button
              variant="contained"
              color="primary"
              style={{
                backgroundColor: "#87CEEB",
                fontFamily: "Montserrat",
                color: "black",
                marginLeft: "15px",
              }}
              onClick={handleOpen}
            >
              Watch List
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Modal open={open} onClose={handleClose}>
        <ModalContainer>
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              marginBottom: 15,
              fontSize: "24px",
              fontFamily: "Montserrat",
              textAlign: "center",
            }}
          >
            Watch List
          </Typography>
          <Grid container spacing={2}>
            {data?.map((el, i) => (
              <Grid item xs={6} key={i}>
                <CoinCard>
                  <CardMedia
                    component="img"
                    image={el?.image?.large}
                    alt={el?.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">
                      {el?.market_data?.current_price.usd}
                    </Typography>
                  </CardContent>
                  <RemoveButton
                    variant="contained"
                    onClick={() => handelRemove(el?.id)}
                  >
                    Remove
                  </RemoveButton>
                </CoinCard>
              </Grid>
            ))}
          </Grid>
        </ModalContainer>
      </Modal>
    </ThemeProvider>
  );
}

export default Header;
