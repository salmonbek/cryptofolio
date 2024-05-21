import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api";
import { Line } from "react-chartjs-2";
import { CircularProgress, createTheme, ThemeProvider } from "@mui/material";
import SelectButton from "./SelectButton";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";
import styled from "@emotion/styled";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const useStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 25,
    padding: 40,
    "@media (max-width: 960px)": {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
  chartContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
    "@media (max-width: 960px)": {
      flexWrap: "wrap",
    },
  },
};

const StyledContainer = styled("div")(useStyles.container);
const ChartContainer = styled("div")(useStyles.chartContainer);
const ButtonContainer = styled("div")(useStyles.buttonContainer);
const Button = styled(SelectButton)(useStyles.button);

const CustomButton = styled(Button)({
  margin: "0 10px",
  borderRadius: "5px",
  padding: "8px 24px",
  cursor: "pointer",
  border: "1px solid #87CEEB",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#87CEEB",
    color: "black",
  },
});

const CustomButtonContainer = styled(ButtonContainer)({
  gap: "150px",
  flexWrap: "wrap",
  marginTop: "20px",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  "& button": {
    border: "2px solid blue",
  },
  "@media (max-width: 960px)": {
    justifyContent: "space-around",
  },
  "@media (max-width: 600px)": {
    justifyContent: "space-between",
  },
});

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const { currency, reload, setReload } = CryptoState();
  const [flag, setFlag] = useState(false);
  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setFlag(true);
    setHistoricData(data.prices);
  };

  useEffect(() => {
    fetchHistoricData();
  }, [days]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  useEffect(() => {
    if (coin) {
      const dataCoin = JSON.parse(localStorage.getItem("card")) || [];
      const updatedData = dataCoin.filter((item) => item.id !== coin.id);
      updatedData.push(coin);
      localStorage.setItem("card", JSON.stringify(updatedData));
      setReload(coin);
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledContainer>
        {!historicData || flag === false ? (
          <CircularProgress
            style={{ color: "#87CEEB" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <ChartContainer>
              <Line
                data={{
                  labels: historicData.map((coin) => {
                    let date = new Date(coin[0]);
                    let time =
                      date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    return days === 1 ? time : date.toLocaleDateString();
                  }),
                  datasets: [
                    {
                      data: historicData.map((coin) => coin[1]),
                      label: `Price ( Past ${days} Days ) in ${currency}`,
                      borderColor: "#87CEEB",
                    },
                  ],
                }}
                options={{
                  elements: {
                    point: {
                      radius: 1,
                    },
                  },
                }}
              />
            </ChartContainer>
            <CustomButtonContainer>
              {chartDays.map((day) => (
                <CustomButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setFlag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </CustomButton>
              ))}
            </CustomButtonContainer>
          </>
        )}
      </StyledContainer>
    </ThemeProvider>
  );
};

export default CoinInfo;
