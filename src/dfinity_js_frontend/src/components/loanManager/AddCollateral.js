import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddCollateral = ({ save }) => {
  const [value, setValue] = useState("");
  const [assetType, setAssetType] = useState("");

  const isFormFilled = () => assetType && value;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button onClick={handleShow} className="btn btn-outline-success">
        <i className="bi bi-plus "></i> Add Collateral
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Collateral</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputValue"
              label="Value"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder=" value"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputAssetType"
              label="AssetType"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="AssetType"
                onChange={(e) => {
                  setAssetType(e.target.value);
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
              save({ assetType, value });
              handleClose();
            }}
          >
            Save collateral
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddCollateral.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddCollateral;
