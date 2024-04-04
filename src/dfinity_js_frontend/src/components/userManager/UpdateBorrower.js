import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateBorrower = ({ borrower, save }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [address, setAddress] = useState("");

  const isFormFilled = () => name && address && creditScore && email;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        onClick={handleShow}
        className="btn btn-outline-warning rounded-pill"
        style={{ width: "11rem" }}
      >
        <i className="bi bi-pencil-square "></i> Update Profile
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Borrower</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
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
                type="number"
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
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                id: borrower.id,
                name,
                creditScore,
                email,
                address,
              });
              handleClose();
            }}
          >
            Save Updates
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateBorrower.propTypes = {
  save: PropTypes.func.isRequired,
};

export default UpdateBorrower;
