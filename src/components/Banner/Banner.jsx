import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Modal,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import Carousel from "./Carousel";
import styled from "@emotion/styled";
import BackHero from "../../assets/banner3.png";

const BannerContainer = styled("div")({
  backgroundImage: `url(${BackHero})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "500px",
  display: "flex",
  flexDirection: "column",
  paddingTop: "25px",
  justifyContent: "space-between",
  color: "white",
});

const BannerContent = styled(Container)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const Header = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
});

const Tagline = styled("div")({
  display: "flex",
  height: "40%",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  paddingBottom: "0",
});

const CarouselContainer = styled("div")({
  height: "50%",
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  paddingTop: "0",
});

const ModalContainer = styled(Box)({
  position: "fixed",
  top: "0",
  right: "0",
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

const WatchListContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  marginTop: "20px",
});

const CoinCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  height: "100%",
  backgroundColor: "black",
  color: "white",
});

const CoinCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

function Banner() {
  const [open, setOpen] = useState(false);
  const [watchList, setWatchList] = useState([]);

  useEffect(() => {
    const storedWatchList = JSON.parse(localStorage.getItem("watchList"));
    if (storedWatchList) {
      setWatchList(storedWatchList);
    } else {
      fetchCoins();
    }
  }, []);

  const fetchCoins = () => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1"
    )
      .then((response) => response.json())
      .then((data) => {
        const coins = data.map((coin) => ({
          name: coin.name,
          image: coin.image,
          priceChangePercentage: coin.price_change_percentage_24h,
        }));
        setWatchList(coins);
        localStorage.setItem("watchList", JSON.stringify(coins));
      })
      .catch((error) => console.error("Error fetching coin data:", error));
  };

  const handleOpen = () => {
    setOpen(true);
    localStorage.setItem("modalOpen", true);
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.removeItem("modalOpen");
  };

  const handleRemove = (coinName) => {
    const updatedWatchList = watchList.filter((coin) => coin.name !== coinName);
    setWatchList(updatedWatchList);
    localStorage.setItem("watchList", JSON.stringify(updatedWatchList));
  };

  return (
    <BannerContainer>
      <Header>
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
            fontFamily: "Montserrat",
            color: "#87CEEB",
            margin: "0 auto",
            fontSize: "45px",
          }}
        >
          CRYPTOFOLIO WATCH LIST
        </Typography>
        {/* <Button
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#87CEEB",
            fontFamily: "Montserrat",
            position: "absolute",
            color: "black",
            top: "10px",
            right: "50px",
          }}
          onClick={handleOpen}
        >
          Watch List
        </Button> */}
      </Header>
      <BannerContent>
        <Tagline>
          <Typography
            variant="h2"
            style={{
              fontWeight: "bold",
              marginBottom: 15,
              fontFamily: "Montserrat",
              color: "#87CEEB",
            }}
          ></Typography>
          <Typography
            variant="subtitle2"
            style={{
              color: "darkgrey",
              textTransform: "capitalize",
              fontFamily: "Montserrat",
              marginBottom: 20,
            }}
          >
            Track and manage your cryptocurrency portfolio.
          </Typography>
        </Tagline>
        <CarouselContainer>
          <Carousel />
        </CarouselContainer>
      </BannerContent>
      <Modal open={open} onClose={handleClose}>
        <ModalContainer>
          <Typography
            variant="h6"
            style={{
              // fontWeight: "bold",
              marginBottom: 15,
              fontSize: "37px",
              fontFamily: "Montserrat",
              color: "white",
              textAlign: "center",
            }}
          >
            Watch List
          </Typography>
          <WatchListContainer>
            <Grid container spacing={2}>
              {watchList.slice(-4).map((coin, index) => (
                <Grid item xs={6} key={index}>
                  <CoinCard>
                    <CoinCardContent>
                      <Box display="flex" alignItems="center">
                        <CardMedia
                          component="img"
                          image={coin.image}
                          alt={coin.name}
                          style={{ width: 50, height: 50, marginRight: 10 }}
                        />
                        <Box>
                          <Typography variant="h6">{coin.name}</Typography>
                          <Typography variant="body2" color="white">
                            {coin.priceChangePercentage.toFixed(2)}%
                          </Typography>
                        </Box>
                      </Box>
                    </CoinCardContent>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemove(coin.name)}
                      style={{ backgroundColor: "red", marginTop: "10px" }}
                    >
                      Remove
                    </Button>
                  </CoinCard>
                </Grid>
              ))}
            </Grid>
          </WatchListContainer>
        </ModalContainer>
      </Modal>
    </BannerContainer>
  );
}

export default Banner;
