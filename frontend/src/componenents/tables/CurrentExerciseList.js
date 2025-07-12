import React, { useEffect, useState } from "react";
import {
  Table,
  TableWrap,
  RowDiv,
  Title,
  CompWrap,
  AddButton,
  EditButton,
} from "../../styles/styles.js";
import DynamicModal from "../dynamicModals/DynamicModal";
import EditMeasurableForm from "../forms/EditMeasurableForm";
import AddMeasurableForm from "../forms/AddMeasurableForm";
import ConfirmMeasurableDeleteModal from "../modals/ConfirmMeasurableDeleteModal";
import { measurablesApi, personsApi } from "../../api";
import useUserStore, { useUser, useIsCoach } from "../../stores/userStore";

const TableStyles = {
  pagination: {
    style: {
      minHeight: "30px",
      padding: "0 0px",
      margin: "0 0px",
    },
    pageButtonsStyle: {
      minWidth: "30px",
      height: "10px",
      margin: "0 0px",
      padding: "0 0px",
    },
  },
};

const CurrentMeasurableList = ({ paginationNum }) => {
  const [measData, setMeasData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const user = useUser();
  const isCoach = useIsCoach();
  const { logout: logoutUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {};
    fetchUser();
  }, []);
  let pagination = 3;
  paginationNum === undefined ? (pagination = 3) : (pagination = paginationNum);

  const getMeasurableData = async () => {
    try {
      const data = await measurablesApi.getForCoach();
      setMeasData(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    try {
      getMeasurableData();
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const columns = [
    {
      name: "Measurable",
      selector: (row) => row.meas_id,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.meas_typ,
      sortable: true,
    },
    {
      name: "Unit",
      selector: (row) => row.meas_unit,
      sortable: true,
    },
    {
      cell: (row) => (
        <AddButton
          onClick={() => {
            setSelectedRow(row);
            setEditModalOpen(true);
          }}
        >
          Details
        </AddButton>
      ),
    },
    {
      cell: (row) => (
        <AddButton
          onClick={() => {
            setSelectedRow(row);
            setDeleteModalOpen(true);
          }}
        >
          Delete
        </AddButton>
      ),
    },
  ];

  return (
    <CompWrap>
      <DynamicModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        refresh={() => getMeasurableData()}
        Component={AddMeasurableForm}
        props={{ coach_prsn_rk: user.id }}
      />
      <DynamicModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        refresh={() => getMeasurableData()}
        Component={EditMeasurableForm}
        props={selectedRow}
      />
      <ConfirmMeasurableDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        refresh={() => getMeasurableData()}
        measurable={selectedRow}
      />
      <RowDiv>
        <Title>Current Measurables</Title>
        <AddButton
          onClick={() => {
            setAddModalOpen(true);
          }}
        >
          Add
        </AddButton>
      </RowDiv>
      <TableWrap>
        <Table
          columns={columns}
          data={measData}
          fixedHeader
          pagination
          paginationPerPage={pagination}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
            selectAllRowsItem: false,
          }}
          customStyles={TableStyles}
        />
      </TableWrap>
    </CompWrap>
  );
};

export default CurrentMeasurableList;
