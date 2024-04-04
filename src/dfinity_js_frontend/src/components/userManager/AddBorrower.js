import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddBorrower = ({ save }) => {
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [collaterals, setCollaterals] = useState([]);
  const [skills, setSkills] = useState([]);

  const isFormFilled = () =>
    name && creditScore && email && address && imageUrl && collaterals;

  return (
    <>
      <div className="d-flex flex-column align-items-center mb-4 w-50">
        <h2>
          <Modal.Title>Create Borrower Profile</Modal.Title>
        </h2>
        <Form className="w-75 p-3">
          <Modal.Body className="w-100">
            <FloatingLabel
              controlId="inputName"
              label="Borrower name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter name of borrower"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputCreditScore"
              label="CreditScore"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="CreditScore"
                onChange={(e) => {
                  setCreditScore(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputEmail"
              label="Email"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputAddress"
              label="Address"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                placeholder="Address"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputImageUrl"
              label="Profile Picture"
              className="mb-3"
            >
              <Form.Control
                text="text"
                placeholder="Image Url"
                onChange={(e) => {
                  setImageUrl(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputSkills"
              label="Skills"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="comma separated skills"
                onChange={(e) => {
                  setSkills(e.target.value.split(","));
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputCollaterals"
              label="Collaterals"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="comma separated collaterals"
                onChange={(e) => {
                  setCollaterals(e.target.value.split(","));
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer className="align-self-end mr-4">
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                address,
                email,
                imageUrl,
                name,
                creditScore,
                skills,
                collaterals,
              });
            }}
          >
            Save borrower
          </Button>
        </Modal.Footer>
      </div>
    </>
  );
};

AddBorrower.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddBorrower;
