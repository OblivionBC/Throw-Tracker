import React from "react";
import styled from "styled-components";
import "typeface-nunito";
// This is your PracticeItem component

const PracticeWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ItemWrap = styled.p`
  font-family: "Nunito", sans-serif;
  margin-left: 15px;
`;
const PracticeItem = (
  { prac_rk, implement, implementWeight, best, date, TRPE_RK },
  key
) => {
  return (
    <PracticeWrap>
      <ItemWrap>PRAC Key:{prac_rk}</ItemWrap>
      <ItemWrap>Implement: {implement}</ItemWrap>
      <ItemWrap>Implement Weight: {implementWeight}</ItemWrap>
      <ItemWrap>Best: {best}</ItemWrap>
      <ItemWrap>Date: {date}</ItemWrap>
      <ItemWrap>TRPE Key: {TRPE_RK}</ItemWrap>
    </PracticeWrap>
  );
};

// This is your main component where you map through your data
const Practices = ({ data }) => {
  return (
    <div>
      {data.map((item) => (
        <PracticeItem
          key={item.prac_rk}
          prac_rk={item.prac_rk}
          implement={item.prac_implement}
          implementWeight={item.prac_implement_weight}
          best={item.prac_best}
          date={item.prac_dt}
          TRPE_RK={item.TRPE_RK}
        />
      ))}
    </div>
  );
};

export default Practices;
