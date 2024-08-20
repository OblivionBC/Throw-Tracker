import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "typeface-nunito";
import dayjs from "dayjs";
import * as FaIcons from "react-icons/fa";
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

  flex-direction: column;
  width: 95%;
  height: 100%;
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

const DateWrap = styled.div`
  display: flex;
  align-self: flex-start;
  margin: 1rem;
  padding: 0;
`;
const Date = styled.h1`
  display: flex;
  align-self: flex-start;
  margin: 10px 10px 0 10px;
  padding: 0;
`;

const ColumnLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 95%;
`;
const ColumnRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 95%;
`;
const Rows = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 95%;
`;
const Column = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 95%;
`;

const DataLabel = styled.p`
  display: flex;
  font-size: 24px;
  font-weight: 500;
  margin-right: 20px;
`;
const Data = styled.p`
  display: flex;
  font-size: 20px;
  margin: 0;
  padding: 0;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;
const Weight = styled(FaIcons.FaWeightHanging)`
  margin-right: 5px;
  height: 25px;
  width: 25px;
`;
const Medal = styled(FaIcons.FaMedal)`
  margin-right: 5px;
  height: 25px;
  width: 25px;
`;

const Implement = styled(FaIcons.FaToolbox)`
  height: 50px;
  width: 50px;
`;
const LastPractice = () => {
  //Stuff
  const [datas, setDatas] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/get-last-practice`
      );
      const jsonData = await response.json();
      const row = jsonData.rows[0];
      console.log(row);
      setDatas({
        prac_rk: row.prac_rk,
        prac_implement: row.prac_implement,
        prac_implement_weight: row.prac_implement_weight,
        prac_best: row.prac_best,
        prac_dt: row.prac_dt,
        TRPE_RK: row.TRPE_RK,
      });
      setLoading(false);
    };
    fetchData();
    console.log("DONE");
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <CompWrap>
      <Title>Last Practice</Title>
      <Item>
        <DateWrap>
          <Date>{dayjs(datas.meet_dt).format("MMM D YYYY")}</Date>
        </DateWrap>
        <Rows>
          <ColumnLeft>
            <Data>
              <Medal />
              <DataLabel>Best Throw: </DataLabel>
              {datas.prac_best}
            </Data>
            <Data>
              <Weight />
              <DataLabel>Implement Weight: </DataLabel>
              {datas.prac_implement_weight}
            </Data>
          </ColumnLeft>
          <ColumnRight>
            <Implement />
            <Data>
              <DataLabel>Implement: </DataLabel>
              {datas.prac_implement}
            </Data>
          </ColumnRight>
        </Rows>
      </Item>
    </CompWrap>
  );
};

export default LastPractice;
/*<CompWrap>
      <Title>Last Practice</Title>
      <Item>
        <Row>
          <Date>{dayjs(datas.meet_dt).format("MMM D YYYY")}</Date>
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
        </Row>
        <ColumnRight>
          <Data>
            <DataLabel>Best Throw: </DataLabel>
            {datas.prac_best}
          </Data>
          <Data>
            <DataLabel>Date: </DataLabel>
            {dayjs(datas.meet_dt).format("MMM D YYYY")}
          </Data>
        </ColumnRight>
      </Item>
    </CompWrap>
    */
