import { CircularProgress, Typography } from "@mui/material"; // CircularProgress komponentini import qilamiz
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { numberWithCommas } from "../components/CoinsTable";
import { CryptoState } from "../CryptoContext";
import styled from "@emotion/styled";

const Container = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  padding: "20px",
  flexWrap: "wrap",
});

const Sidebar = styled("div")({
  width: "30%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "25px",
  borderRight: "2px solid grey",
  "@media (max-width: 960px)": {
    width: "100%",
    borderRight: "none",
    borderBottom: "2px solid grey",
  },
});

const Heading = styled(Typography)({
  fontWeight: "bold",
  marginBottom: "20px",
  fontFamily: "Montserrat",
  color: "#fff",
});

const Description = styled(Typography)({
  width: "100%",
  fontFamily: "Montserrat",
  padding: "25px",
  paddingBottom: "15px",
  paddingTop: "0",
  textAlign: "justify",
});

const MarketData = styled("div")({
  alignSelf: "start",
  padding: "25px",
  paddingTop: "10px",
  width: "100%",
  "@media (max-width: 960px)": {
    display: "flex",
    justifyContent: "space-around",
  },
  "@media (max-width: 600px)": {
    flexDirection: "column",
    alignItems: "center",
  },
  "@media (max-width: 400px)": {
    alignItems: "start",
  },
});

const CoinInfoContainer = styled("div")({
  width: "70%",
  "@media (max-width: 960px)": {
    width: "100%",
  },
});

const LoaderContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100%",
});

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol } = CryptoState();

  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
    } catch (error) {
      console.error("Error fetching coin data:", error);
    }
  };

  useEffect(() => {
    fetchCoin();
  }, [currency]);

  if (!coin)
    return (
      <LoaderContainer>
        <CircularProgress style={{ color: "blue" }} />
      </LoaderContainer>
    ); // CircularProgress komponentini markazlash

  return (
    <Container>
      <Sidebar>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Heading variant="h3">{coin?.name}</Heading>
        <Description variant="subtitle1">
          {coin?.description.en.split(". ")[0]}.
        </Description>
        <MarketData>
          <span style={{ display: "flex" }}>
            <Heading variant="h5">Rank:</Heading>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Heading variant="h5">Current Price:</Heading>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Heading variant="h5">Market Cap:</Heading>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>
        </MarketData>
      </Sidebar>
      <CoinInfoContainer>
        <CoinInfo coin={coin} />
      </CoinInfoContainer>
    </Container>
  );
};

export default CoinPage;
