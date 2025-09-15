import React, { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  StyledForm,
  StyledButton,
  CancelButton,
  FieldOutputContainer,
  FieldLabel,
  SubmitError,
  StyledInput,
} from "../../styles/design-system";
import "typeface-nunito";
import { authApi } from "../../api";

const ForgotPasswordForm = ({ off }) => {
  const [step, setStep] = useState("request"); // "request", "verify", "reset"
  const [userData, setUserData] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const requestInitialValues = {
    prsn_first_nm: "",
    prsn_last_nm: "",
    prsn_email: "",
  };

  const resetInitialValues = {
    new_password: "",
    confirmPassword: "",
  };

  const requestValidationSchema = Yup.object().shape({
    prsn_first_nm: Yup.string().required("First name is required"),
    prsn_last_nm: Yup.string().required("Last Name is required"),
    prsn_email: Yup.string()
      .email("Invalid Email")
      .required("Email is required"),
  });

  const resetValidationSchema = Yup.object().shape({
    new_password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@$!%*?&)"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("new_password")], "Passwords must match")
      .required("Password is required"),
  });

  const handleRequestOTP = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      await authApi.requestOTP(values);
      setUserData(values);
      setStep("verify");
      setSubmitting(false);
    } catch (error) {
      setErrors({ submit: error.message });
      console.error(error.message);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpError(""); // Clear previous errors
    try {
      await authApi.verifyOTP({ ...userData, otp });
      setStep("reset");
    } catch (error) {
      console.error(error.message);
      setOtpError(error.message);
      console.error("OTP verification failed:", error.message);
    }
  };

  const handleResetPassword = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      await authApi.resetPassword({
        ...userData,
        otp,
        new_password: values.new_password,
      });
      alert("Password reset successfully!");
      setSubmitting(false);
      off();
    } catch (error) {
      setErrors({ submit: error.message });
      console.error(error.message);
    }
  };

  return (
    <>
      <h2>Reset Your Password</h2>

      {step === "request" && (
        <>
          <p>Enter your information to request a password reset code</p>
          <Formik
            initialValues={requestInitialValues}
            validationSchema={requestValidationSchema}
            onSubmit={handleRequestOTP}
          >
            {({ handleSubmit, isSubmitting, errors }) => (
              <StyledForm onSubmit={handleSubmit}>
                <Field name="prsn_first_nm">
                  {({ field }) => (
                    <FieldOutputContainer>
                      <FieldLabel>First Name: </FieldLabel>
                      <StyledInput
                        type="text"
                        placeholder="Ex: Ryan"
                        {...field}
                      />
                    </FieldOutputContainer>
                  )}
                </Field>
                <ErrorMessage name="prsn_first_nm" component={SubmitError} />

                <Field name="prsn_last_nm">
                  {({ field }) => (
                    <FieldOutputContainer>
                      <FieldLabel>Last Name: </FieldLabel>
                      <StyledInput
                        type="text"
                        placeholder="Ex: Crouser"
                        {...field}
                      />
                    </FieldOutputContainer>
                  )}
                </Field>
                <ErrorMessage name="prsn_last_nm" component={SubmitError} />

                <Field name="prsn_email">
                  {({ field }) => (
                    <FieldOutputContainer>
                      <FieldLabel>Email: </FieldLabel>
                      <StyledInput type="text" placeholder="Email" {...field} />
                    </FieldOutputContainer>
                  )}
                </Field>
                <ErrorMessage name="prsn_email" component={SubmitError} />

                <StyledButton type="submit" disabled={isSubmitting}>
                  Request Reset Code
                </StyledButton>
                {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
              </StyledForm>
            )}
          </Formik>
        </>
      )}

      {step === "verify" && (
        <>
          <p>Enter the 6-digit code sent to your email</p>
          <div style={{ marginBottom: "20px" }}>
            <FieldOutputContainer>
              <FieldLabel>Verification Code: </FieldLabel>
              <StyledInput
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </FieldOutputContainer>
            {otpError && <SubmitError>{otpError}</SubmitError>}
          </div>
          <StyledButton onClick={handleVerifyOTP} disabled={otp.length !== 6}>
            Verify Code
          </StyledButton>
        </>
      )}

      {step === "reset" && (
        <>
          <p>Enter your new password</p>
          <Formik
            initialValues={resetInitialValues}
            validationSchema={resetValidationSchema}
            onSubmit={handleResetPassword}
          >
            {({ handleSubmit, isSubmitting, errors }) => (
              <StyledForm onSubmit={handleSubmit}>
                <Field name="new_password">
                  {({ field }) => (
                    <FieldOutputContainer>
                      <FieldLabel>New Password: </FieldLabel>
                      <StyledInput
                        type="password"
                        placeholder="At least 8 Characters"
                        {...field}
                      />
                    </FieldOutputContainer>
                  )}
                </Field>
                <ErrorMessage name="new_password" component={SubmitError} />

                <Field name="confirmPassword">
                  {({ field }) => (
                    <FieldOutputContainer>
                      <FieldLabel>Confirm New Password: </FieldLabel>
                      <StyledInput
                        type="password"
                        placeholder="ConfirmPassword"
                        {...field}
                      />
                    </FieldOutputContainer>
                  )}
                </Field>
                <ErrorMessage name="confirmPassword" component={SubmitError} />

                <StyledButton type="submit" disabled={isSubmitting}>
                  Reset Password
                </StyledButton>
                {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
              </StyledForm>
            )}
          </Formik>
        </>
      )}

      <div style={{ marginTop: "20px" }}>
        <CancelButton onClick={off}>Back to Login</CancelButton>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
