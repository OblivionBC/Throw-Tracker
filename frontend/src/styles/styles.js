import styled from "styled-components";
import DataTable from "react-data-table-component";
import { Form, FieldArray } from "formik";
//Pages
export const AppLayout = styled.div`
  display: flex; /* Flexbox layout for sidebar and main content */
  min-height: 100vh;
`;
export const AppRHS = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 220px; /* Account for fixed sidebar width */
  min-width: 0; /* Allow content to shrink */
`;
export const AppRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px;
  margin: 0px;
`;
export const PageContent = styled.div`
  display: flex;
  background: white;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const FormContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
`;
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px;
  margin: 0px;
`;
export const Col = styled.div`
  display: flex;
  flex-direction: column;
`;
//Modals
export const Overlay = styled.div`
  display: flex;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
`;
export const ModalContainer = styled.div`
  display: flex;
  flex: 1;

  align-items: center;
  flex-direction: column;
  max-width: 1400px;
  width: 70%;
  max-height: 80%;
  overflow-y: auto;
  position: fixed;
  background-color: white;
  border-radius: 15px;
  padding-bottom: 10px;
  padding-top: 10px;
`;
export const Content = styled.div`
  width: 90%;
`;

//Buttons
export const ButtonContainer = styled.div`
  display: flex;
  width: 20%;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;
export const EditButton = styled.button`
  background: linear-gradient(45deg, #808080 30%, black 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;
export const CloseButton = styled.button`
  background: linear-gradient(45deg, black 30%, #808080 95%);
  margin: 5px;
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;
export const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
export const AddButton = styled.button`
  background: linear-gradient(45deg, #808080 30%, white 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;

export const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

//Tables
export const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const RowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  font-family: "Nunito", sans-serif;
  margin: 0;
  padding: 0;
`;

export const FieldName = styled.h3`
  margin: 0 10px 0 0;
  padding: 0;
`;

export const Logo = styled.img`
  max-height: 20vh;
  object-fit: contain;
  margin-bottom: 20px;
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

export const FieldLabel = styled.h4`
  color: grey;
  margin-right: 20px;
`;

export const CompWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 98%;
  height: 100%;
`;
export const TableWrap = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  max-width: 100%;
  height: auto;
  padding: 0.2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
`;
export const Table = styled(DataTable)`
  max-width: 100%;
  .rdt_Table {
    background-color: white;
  }
  .rdt_TableHeadRow {
    background-color: #a9a5ba;
    font-weight: bold;
    height: 50px !important;
    min-height: 50px !important;
    max-height: 50px !important;
  }
  .rdt_TableHead {
    height: 50px !important;
    min-height: 50px !important;
    max-height: 50px !important;
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
export const Title = styled.h1`
  display: flex;
  font-size: 2vw;
  align-self: flex-start;
  margin: 0 0 5px 0;
  padding: 0;
  height: 15%;
`;

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-top: 10px;
  padding: 20px;
  background: #dedede;
  border: 2px gray solid;
`;
export const StyledFieldArray = styled(FieldArray)`
  padding: 5px;
  border: 3px solid black;
  border-radius: 10px;
`;

export const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

export const StyledSelect = styled.select`
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

export const ParagraphInput = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

export const StyledButton = styled.button`
  background: linear-gradient(45deg, darkblue 30%, skyblue 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  margin-top: 10px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;
export const SubmitError = styled.div`
  font-size: 18;
  color: red;
  font-family: "Nunito", sans-serif;
`;

export const FieldOutputContainer = styled.div`
  display: flex;
  width: 60%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
