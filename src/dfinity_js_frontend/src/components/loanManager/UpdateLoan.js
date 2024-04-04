import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateLoan = ({ loan, save }) => {
  const [description, setDescription] = useState("");
  const [terms, setTerms] = useState("");
  const [cover, setCover] = useState("");
  const [amount, setAmount] = useState(0);
  const isFormFilled = () => terms && cover && description && amount;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        onClick={handleShow}
        className="btn btn-outline-warning rounded-pill"
        style={{ width: "8rem" }}
      >
        Update
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Loan</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputcover"
              label="cover"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="cover"
                onChange={(e) => {
                  setCover(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="terms"
              label="Media type"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="cover"
                onChange={(e) => {
                  setTerms(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputAmount"
              label="amount"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="amount"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
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
                id: loan.id,
                description,
                terms,
                cover,
                amount,
              });
              handleClose();
            }}
          >
            Save loan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateLoan.propTypes = {
  save: PropTypes.func.isRequired,
};

export default UpdateLoan;
