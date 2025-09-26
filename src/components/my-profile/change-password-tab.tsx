import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { translate } from "react-jhipster";

import { useAppDispatch, useAppSelector } from "@/app/config/store";
import {
  reset,
  savePassword,
} from "@modules/account/password/password.reducer";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [creds, setCreds] = useState<Record<string, string>>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string | boolean>>({});

  // Redux state from JHipster password reducer
  const loading = useAppSelector((state) => state.password.loading);
  const successMessage = useAppSelector(
    (state) => state.password.successMessage
  );
  const errorMessage = useAppSelector((state) => state.password.errorMessage);

  const requiredFields = ["oldPassword", "newPassword", "confirmPassword"];

  // Handle success/error messages from JHipster
  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
      // Reset form on success
      setCreds({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } else if (errorMessage) {
      toast.error(translate(errorMessage));
    }

    // Clean up messages
    if (successMessage || errorMessage) {
      dispatch(reset());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreds((prev) => ({ ...prev, [name]: value }));
    // clear error for this field on change
    setErrors((prev) => ({ ...prev, [name]: false, mismatch: false }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string | boolean> = {};

    requiredFields.forEach((key) => {
      if (!creds[key]?.trim()) {
        newErrors[key] = `${
          key === "confirmPassword"
            ? "Please confirm your password."
            : key === "oldPassword"
            ? "Old password is required."
            : "New password is required."
        }`;
      }
    });

    // Add JHipster password validation rules
    if (creds.newPassword && creds.newPassword.length < 4) {
      newErrors.newPassword = "Password must be at least 4 characters long.";
    }

    if (creds.newPassword && creds.newPassword.length > 50) {
      newErrors.newPassword = "Password must not exceed 50 characters.";
    }

    if (
      creds.newPassword &&
      creds.confirmPassword &&
      creds.newPassword !== creds.confirmPassword
    ) {
      newErrors.mismatch = "Passwords do not match.";
    }

    setErrors(newErrors);

    // If no errors, dispatch JHipster savePassword action
    if (Object.keys(newErrors).length === 0) {
      dispatch(
        savePassword({
          currentPassword: creds.oldPassword,
          newPassword: creds.newPassword,
        })
      );
    }
  };

  return (
    <Form
      className="change-password-form d-flex flex-column"
      onSubmit={handleSubmit}
    >
      <div className="d-flex align-items-center gap-3 d-lg-none mb-4">
        <Button
          className="back-btn cta-btn cta-btn--text"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <h2 className="fieldset-legend">Change Password</h2>
      </div>

      <FormGroup>
        <Label for="oldPassword">
          Old Password <span className="text-danger">*</span>
        </Label>
        <Input
          id="oldPassword"
          name="oldPassword"
          type="password"
          placeholder="Enter old password"
          value={creds.oldPassword}
          onChange={handleChange}
          invalid={!!errors.oldPassword}
          disabled={loading}
        />
        {errors.oldPassword && (
          <FormFeedback>{errors.oldPassword}</FormFeedback>
        )}
      </FormGroup>

      <FormGroup>
        <Label for="newPassword">
          New Password <span className="text-danger">*</span>
        </Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="Enter new password"
          value={creds.newPassword}
          onChange={handleChange}
          invalid={!!errors.newPassword}
          disabled={loading}
        />
        {errors.newPassword && (
          <FormFeedback>{errors.newPassword}</FormFeedback>
        )}
        <small className="text-muted">
          Password must be 4-50 characters long.
        </small>
      </FormGroup>

      <FormGroup>
        <Label for="confirmPassword">
          Confirm Password <span className="text-danger">*</span>
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter new password"
          value={creds.confirmPassword}
          onChange={handleChange}
          invalid={!!errors.confirmPassword || !!errors.mismatch}
          disabled={loading}
        />
        {(errors.confirmPassword || errors.mismatch) && (
          <FormFeedback>
            {errors.confirmPassword || errors.mismatch}
          </FormFeedback>
        )}
      </FormGroup>

      <footer className="d-flex flex-column gap-3 mt-4">
        <Button
          type="submit"
          className="submit-btn cta-btn cta-btn--primary align-self-center"
          disabled={loading}
        >
          {loading ? "Changing Password..." : "Confirm"}
        </Button>
      </footer>
    </Form>
  );
};

export default ChangePassword;
