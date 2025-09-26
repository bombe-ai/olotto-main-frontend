import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
  FormFeedback,
  Spinner,
} from "reactstrap";
import PhoneInput from "react-phone-number-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { useAppSelector } from "@/app/config/store";
import "react-phone-number-input/style.css";

interface UserCredState {
  userExtraId: number | null;
  userId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  gender: string;
  phone: string;
  address: string;
  state: string;
  country: string;
  city: string;
  zip: string;
}

interface ProfileTabProps {
  userId?: number;
}

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "nationality",
  "phone",
  "state",
  "country",
  "city",
  "zip",
] as const;

const INITIAL_USER_STATE: UserCredState = {
  userExtraId: null,
  userId: null,
  firstName: "",
  lastName: "",
  email: "",
  nationality: "",
  gender: "",
  phone: "",
  address: "",
  state: "",
  country: "",
  city: "",
  zip: "",
};

const ProfileTab = ({ userId }: ProfileTabProps) => {
  const navigate = useNavigate();
  const account = useAppSelector((state) => state.authentication.account);
  const effectiveUserId = userId || account?.id;
  const [loading, setLoading] = useState(false);
  const [userCred, setUserCred] = useState<UserCredState>(INITIAL_USER_STATE);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const loadUserProfile = useCallback(async () => {
    if (!effectiveUserId) {
      console.error("No userId available!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/user-extras/user/${effectiveUserId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        }
      );

      const data = response.data;
      setUserCred({
        userExtraId: data.id,
        userId: data.user?.id || null,
        firstName: data.user?.firstName || "",
        lastName: data.user?.lastName || "",
        email: data.user?.email || "",
        nationality: data.nationality || "",
        gender: data.gender || "",
        phone: data.phoneNumber || "",
        address: data.address || "",
        state: data.stateProvince || "",
        country: data.country || "",
        city: data.cityTown || "",
        zip: data.zipPostalCode || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to load profile", err);
      alert("Failed to load profile.");
      setLoading(false);
    }
  }, [effectiveUserId]);

  const validateForm = (): Record<string, boolean> => {
    const newErrors: Record<string, boolean> = {};

    REQUIRED_FIELDS.forEach((field) => {
      const value = userCred[field as keyof UserCredState];
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        newErrors[field] = true;
      }
    });

    return newErrors;
  };

  const updateProfile = async () => {
    const payload = {
      id: userCred.userExtraId,
      gender: userCred.gender,
      nationality: userCred.nationality,
      address: userCred.address,
      stateProvince: userCred.state,
      country: userCred.country,
      cityTown: userCred.city,
      zipPostalCode: userCred.zip,
      phoneNumber: userCred.phone,
      username: `${userCred.firstName}${userCred.lastName}`.toLowerCase(),
      user: {
        id: userCred.userId,
        email: userCred.email,
        firstName: userCred.firstName,
        lastName: userCred.lastName,
      },
    };

    try {
      await axios.put(`/api/user-extras/${userCred.userExtraId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserCred((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setUserCred((prev) => ({ ...prev, phone: value || "" }));

    if (value) {
      setErrors((prev) => ({ ...prev, phone: false }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      await updateProfile();
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  if (loading) {
    return (
      <Spinner color="success" className="mx-auto">
        Loading...
      </Spinner>
    );
  }

  return (
    <Form
      className="personal-info-form d-flex flex-column gap-2"
      onSubmit={handleSubmit}
    >
      <div className="d-flex align-items-center gap-3">
        <Button
          className="back-btn cta-btn cta-btn--text d-lg-none"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <h2 className="fieldset-legend">Personal Details</h2>
      </div>

      <Row className="mt-4">
        <Col lg={6}>
          <div className="d-flex flex-column gap-2">
            <FormGroup>
              <Label for="firstName">
                First Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={userCred.firstName}
                onChange={handleChange}
                invalid={errors.firstName}
              />
              <FormFeedback>First Name is required.</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="lastName">
                Last Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={userCred.lastName}
                onChange={handleChange}
                invalid={errors.lastName}
              />
              <FormFeedback>Last Name is required.</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="email">
                Email <span className="text-danger">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={userCred.email}
                onChange={handleChange}
                invalid={errors.email}
              />
              <FormFeedback>Email is required.</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="nationality">
                Nationality <span className="text-danger">*</span>
              </Label>
              <Input
                id="nationality"
                name="nationality"
                placeholder="Enter your nationality"
                value={userCred.nationality}
                onChange={handleChange}
                invalid={errors.nationality}
              />
              <FormFeedback>Nationality is required.</FormFeedback>
            </FormGroup>
          </div>
        </Col>

        <Col lg={6}>
          <div className="d-flex flex-column gap-2">
            <FormGroup>
              <Label for="gender">Gender</Label>
              <Input
                id="gender"
                name="gender"
                type="select"
                value={userCred.gender}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="phone">
                Mobile Number <span className="text-danger">*</span>
              </Label>
              <PhoneInput
                international
                defaultCountry="IN"
                value={userCred.phone}
                onChange={handlePhoneChange}
                className={`phone-input ${errors.phone ? "is-invalid" : ""}`}
              />
              {errors.phone && (
                <div className="invalid-feedback d-block">
                  Phone number is required.
                </div>
              )}
            </FormGroup>
          </div>
        </Col>
      </Row>

      <h2 className="fieldset-legend">Home Address</h2>

      <Row className="mt-4">
        <Col lg={6}>
          <FormGroup>
            <Label for="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Enter your address"
              value={userCred.address}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="state">
              State/Province <span className="text-danger">*</span>
            </Label>
            <Input
              id="state"
              name="state"
              placeholder="Enter state or province"
              value={userCred.state}
              onChange={handleChange}
              invalid={errors.state}
            />
            <FormFeedback>State/Province is required.</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="country">
              Country <span className="text-danger">*</span>
            </Label>
            <Input
              id="country"
              name="country"
              placeholder="Enter your country"
              value={userCred.country}
              onChange={handleChange}
              invalid={errors.country}
            />
            <FormFeedback>Country is required.</FormFeedback>
          </FormGroup>
        </Col>

        <Col lg={6}>
          <FormGroup>
            <Label for="city">
              City/Town <span className="text-danger">*</span>
            </Label>
            <Input
              id="city"
              name="city"
              placeholder="Enter your city or town"
              value={userCred.city}
              onChange={handleChange}
              invalid={errors.city}
            />
            <FormFeedback>City/Town is required.</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="zip">
              Zip/Postal Code <span className="text-danger">*</span>
            </Label>
            <Input
              id="zip"
              name="zip"
              placeholder="Enter zip or postal code"
              value={userCred.zip}
              onChange={handleChange}
              invalid={errors.zip}
            />
            <FormFeedback>Zip/Postal Code is required.</FormFeedback>
          </FormGroup>
        </Col>
      </Row>

      <footer className="d-flex flex-column gap-3 mt-4">
        <Button
          type="submit"
          className="submit-btn cta-btn cta-btn--primary align-self-center"
        >
          Save Changes
        </Button>
      </footer>
    </Form>
  );
};

export default ProfileTab;
