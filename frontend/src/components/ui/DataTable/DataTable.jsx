import React from "react";
import DataTableComponent from "react-data-table-component";
import { TableWrap, CompWrap, Title } from "../../../styles/design-system";
import styled from "styled-components";

const defaultTableStyles = {
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

/**
 * Reusable DataTable component
 * @param {Object} props
 * @param {Array} props.columns - Column definitions
 * @param {Array} props.data - Table data
 * @param {boolean} props.loading - Loading state
 * @param {Object} props.pagination - Pagination config { page, perPage }
 * @param {Function} props.onRowClick - Callback when row is clicked
 * @param {Function} props.onSort - Callback when column is sorted
 * @param {ReactNode} props.actions - Actions to display above table (e.g., Add button)
 * @param {ReactNode} props.title - Table title
 * @param {Object} props.customStyles - Custom styles for react-data-table-component
 * @param {boolean} props.fixedHeader - Whether to fix header
 * @param {boolean} props.selectableRows - Whether rows are selectable
 * @param {Function} props.onSelectedRowsChange - Callback when selection changes
 * @param {Object} props.paginationComponentOptions - Pagination component options
 */
const DataTable = ({
  columns,
  data,
  loading = false,
  pagination = { page: 1, perPage: 10 },
  onRowClick,
  onSort,
  actions,
  title,
  customStyles = defaultTableStyles,
  fixedHeader = true,
  selectableRows = false,
  onSelectedRowsChange,
  paginationComponentOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: false,
  },
  ...rest
}) => {
  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleSort = (column, sortDirection) => {
    if (onSort) {
      onSort(column, sortDirection);
    }
  };

  return (
    <CompWrap>
      {(title || actions) && (
        <TableHeader>
          {title && <TableTitle>{title}</TableTitle>}
          {actions && <ActionsContainer>{actions}</ActionsContainer>}
        </TableHeader>
      )}
      <TableWrap>
        <DataTableComponent
          columns={columns}
          data={data}
          progressPending={loading}
          fixedHeader={fixedHeader}
          pagination={pagination !== false}
          paginationPerPage={pagination?.perPage || 10}
          paginationDefaultPage={pagination?.page || 1}
          onRowClicked={handleRowClick}
          onSort={handleSort}
          customStyles={customStyles}
          selectableRows={selectableRows}
          onSelectedRowsChange={onSelectedRowsChange}
          paginationComponentOptions={paginationComponentOptions}
          pointerOnHover={!!onRowClick}
          {...rest}
        />
      </TableWrap>
    </CompWrap>
  );
};

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TableTitle = styled(Title)`
  font-size: 1.5rem;
  margin: 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export default DataTable;

