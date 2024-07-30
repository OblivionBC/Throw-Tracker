import React from "react";

// This is your PracticeItem component
const PracticeItem = ({
  prac_rk,
  prac_implement,
  prac_implement_weight,
  prac_best,
  prac_dt,
  TRPE_RK,
}) => {
  return (
    <div>
      <p>Rank: {prac_rk}</p>
      <p>Implement: {prac_implement}</p>
      <p>Implement Weight: {prac_implement_weight}</p>
      <p>Best: {prac_best}</p>
      <p>Date: {prac_dt}</p>
      <p>Training Period Rank: {TRPE_RK}</p>
    </div>
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
          prac_implement={item.prac_implement}
          prac_implement_weight={item.prac_implement_weight}
          prac_best={item.prac_best}
          prac_dt={item.prac_dt}
          TRPE_RK={item.TRPE_RK}
        />
      ))}
    </div>
  );
};

export default Practices;
