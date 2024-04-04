import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import UpdateLoan from "./UpdateLoan";
import AddRequest from "./AddRequest";
import SelectRequest from "./SelectRequest";

const Loan = ({ loan, update, selectRequest, addRequest, payRequest }) => {
  const {
    id,
    title,
    description,
    category,
    createdDate,
    terms,
    updatedAt,
    borrower,
    lender,
    status,
    dueDate,
    amount,
  } = loan;

  const intAmount = Number(amount / BigInt(10 ** 8));

  console.log(loan);

  const principal = window.auth.principalText;
  const isBorrowersLoan = Principal.from(loan.borrower).toText() === principal;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <span className="font-monospace text-secondary">
            {Principal.from(borrower).toText()}
          </span>
          <div className="d-flex align-items-center gap-2">
            <Badge bg="secondary" className="ms-auto">
              Amount: {intAmount} ICP
            </Badge>
            <Badge bg="secondary" className="ms-auto">
              {status}
            </Badge>
            {isBorrowersLoan ? (
              <>
                <UpdateLoan loan={loan} save={update} />
                {lender.length > 0 ? (
                  <Button
                    onClick={() => {
                      payRequest(id);
                    }}
                  >
                    PayOut
                  </Button>
                ) : (
                  <SelectRequest loan={loan} save={selectRequest} />
                )}
              </>
            ) : (
              <AddRequest loanId={id} save={addRequest} />
            )}
          </div>
        </Card.Header>

        <Card.Body className="d-flex  flex-column ">
          <Card.Title>{title}</Card.Title>
          <Card.Text className="flex-grow-1 ">
            description: {description}
          </Card.Text>
          <Card.Text className="flex-grow-1 ">Type: {category}</Card.Text>
          <Card.Text className="flex-grow-1 ">date: {createdDate}</Card.Text>
          <Card.Text className="flex-grow-1 ">dueDate: {dueDate}</Card.Text>
          <Card.Text className="flex-grow-1 ">terms: {terms}</Card.Text>
          {lender && (
            <Card.Text className="flex-grow-1 ">lender: {lender}</Card.Text>
          )}
          <Card.Text className="flex-grow-1">updatedAt: {updatedAt}</Card.Text>
          <Card.Text className="flex-grow-1">Id: {id}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

Loan.propTypes = {
  loan: PropTypes.instanceOf(Object).isRequired,
};

export default Loan;
