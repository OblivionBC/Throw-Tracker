import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
// This is your PracticeItem component
//Test that this works and add it to the practices component

const CompWrap = styled.div`
  background-color: gray;
  width: 90%;
  padding: 0.2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
`;
const TableWrap = styled(DataTable)`
  width: 100%;
  .rdt_Table {
    background-color: white;
  }
  .rdt_TableHeadRow {
    background-color: #a9a5ba;
    font-weight: bold;
  }
  .rdt_TableRow {
    &:nth-of-type(odd) {
      background-color: white;
    }
    &:nth-of-type(even) {
      background-color: #eeeeee;
    }
  }
  .rdt_Pagination {
    background-color: #343a40;
    color: #fff;
  }
`;
const Title = styled.h1`
  display: flex;
  align-self: flex-start;
`;
const TrainingPeriodList = ({ data, sharedState, setSharedState }) => {
  const handleChange = ({ selectedRows }) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    if (selectedRows) {
      const ids = selectedRows.map((row) => {
        return row.TRPE_RK;
      });
      setSharedState(ids);
    }
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.TRPE_RK,
      sortable: true,
    },
    {
      name: "Start",
      selector: (row) => row.trpe_start_dt,
      sortable: true,
    },
    {
      name: "End",
      selector: (row) => row.trpe_end_dt,
      sortable: true,
    },
  ];
  return (
    <>
      <Title>Training Periods</Title>
      <CompWrap>
        <TableWrap
          columns={columns}
          data={data}
          fixedHeader
          pagination
          selectableRows
          onSelectedRowsChange={handleChange}
        />
      </CompWrap>
    </>
  );
};
export default TrainingPeriodList;
