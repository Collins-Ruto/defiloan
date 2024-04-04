import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddRequest = ({ loanId, save }) => {
  const [amount, setAmount] = useState([]);
  const [description, setDescription] = useState("");

  const isFormFilled = () => description && amount;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        className="btn btn-outline-success text-white"
      >
        <i className="bi bi-plus "></i> Request
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Request</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputAmount"
              label="Amount"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder=" amount"
                onChange={(e) => {
                  setAmount(e.target.value.split(","));
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Description"
                onChange={(e) => {
                  setDescription(e.target.value);
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
              save(loanId, description, amount);
              handleClose();
            }}
          >
            Save request
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddRequest.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddRequest;
