import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

const Help = () => {
  const [supportMessage, setSupportMessage] = useState("");
  const navigate = useNavigate();

  return (
    <article className="help d-flex flex-column gap-5">
      <div className="d-flex align-items-center gap-3">
        <Button
          className="back-btn cta-btn cta-btn--text d-lg-none"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <h1>Help & Support</h1>
      </div>

      <Form
        className="d-flex flex-column gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <FormGroup>
          <Label for="supportMessage" hidden>
            Message
          </Label>
          <Input
            id="supportMessage"
            name="supportMessage"
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            placeholder="type your message here...."
            type="textarea"
            rows={10}
          />
        </FormGroup>
        <Button className="submit-btn cta-btn cta-btn--primary align-self-end">
          Submit
        </Button>
      </Form>
    </article>
  );
};

export default Help;
