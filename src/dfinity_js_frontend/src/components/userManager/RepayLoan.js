import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { Button as BButton } from "../";

const RepayLoan = ({ loan, save }) => {
  const [amount, setAmount] = useState("");

  const isFormFilled = () => amount;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <BButton
        onClick={handleShow}
        color="pink_300"
        size="2xl"
        className="min-w-[146px] rounded-[21px] font-bold sm:px-5"
      >
        Repay Loan
      </BButton>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Loan repayment</Modal.Title>
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
              save(loan.id, amount);
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

RepayLoan.propTypes = {
  save: PropTypes.func.isRequired,
};

export default RepayLoan;
