import React, { useEffect, useState } from "react";
import {
  Table,
  TableWrap,
  Title,
  CompWrap,
  AddButton,
  EditButton,
  StyledButton,
} from "../../styles/design-system";
import { meetsApi } from "../../api";
import dayjs from "dayjs";
import MeetCreationWizardModal from "../modals/MeetCreationWizardModal";
import EditMeetModal from "../modals/EditMeetModal";
import ViewMeetModal from "../modals/ViewMeetModal";

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

const MeetList = () => {
  const [meetData, setMeetData] = useState([]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMeet, setSelectedMeet] = useState(null);

  const getMeetData = async () => {
    try {
      const response = await meetsApi.getForCoachOrg();
      setMeetData(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    try {
      getMeetData();
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const handleChange = ({ selectedRows }) => {
    if (selectedRows) {
      const ids = selectedRows?.map((row) => {
        return row.meet_rk;
      });
    }
  };

  const handleWizardSuccess = (meetData) => {
    getMeetData(); // Refresh the meet list
    setWizardOpen(false);
  };

  const handleEditMeet = (meet) => {
    setSelectedMeet(meet);
    setEditModalOpen(true);
  };

  const handleViewMeet = (meet) => {
    setSelectedMeet(meet);
    setViewModalOpen(true);
  };

  const handleEditSuccess = () => {
    getMeetData(); // Refresh the meet list
    setEditModalOpen(false);
    setSelectedMeet(null);
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.meet_nm,
      sortable: true,
    },
    {
      name: "Date Range",
      selector: (row) => row.meet_start_dt || row.meet_dt,
      cell: (row) => (
        <div>
          {row.meet_start_dt && row.meet_end_dt ? (
            <>
              {dayjs(row.meet_start_dt).format("MMM D")}
              {row.meet_start_dt !== row.meet_end_dt && (
                <> - {dayjs(row.meet_end_dt).format("MMM D, YYYY")}</>
              )}
              {row.meet_start_dt === row.meet_end_dt && (
                <>, {dayjs(row.meet_start_dt).format("YYYY")}</>
              )}
            </>
          ) : (
            dayjs(row.meet_dt).format("MMM D, YYYY")
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.meet_location,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <EditButton $size="sm" onClick={() => handleEditMeet(row)}>
            Edit
          </EditButton>
          <StyledButton
            $variant="success"
            $size="sm"
            onClick={() => handleViewMeet(row)}
          >
            View
          </StyledButton>
        </div>
      ),
    },
  ];

  return (
    <CompWrap>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Title>Meets</Title>
        <AddButton onClick={() => setWizardOpen(true)}>
          Create New Meet
        </AddButton>
      </div>

      <TableWrap>
        <Table
          columns={columns}
          data={meetData}
          pagination
          paginationComponentOptions={TableStyles.pagination}
          onChange={handleChange}
          highlightOnHover
          pointerOnHover
        />
      </TableWrap>

      <MeetCreationWizardModal
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSuccess={handleWizardSuccess}
      />

      <EditMeetModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedMeet(null);
        }}
        onSuccess={handleEditSuccess}
        meet={selectedMeet}
      />

      <ViewMeetModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedMeet(null);
        }}
        meet={selectedMeet}
      />
    </CompWrap>
  );
};

export default MeetList;
