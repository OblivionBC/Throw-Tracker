import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
// This is your PracticeItem component
//Test that this works and add it to the practices component

const CompWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 50%;
  margin: 5px;
`;
const Item = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 95%;
  height: 55%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border: 2px solid black;
  border-radius: 30px;
`;
const Title = styled.h1`
  display: flex;
  align-self: flex-start;
  margin: 0 0 5px 0;
  padding: 0;
`;
const RowTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 95%;
`;
const RowBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 95%;
`;
const DataLabel = styled.p`
  display: flex;
  margin-right: 8%;
`;
const Data = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-left: 5%;
  margin-right: 5%;
`;

const LastPractice = () => {
  //Stuff
  const [datas, setDatas] = useState({
    prac_rk: 1,
    prac_implement: "null",
    prac_implement_weight: "Probably Heavy",
    prac_best: 1,
    prac_dt: "01/01/2000",
    TRPE_RK: 1,
  });
  useEffect(() => {
    setDatas({
      prac_rk: 3,
      prac_implement: "Shot Put",
      prac_implement_weight: "7.26kg",
      prac_best: 18.44,
      prac_dt: "03/09/2024",
      TRPE_RK: 3,
    });
  }, []);

  return (
    <CompWrap>
      <Title>Last Practice</Title>
      <Item>
        <RowTop>
          <Data>
            <DataLabel>PRAC_RK: </DataLabel>
            {datas.prac_rk}
          </Data>
          <Data>
            <DataLabel>Implement: </DataLabel>
            {datas.prac_implement}
          </Data>
          <Data>
            <DataLabel>Implement Weight: </DataLabel>
            {datas.prac_implement_weight}
          </Data>
        </RowTop>
        <RowBottom>
          <Data>
            <DataLabel>Best Throw: </DataLabel>
            {datas.prac_best}
          </Data>
          <Data>
            <DataLabel>Date: </DataLabel>
            {datas.prac_dt}
          </Data>
        </RowBottom>
      </Item>
    </CompWrap>
  );
};

export default LastPractice;
