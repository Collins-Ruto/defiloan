import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddSavings = ({ save, lenders }) => {
  const [amount, setAmount] = useState("");
  const [lenderId, setLenderId] = useState("");

  const isFormFilled = () => amount;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button onClick={handleShow} className="btn btn-outline-success">
        <i className="bi bi-plus "></i> Add Saving
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Savings</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputAmount"
              label="Amount"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="amount"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="isTokenized"
              label="Lender"
              className="mb-3 w-[70%]"
            >
              <select
                onChange={(e) => {
                  setLenderId(e.target.value);
                }}
                className="form-select w-full"
                aria-label="Default select example"
              >
                <option defaultValue="">select</option>
                {lenders.map((lender, index) => (
                  <option key={index} value={lender.id}>
                    {lender.name}
                  </option>
                ))}
              </select>
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
              save(lenderId, amount);
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

AddSavings.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddSavings;
