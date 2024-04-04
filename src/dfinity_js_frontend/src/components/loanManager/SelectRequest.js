import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form } from "react-bootstrap";
import { getLoanRequests } from "../../utils/loanManager";
import Loader from "../utils/Loader";

function SelectRequest({ loan, save }) {
  const [show, setShow] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id, title } = loan;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // fetch all requests to requests
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setRequests(await getLoanRequests(id));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  console.log(requests, "requests");

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Button onClick={handleShow} className="btn btn-outline-info">
            Requests
          </Button>
          <Modal
            size="lg"
            className="w-[50%]"
            show={show}
            onHide={handleClose}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Requests for {title}</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Lender</th>
                      <th scope="col">Description</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request, index) => (
                      <TableRow
                        key={index}
                        request={request}
                        save={save}
                        handleClose={handleClose}
                      />
                    ))}
                  </tbody>
                </table>
              </Modal.Body>
            </Form>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

SelectRequest.propTypes = {
  loan: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
};

function TableRow({ request, save, handleClose }) {
  return (
    <tr>
      <td>{request.lender}</td>
      <td>{request.description}</td>
      <td>{Number(request.amount) / 10 ** 8} ICP</td>
      <td>
        <Button
          variant="dark"
          onClick={() => {
            save(request.id);
            handleClose();
          }}
        >
          Select Request
        </Button>
      </td>
    </tr>
  );
}

export default SelectRequest;
