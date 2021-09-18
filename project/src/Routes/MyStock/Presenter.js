/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import styled from "styled-components";

const Main = styled.div`
  background-color: #ffffff;
  width: 100%;
  margin: auto;
  flex: 1;
  padding: 100px;

  & > h1 {
    font-size: 40px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  & > h2 {
    font-size: 35px;
    font-weight: 600;
    margin: 40px 50px;
  }
  & > h3 {
    font-size: 30px;
    font-weight: 500;
    margin: 40px 50px;
  }
`;
const Table = styled.table`
  width: 100%;
  border: 1px solid #ededed;
`;

const Row = styled.tr`
  border-bottom: 1px solid #ededed;
  &:first-child {
    background-color: #f9f9f9;
    & > th {
      padding: 20px;
    }
  }
  & > td {
    padding: 15px;
    font-size: 15px;
    text-align: center;
    &:nth-child(5),
    :nth-child(6) {
      color: ${({ rate }) => {
        if (rate > 0) {
          return "red";
        } else if (rate === 0) {
          return "black";
        } else {
          return "blue";
        }
      }};
    }
    &:first-child {
      font-weight: 500;
    }
  }
`;
const Button = styled.button`
  font-size: 15px;
  border-radius: 10px;
  padding: 5px 10px;
  background-color: ${({ color }) => color};
`;

function changeText(price) {
  let textPrice = "";
  for (let i = 1; i <= price.length; i++) {
    textPrice = price[price.length - i] + textPrice;
    if (i % 3 === 0 && i !== price.length) {
      textPrice = "," + textPrice;
    }
  }
  return textPrice;
}

function getMyAsset(userInfo, coinData) {
  var myAsset = userInfo.cash;
  {
    coinData.map((coin) => {
      myAsset +=
        coin["trade_price"] * userInfo["coin"][`${coin["code"]}`]["quantity"];
    });
  }
  return myAsset;
}
const handlePrompt = (
  current,
  coinPrice,
  coinCode,
  userInfo,
  setUserInfo,
  coinName
) => {
  let text = current === "buy" ? "매수" : "매도";
  let amount = prompt(`${text}수량을 입력하시오.`);
  if (amount === null) {
  } else if (isNaN(amount) || amount <= 0) {
    alert("0보다 큰 숫자만 입력 가능합니다.");
  } else if (amount > 0) {
    current === "buy"
      ? buyCoin(amount, coinPrice, coinCode, userInfo, setUserInfo, coinName)
      : sellCoin(amount, coinPrice, coinCode, userInfo, setUserInfo, coinName);
  }
  return amount;
};

const buyCoin = (
  amount,
  coinPrice,
  coinCode,
  userInfo,
  setUserInfo,
  coinName
) => {
  let curUserInfo = userInfo;
  if (coinPrice * amount > curUserInfo["cash"]) {
    alert("현금이 부족합니다.");
  } else {
    curUserInfo["cash"] -= coinPrice * amount;
    curUserInfo["coin"][coinCode]["boughtPrice"] += coinPrice * amount;
    curUserInfo["coin"][coinCode]["quantity"] += Number(amount);
    setUserInfo(curUserInfo);
    alert(`${coinName}을 ${amount}개 매수하였습니다. `);
  }
};
const sellCoin = (
  amount,
  coinPrice,
  coinCode,
  userInfo,
  setUserInfo,
  coinName
) => {
  let curUserInfo = userInfo;
  if (amount > curUserInfo["coin"][coinCode]["quantity"]) {
    alert(
      `${coinName} 보유 수량(${curUserInfo["coin"][coinCode]["quantity"]})보다 많습니다.`
    );
  } else {
    curUserInfo["cash"] += coinPrice * amount;
    curUserInfo["coin"][coinCode]["boughtPrice"] -=
      (curUserInfo["coin"][coinCode]["boughtPrice"] /
        curUserInfo["coin"][coinCode]["quantity"]) *
      amount;
    curUserInfo["coin"][coinCode]["quantity"] -= Number(amount);
    setUserInfo(curUserInfo);
    alert(`${coinName}을 ${amount}개 매도하였습니다. `);
  }
};
export default ({ userInfo, setUserInfo, coinData }) => {
  var myAsset = changeText(String(getMyAsset(userInfo, coinData)));
  const myCash = changeText(String(userInfo["cash"]));

  const getMyCoin = () => {
    const result = [];
    const myCoin = Object.values(userInfo["coin"]);
    const myCoinCode = Object.keys(userInfo["coin"]);
    const coinPrices = {
      "KRW-BTC": 0,
      "KRW-ETH": 0,
      "KRW-DOGE": 0,
      "KRW-XRP": 0,
      "KRW-LTC": 0,
      "KRW-ETC": 0,
      "KRW-QTUM": 0,
      "KRW-STEEM": 0,
      "KRW-ARDR": 0,
      "KRW-REP": 0,
    };
    {
      coinData.map((coin) => {
        coinPrices[coin["code"]] = coin["trade_price"];
      });
    }
    for (let i = 0; i < myCoin.length; i++) {
      const coin = myCoin[i];
      const coinName = coin["name"];
      const coinCode = myCoinCode[i];
      const coinPrice = coinPrices[coinCode];
      const coinQuantity = coin["quantity"];
      const profit = coinPrice * coinQuantity - myCoin[i]["boughtPrice"];
      const boughtAvgPrice = coin["boughtPrice"] / coin["quantity"];
      const rate = ((coinPrice / boughtAvgPrice - 1) * 100).toFixed(3);

      if (coin["quantity"] === 0) continue;
      result.push(
        <Row rate={rate}>
          <td>{coinName}</td>
          <td>{`${changeText(String(coinPrice))} 원`}</td>
          <td>{`${changeText(String(parseInt(boughtAvgPrice)))} 원`}</td>
          <td>{`${changeText(String(coin["boughtPrice"]))} 원`}</td>
          <td>{`${rate >= 0 ? "+" : "-"}${changeText(
            String(Math.abs(profit))
          )}원`}</td>
          <td>{`${String(rate)}%`}</td>
          <td>{`${coinQuantity}`}</td>
          <td>
            <Button
              color="#F75467"
              onClick={() => {
                handlePrompt(
                  "buy",
                  coinPrice,
                  coinCode,
                  userInfo,
                  setUserInfo,
                  coinName
                );
              }}
            >
              매수
            </Button>
          </td>
          <td>
            <Button
              color="#4386F9"
              onClick={() => {
                handlePrompt(
                  "sell",
                  coinPrice,
                  coinCode,
                  userInfo,
                  setUserInfo,
                  coinName
                );
              }}
            >
              매도
            </Button>
          </td>
        </Row>
      );
    }
    return result;
  };

  return (
    <div class="inner">
      <Main>
        <h1>My자산</h1>
        <hr></hr>
        <h2>My총자산 : {myAsset} 원</h2>
        <h3>My현금 : {myCash}원</h3>
        <Table>
          <Row>
            <th>코인</th>
            <th>실시간 시세</th>
            <th>매입가</th>
            <th>매입총액</th>
            <th>평가손익</th>
            <th>수익률</th>
            <th>수량</th>
            <th>매수</th>
            <th>매도</th>
          </Row>
          {getMyCoin()}
        </Table>
      </Main>
    </div>
  );
};