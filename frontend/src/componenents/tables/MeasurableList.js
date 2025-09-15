import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableWrap,
  RowDiv,
  Title,
  CompWrap,
  AddButton,
  EditButton,
} from "../../styles/design-system";
import AddMeasurableModal from "../modals/AddMeasurableModal";
import ConfirmMeasurableDeleteModal from "../modals/ConfirmMeasurableDeleteModal";
import MeasurableEditModal from "../modals/MeasurableEditModal";
import { measurablesApi } from "../../api";
import { useDataChange } from "../contexts/DataChangeContext";
import {
  getPaginationNumber,
  getContainerHeight,
} from "../../utils/tableUtils";
// This is your PracticeItem component
//Test that this works and add it to the practices component

const TableStyles = {
  pagination: {
    style: {
      minHeight: "30px", // Adjust the height as needed
      padding: "0 0px",
      margin: "0 0px",
    },
    pageButtonsStyle: {
      minWidth: "30px", // Adjust the width as needed
      height: "10px", // Adjust the height as needed
      margin: "0 0px",
      padding: "0 0px",
    },
  },
};

const Measurables = ({ paginationNum }) => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [measurableData, setMeasurableData] = useState([]);
  const [addMeasurableOpen, setaddMeasurableOpen] = useState(false);
  const [confirmMeasDelete, setConfirmMeasDelete] = useState(false);
  const [editMeas, setEditMeas] = useState(false);
  const [selectedMeas, setSelectedMeas] = useState({});

  const {
    isCacheValid,
    setCacheData,
    setCacheLoading,
    getCachedData,
    invalidateCache,
    refreshFlags,
  } = useDataChange();

  const getMeasurableData = async (forceRefresh = false) => {
    const cacheKey = "measurables";

    // Check if we have valid cached data and don't need to force refresh
    if (!forceRefresh && isCacheValid(cacheKey)) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData && cachedData.data) {
        setMeasurableData(cachedData.data);
        return;
      }
    }

    // Set loading state
    setCacheLoading(cacheKey, true);

    try {
      const response = await measurablesApi.getAllForPerson();
      setMeasurableData(response);
      setCacheData(cacheKey, response);
    } catch (error) {
      console.error(error.message);
    } finally {
      setCacheLoading(cacheKey, false);
    }
  };

  // Update container height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    getMeasurableData();
  }, [refreshFlags.measurables]);

  const handleRefresh = () => {
    getMeasurableData(true);
  };

  const handleDataChange = () => {
    invalidateCache("measurables");
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.meas_rk,
      sortable: true,
      //width: "9%",
    },
    {
      name: "Name",
      selector: (row) => row.meas_id,
      sortable: true,
      //width: "15%",
    },
    {
      name: "Type",
      selector: (row) => row.meas_typ,
      sortable: true,
    },
    {
      name: "Units",
      selector: (row) => row.meas_unit,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <EditButton
            $size="sm"
            onClick={() => {
              setEditMeas(true);
              setSelectedMeas(row);
            }}
          >
            Edit
          </EditButton>
          <EditButton
            $size="sm"
            onClick={() => {
              setConfirmMeasDelete(true);
              setSelectedMeas(row);
            }}
          >
            Delete
          </EditButton>
        </div>
      ),
    },
  ];
  // Calculate optimal pagination
  const optimalPagination = getPaginationNumber(paginationNum, containerHeight);

  return (
    <CompWrap ref={containerRef}>
      {confirmMeasDelete && (
        <ConfirmMeasurableDeleteModal
          open={confirmMeasDelete}
          onClose={() => setConfirmMeasDelete(false)}
          measObj={selectedMeas}
          refresh={handleDataChange}
        />
      )}
      {addMeasurableOpen && (
        <AddMeasurableModal
          open={addMeasurableOpen}
          onClose={() => setaddMeasurableOpen(false)}
          refresh={handleDataChange}
        />
      )}
      {editMeas && (
        <MeasurableEditModal
          open={editMeas}
          onClose={() => setEditMeas(false)}
          measObj={selectedMeas}
          refresh={handleDataChange}
        />
      )}
      <RowDiv>
        <Title>Measurables</Title>
        <AddButton onClick={() => setaddMeasurableOpen(true)}>Add</AddButton>
        <AddButton onClick={handleRefresh}>Refresh</AddButton>
      </RowDiv>

      <TableWrap>
        <Table
          columns={columns}
          data={measurableData}
          fixedHeader
          pagination
          paginationPerPage={optimalPagination}
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

export default Measurables;
