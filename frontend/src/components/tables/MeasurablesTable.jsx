import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../ui/DataTable/DataTable";
import {
  AddButton,
  EditButton,
} from "../../styles/design-system";
import ConfirmMeasurableDeleteModal from "../modals/ConfirmMeasurableDeleteModal";
import { measurablesApi } from "../../api";
import { useDataChange } from "../contexts/DataChangeContext";
import Logger from "../../utils/logger";
import { getPaginationNumber } from "../../utils/tableUtils";

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

const MeasurablesTable = ({ paginationNum }) => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [measurableData, setMeasurableData] = useState([]);
  const [confirmMeasDelete, setConfirmMeasDelete] = useState(false);
  const [selectedMeas, setSelectedMeas] = useState({});
  const navigate = useNavigate();

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

    if (!forceRefresh && isCacheValid(cacheKey)) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData && cachedData.data) {
        setMeasurableData(cachedData.data);
        return;
      }
    }

    setCacheLoading(cacheKey, true);

    try {
      const response = await measurablesApi.getAllForPerson();
      setMeasurableData(response);
      setCacheData(cacheKey, response);
    } catch (error) {
      Logger.error(error.message);
    } finally {
      setCacheLoading(cacheKey, false);
    }
  };

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
    },
    {
      name: "Name",
      selector: (row) => row.meas_id,
      sortable: true,
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
              navigate(`/measurables/${row.meas_rk}/edit`);
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

  const optimalPagination = getPaginationNumber(paginationNum, containerHeight);

  const actions = (
    <>
      <AddButton onClick={() => navigate("/measurables/new")}>Add</AddButton>
      <AddButton onClick={handleRefresh}>Refresh</AddButton>
    </>
  );

  return (
    <div ref={containerRef}>
      {confirmMeasDelete && (
        <ConfirmMeasurableDeleteModal
          open={confirmMeasDelete}
          onClose={() => setConfirmMeasDelete(false)}
          measObj={selectedMeas}
          refresh={handleDataChange}
        />
      )}
      <DataTable
        title="Measurables"
        columns={columns}
        data={measurableData}
        loading={false}
        pagination={{ page: 1, perPage: optimalPagination }}
        actions={actions}
        customStyles={TableStyles}
      />
    </div>
  );
};

export default MeasurablesTable;

