import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { Button as BButton } from "../";

const ApproveLoan = ({ loan, save }) => {
  const [duration, setDuration] = useState("");
  const [terms, setTerms] = useState("");

  const isFormFilled = () => terms && duration;

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
        Approve
      </BButton>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Approve Loanr</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputDuration"
              label="Duration"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="duration"
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputTerms"
              label="Terms"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setTerms(e.target.value);
                }}
                placeholder="Terms"
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
                terms,
                duration,
                status: "approved",
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

ApproveLoan.propTypes = {
  save: PropTypes.func.isRequired,
};

export default ApproveLoan;
