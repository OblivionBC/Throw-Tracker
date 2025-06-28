import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "typeface-nunito";
import dayjs from "dayjs";
import * as FaIcons from "react-icons/fa";
import { practicesApi } from "../api";
// This is your PracticeItem component
//Test that this works and add it to the practices component

const LastPractice = () => {
  //Stuff
  const [datas, setDatas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const jsonData = await practicesApi.getLast();
        const row = jsonData[0];
        setDatas({
          prac_rk: row.prac_rk,
          meas_id: row.meas_id,
          msrm_value: row.msrm_value,
          meas_unit: row.meas_unit,
          prac_dt: row.prac_dt,
          TRPE_RK: row.TRPE_RK,
        });
      } catch (error) {
        console.error("Error fetching last practice:", error);
      }
      setLoading(false);
    };
    fetchData();
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
              <Weight />
              <DataLabel>Measurement: </DataLabel>
              {datas.msrm_value} and {datas.meas_unit}
            </Data>
          </ColumnLeft>
          <ColumnRight>
            <Implement />
            <Data>
              <DataLabel>Measurable: </DataLabel>
              {datas.meas_id}
            </Data>
          </ColumnRight>
        </Rows>
      </Item>
    </CompWrap>
  );
};

export default LastPractice;
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
  justify-content: center;
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

const DataLabel = styled.span`
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
  height: 50px;
  width: 50px;
`;

const Implement = styled(FaIcons.FaToolbox)`
  height: 50px;
  width: 50px;
`;
