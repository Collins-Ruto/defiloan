import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Stack, Badge } from "react-bootstrap";
import { Principal } from "@dfinity/principal";

const Borrower = ({ borrower }) => {
  const { id, name, skills, email, creditScore, principal, imageUrl } =
    borrower;

  const borrowerPrincipal = window.auth.principalText;

  console.log(borrower);

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Body className="d-flex  flex-column text-start">
          <Stack className="d-flex flex-row justify-content-between align-items-center gap-2">
            <img
              src={imageUrl}
              alt={name}
              className="img-circle"
              style={{ objectFit: "cover" }}
              width="80"
              height="80"
            />
            <Card.Title>Name: {name}</Card.Title>
          </Stack>
          <Card.Text>Id: {id}</Card.Text>
          <Card.Text className="flex-grow-1 ">Email: {email}</Card.Text>
          <Card.Text className="flex-grow-1 ">
            CreditScore: {creditScore}
          </Card.Text>
          <Card.Text className="flex-grow-1 ">
            Principal: {Principal.from(principal).toText()}
          </Card.Text>
          <Card.Text className="flex-grow-1 ">
            Skills:{" "}
            {/* {skills.map((skill, index) => {
              return (
                <Badge key={index} bg="secondary" className="ms-auto">
                  {skill}
                </Badge>
              );
            })} */}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

Borrower.propTypes = {
  borrower: PropTypes.instanceOf(Object).isRequired,
};

export default Borrower;
