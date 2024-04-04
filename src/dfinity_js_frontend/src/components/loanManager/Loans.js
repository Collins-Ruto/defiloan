import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Loan from "./Loan";
import Loader from "../utils/Loader";
import { Row, Button } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getLoans as getLoanList,
  createLoan,
  payRequest,
  updateLoan,
  getActiveLoans,
  selectRequest,
  addRequest,
} from "../../utils/loanManager";
import AddLoan from "./AddLoan";
import {
  createBorrower,
  getBorrowerByOwner,
} from "../../utils/borrowerManager";
import AddBorrower from "../userManager/AddBorrower";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [borrower, setBorrower] = useState({});
  const [loading, setLoading] = useState(false);

  // function to get the list of loans
  const getLoans = useCallback(async () => {
    try {
      console.log("geter");
      setLoading(true);
      setLoans(await getLoanList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  // function to get borrower  loan
  const getBorrowerLoans = useCallback(async () => {
    try {
      console.log("geter");
      setLoading(true);
      setLoans(await getActiveLoans());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  // function to get the list of borrowers
  const getBorrowerOwner = useCallback(async () => {
    try {
      setLoading(true);
      getBorrowerByOwner().then((resp) => {
        setBorrower(resp.Ok);
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addLoan = async (data) => {
    console.log("adder");
    try {
      setLoading(true);
      createLoan(data).then((resp) => {
        getLoans();
        toast(<NotificationSuccess text="Loan added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a loan." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to payRequest book
  const payRequestFunc = async (loanId) => {
    try {
      setLoading(true);
      payRequest(loanId).then((resp) => {
        getLoans();
        toast(
          <NotificationSuccess text="Loan payRequest successfull, refresh to see new balance" />
        );
      });
    } catch (error) {
      console.log(
        "failed to payRequest loan, check that you have enough ICP tokens"
      );
      console.log(error);
      toast(
        <NotificationError text="Failed to payRequest loan. plese check that you have enough ICP tokens" />
      );
    } finally {
      setLoading(false);
    }
  };

  // addRequest
  const newRequest = async (loanId, description, amount) => {
    try {
      setLoading(true);
      const amountInt = parseInt(amount, 10) * 10 ** 8;
      addRequest(loanId, description, amountInt).then((resp) => {
        getLoans();
        toast(<NotificationSuccess text="Request added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add a request." />);
    } finally {
      setLoading(false);
    }
  };

  // selectRequest
  const requestSelect = async (requestId) => {
    try {
      setLoading(true);
      selectRequest(requestId).then((resp) => {
        getLoans();
        toast(<NotificationSuccess text="Request selected successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to select a request." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      data.amount = parseInt(data.amount, 10) * 10 ** 8;
      updateLoan(data).then((resp) => {
        getLoans();
        toast(<NotificationSuccess text="Loan update successfull." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to update a loan." />);
    } finally {
      setLoading(false);
    }
  };

  const addBorrower = async (data) => {
    try {
      setLoading(true);
      createBorrower(data).then((resp) => {
        getBorrowerOwner();
      });
      toast(<NotificationSuccess text="Borrower added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a borrower." />);
    } finally {
      setLoading(false);
    }
  };

  console.log(loans);

  useEffect(() => {
    getLoans();
    getBorrowerOwner();
  }, []);

  console.log(borrower);

  return (
    <>
      {!loading ? (
        !borrower?.name ? (
          <AddBorrower save={addBorrower} />
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">Loans</h1>
              {/* get borrower payRequestd loan */}
              <Button
                onClick={getBorrowerLoans}
                className="btn btn-primary-outline text"
              >
                active Loans
              </Button>
              <AddLoan save={addLoan} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {loans.map((_loan, index) => (
                <Loan
                  key={index}
                  loan={{
                    ..._loan,
                  }}
                  update={update}
                  selectRequest={requestSelect}
                  addRequest={newRequest}
                  payRequest={payRequestFunc}
                />
              ))}
            </Row>
          </div>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Loans;
