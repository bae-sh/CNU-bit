// 랭크 옆에 1,2,3등을 금은동으로 이미지를 나타내는 js

import styled from "styled-components";
import goldMedal from "../img/gold.png";
import siverMedal from "../img/siver.png";
import bronzeMedal from "../img/bronze.png";

const MedalImage = styled.img`
    width: 40px;
    height: 40px;
`;

const medalImage = (index) => {
    if (index === 1) {
        return <MedalImage src={goldMedal} />;
    } else if (index === 2) {
        return <MedalImage src={siverMedal} />;
    } else if (index === 3) {
        return <MedalImage src={bronzeMedal} />;
    } else {
        return index;
    }
};
export default medalImage;
