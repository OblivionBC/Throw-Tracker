import styled, { css } from "styled-components";
import DataTable from "react-data-table-component";
import { Form, FieldArray } from "formik";

const tokens = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
    light: "#f8f9fa",
    dark: "#343a40",
    white: "#ffffff",
    black: "#000000",
    gray: {
      100: "#f8f9fa",
      200: "#e9ecef",
      300: "#dee2e6",
      400: "#ced4da",
      500: "#adb5bd",
      600: "#6c757d",
      700: "#495057",
      800: "#343a40",
      900: "#212529",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.3rem",
    md: "0.4rem",
    lg: "0.6rem",
    xl: "0.75rem",
    xxl: "1rem",
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.12)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
  },
  transitions: {
    fast: "0.15s ease",
    normal: "0.2s ease",
    slow: "0.3s ease",
  },
};

const mixins = {
  flexCenter: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  flexBetween: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  buttonBase: css`
    border: none;
    border-radius: ${tokens.radius.md};
    cursor: pointer;
    font-family: "Rubik", sans-serif;
    font-weight: 500;
    transition: all ${tokens.transitions.normal};
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
  buttonHover: css`
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: ${tokens.shadows.md};
    }
  `,
  inputBase: css`
    border: 1px solid ${tokens.colors.gray[300]};
    border-radius: ${tokens.radius.sm};
    padding: ${tokens.spacing.sm} ${tokens.spacing.md};
    font-family: "Rubik", sans-serif;
    transition: border-color ${tokens.transitions.normal};
    &:focus {
      outline: none;
      border-color: ${tokens.colors.primary};
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
  `,
};

const buttonVariants = {
  primary: css`
    background: linear-gradient(
      45deg,
      ${tokens.colors.primary} 30%,
      #0056b3 95%
    );
    color: ${tokens.colors.white};
    box-shadow: ${tokens.shadows.sm};
  `,
  secondary: css`
    background: linear-gradient(
      45deg,
      ${tokens.colors.gray[600]} 30%,
      ${tokens.colors.gray[700]} 95%
    );
    color: ${tokens.colors.white};
    box-shadow: ${tokens.shadows.sm};
  `,
  success: css`
    background: linear-gradient(
      45deg,
      ${tokens.colors.success} 30%,
      #1e7e34 95%
    );
    color: ${tokens.colors.white};
    box-shadow: ${tokens.shadows.sm};
  `,
  danger: css`
    background: linear-gradient(
      45deg,
      ${tokens.colors.danger} 30%,
      #c82333 95%
    );
    color: ${tokens.colors.white};
    box-shadow: ${tokens.shadows.sm};
  `,
  outline: css`
    background: transparent;
    color: ${tokens.colors.primary};
    border: 2px solid ${tokens.colors.primary};
    box-shadow: none;
    &:hover {
      background: ${tokens.colors.primary};
      color: ${tokens.colors.white};
    }
  `,
};

const buttonSizes = {
  sm: css`
    padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
    font-size: 0.9rem;
  `,
  md: css`
    padding: ${tokens.spacing.sm} ${tokens.spacing.md};
    font-size: 1rem;
  `,
  lg: css`
    padding: ${tokens.spacing.md} ${tokens.spacing.lg};
    font-size: 1.125rem;
  `,
};

export const Button = styled.button`
  ${mixins.buttonBase}
  ${mixins.buttonHover}
  ${({ $variant = "primary" }) => buttonVariants[$variant]}
  ${({ $size = "md" }) => buttonSizes[$size]}
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
`;

export const StyledButton = styled(Button)``;
export const EditButton = styled(Button).attrs({ $variant: "secondary" })``;
export const DeleteButton = styled(Button).attrs({ $variant: "danger" })``;
export const AddButton = styled(Button).attrs({ $variant: "success" })``;
export const CancelButton = styled(Button).attrs({ $variant: "outline" })``;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${tokens.colors.gray[600]};
  padding: ${tokens.spacing.xs};

  &:hover {
    color: ${tokens.colors.gray[800]};
  }
`;

// ============================================================================
// FORMS
// ============================================================================

export const FormContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
`;

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${tokens.radius.lg};
  margin-top: ${tokens.spacing.md};
  padding: ${tokens.spacing.xl};
  background: ${tokens.colors.gray[100]};
  border: 2px solid ${tokens.colors.gray[300]};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
  width: 100%;
`;

export const Label = styled.label`
  font-weight: 600;
  color: ${tokens.colors.gray[700]};
  font-size: 0.875rem;
`;

export const FieldLabel = styled(Label)`
  color: ${tokens.colors.gray[600]};
  margin-right: ${tokens.spacing.lg};
`;

export const Input = styled.input`
  ${mixins.inputBase}
  ${({ error }) =>
    error &&
    css`
      border-color: ${tokens.colors.danger};
      &:focus {
        border-color: ${tokens.colors.danger};
      }
    `}
`;

export const StyledInput = styled(Input)``;

export const Select = styled.select`
  ${mixins.inputBase}
  background-color: ${tokens.colors.white};
`;

export const StyledSelect = styled(Select)``;

export const Textarea = styled.textarea`
  ${mixins.inputBase}
  resize: vertical;
  min-height: 100px;
`;

export const ParagraphInput = styled(Textarea)``;

export const StyledFieldArray = styled(FieldArray)`
  padding: ${tokens.spacing.md};
  border: 3px solid ${tokens.colors.gray[400]};
  border-radius: ${tokens.radius.lg};
`;

export const FormError = styled.div`
  color: ${tokens.colors.danger};
  font-size: 0.875rem;
  margin-top: ${tokens.spacing.xs};
`;

export const SubmitError = styled(FormError)`
  font-size: 1rem;
  text-align: center;
  margin-top: ${tokens.spacing.md};
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  gap: ${tokens.spacing.md};
`;

export const FieldOutputContainer = styled.div`
  display: flex;
  width: 60%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

// ============================================================================
// LAYOUT
// ============================================================================

export const AppLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const AppRHS = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 220px;
  min-width: 0;
`;

export const PageContent = styled.div`
  display: flex;
  background: ${tokens.colors.white};
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing.xl};
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin-bottom: ${tokens.spacing.xl};
  padding-bottom: ${tokens.spacing.md};
  border-bottom: 2px solid ${tokens.colors.gray[200]};
`;

export const SplitLayout = styled.div`
  display: flex;
  width: 100%;
  max-width: 1400px;
  gap: ${tokens.spacing.xl};
  height: 100%;
`;

export const LeftColumn = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  max-width: 65%;
`;

export const RightColumn = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  margin-left: ${tokens.spacing.xl};
  max-width: 35%;
`;

export const Row = styled.div`
  ${mixins.flexCenter}
  flex-direction: row;
  padding: 0;
  margin: 0;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AppRow = styled(Row)``;

export const CompWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 98%;
  height: 100%;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 ${tokens.spacing.md} 0;
  color: ${tokens.colors.gray[800]};
  font-size: 1.125rem;
  border-bottom: 2px solid ${tokens.colors.primary};
  padding-bottom: ${tokens.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DetailRow = styled.div`
  display: flex;
  margin-bottom: ${tokens.spacing.sm};
  align-items: flex-start;
`;

export const DetailLabel = styled.div`
  font-weight: 600;
  color: ${tokens.colors.gray[600]};
  min-width: 120px;
  margin-right: ${tokens.spacing.sm};
`;

export const DetailValue = styled.div`
  color: ${tokens.colors.gray[800]};
  flex: 1;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: ${tokens.spacing.sm};
  justify-content: flex-end;
  margin-top: ${tokens.spacing.xl};
`;

// ============================================================================
// MODALS
// ============================================================================

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: ${tokens.colors.white};
  border-radius: ${tokens.radius.xl};
  box-shadow: ${tokens.shadows.lg};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${tokens.spacing.xl};
  border-bottom: 1px solid ${tokens.colors.gray[200]};

  h2,
  h3 {
    margin: 0;
    color: ${tokens.colors.gray[800]};
  }
`;

export const ModalBody = styled.div`
  flex: 1;
  padding: ${tokens.spacing.xl};
  overflow-y: auto;
`;

// Legacy modal components
export const Overlay = styled(ModalOverlay)``;
export const ModalContainer = styled(ModalContent)`
  max-width: 1400px;
  width: 70%;
  max-height: 80%;
  border-radius: 15px;
  padding-bottom: 10px;
  padding-top: 10px;
`;
export const Content = styled.div`
  width: 90%;
`;

// ============================================================================
// TABLES
// ============================================================================

export const TableWrap = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  max-width: 100%;
  height: auto;
  padding: 0.2rem;
  box-shadow: ${tokens.shadows.lg};
  border-radius: ${tokens.radius.sm};
`;

export const Table = styled(DataTable)`
  max-width: 100%;

  .rdt_Table {
    background-color: ${tokens.colors.white};
  }

  .rdt_TableHeadRow {
    background-color: ${tokens.colors.gray[100]};
    font-weight: bold;
    height: 50px !important;
    min-height: 50px !important;
    max-height: 50px !important;
  }

  .rdt_TableRow {
    &:nth-of-type(odd) {
      background-color: ${tokens.colors.white};
    }
    &:nth-of-type(even) {
      background-color: ${tokens.colors.gray[100]};
    }
    &:hover {
      background-color: ${tokens.colors.primary}10 !important;
    }
  }

  .rdt_Pagination {
    background-color: ${tokens.colors.dark};
    color: ${tokens.colors.white};
  }
`;

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
  font-family: "Rubik", sans-serif;
  margin: 0;
  padding: 0;
`;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const Title = styled.h1`
  display: flex;
  font-size: 2vw;
  align-self: flex-start;
  margin: 0 0 ${tokens.spacing.xs} 0;
  padding: 0;
  height: 15%;
  font-family: "Rubik", sans-serif;
  font-weight: 700;
  color: ${tokens.colors.gray[800]};
`;

export const FieldName = styled.h3`
  margin: 0 ${tokens.spacing.sm} 0 0;
  padding: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${tokens.colors.gray[700]};
`;

export const Logo = styled.img`
  max-height: 20vh;
  object-fit: contain;
  margin-bottom: ${tokens.spacing.xl};
`;

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

export const Card = styled.div`
  background: ${tokens.colors.white};
  border-radius: ${tokens.radius.lg};
  box-shadow: ${tokens.shadows.sm};
  padding: ${tokens.spacing.xl};
`;

export const NoEventsMessage = styled.div`
  text-align: center;
  color: ${tokens.colors.gray[600]};
  font-style: italic;
  padding: ${tokens.spacing.xl};
`;

export const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
`;

export const EventItem = styled.div`
  border: 1px solid ${tokens.colors.gray[300]};
  border-radius: ${tokens.radius.md};
  padding: ${tokens.spacing.md};
  background: ${tokens.colors.gray[100]};
`;

export const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${tokens.spacing.sm};
`;

export const EventName = styled.div`
  font-weight: 600;
  color: ${tokens.colors.gray[800]};
  font-size: 1rem;
`;

export const EventTime = styled.div`
  background: ${tokens.colors.primary};
  color: ${tokens.colors.white};
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  border-radius: ${tokens.radius.sm};
  font-size: 0.875rem;
  font-weight: 600;
`;

export const EventDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.spacing.md};
`;

export const EventDetail = styled.div`
  font-size: 0.875rem;
  color: ${tokens.colors.gray[600]};
`;

// ============================================================================
// EXPORT DESIGN TOKENS FOR USE IN COMPONENTS
// ============================================================================

export { tokens, mixins };
