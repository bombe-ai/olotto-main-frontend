import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const DeleteAccountTab = () => {
  const navigate = useNavigate();

  const [creds, setCreds] = useState<Record<string, string>>({
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string | boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreds(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false, mismatch: false }));
  };

  const validate = () => {
    const newErrors: Record<string, string | boolean> = {};
    if (!creds.mobile.trim()) newErrors.mobile = 'Mobile number is required.';
    if (!creds.password.trim()) newErrors.password = 'Password is required.';
    if (!creds.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password.';
    if (creds.password && creds.confirmPassword && creds.password !== creds.confirmPassword) {
      newErrors.mismatch = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setModalOpen(true);
    }
  };

  const confirmDelete = () => {
    setModalOpen(false);
    // perform delete logic
  };

  return (
    <Form className="delete-account-form d-flex flex-column" onSubmit={handleSubmit}>
      <div className="d-flex align-items-center gap-3 d-lg-none mb-4">
        <Button className="back-btn cta-btn cta-btn--text" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <h2 className="fieldset-legend">Delete Account</h2>
      </div>

      <FormGroup>
        <Label for="mobile">
          Enter Mobile Number <span className="text-danger">*</span>
        </Label>
        <Input
          id="mobile"
          name="mobile"
          type="tel"
          placeholder="Enter your mobile number"
          value={creds.mobile}
          onChange={handleChange}
          invalid={!!errors.mobile}
        />
      </FormGroup>

      <FormGroup>
        <Label for="password">
          Enter Password <span className="text-danger">*</span>
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={creds.password}
          onChange={handleChange}
          invalid={!!errors.password}
        />
      </FormGroup>

      <FormGroup>
        <Label for="confirmPassword">
          Confirm Password <span className="text-danger">*</span>
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter password"
          value={creds.confirmPassword}
          onChange={handleChange}
          invalid={!!errors.confirmPassword || !!errors.mismatch}
        />
      </FormGroup>

      <footer className="d-flex flex-column gap-3 mt-4">
        <Button type="submit" className="submit-btn cta-btn cta-btn--primary align-self-center" onClick={() => setModalOpen(true)}>
          Delete Account
        </Button>
      </footer>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} centered className="delete-account-modal">
        <ModalBody>Are you sure you want to delete your account?</ModalBody>
        <ModalFooter className="d-flex justify-content-end gap-3">
          <Button className="cta-btn cta-btn--secondary" onClick={() => setModalOpen(false)}>
            No
          </Button>
          <Button className="cta-btn cta-btn--primary" onClick={confirmDelete}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </Form>
  );
};

export default DeleteAccountTab;
