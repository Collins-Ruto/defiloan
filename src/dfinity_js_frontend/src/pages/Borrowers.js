import React, { useEffect, useState, useCallback } from "react";
import { login } from "../utils/auth";
import { Notification } from "../components/utils/Notifications";
import Borrowers from "../components/userManager/Borrowers";
import { getBorrowerByOwner } from "../utils/borrowerManager";
import Login from "./Login";
import SignBorrower from "../components/userManager/SignBorrower";
import Loader from "../components/utils/Loader";

const BorrowersPage = () => {
  const [borrower, setBorrower] = useState({});
  const [loading, setLoading] = useState(false);

  const isAuthenticated = window.auth.isAuthenticated;

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setBorrower(
        await getBorrowerByOwner().then(async (res) => {
          console.log(res);
          return res.Ok;
        })
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  });

  console.log("borrower", borrower);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        !loading ? (
          borrower?.name ? (
            <main>
              <Borrowers borrower={borrower} />
            </main>
          ) : (
            <SignBorrower fetchUser={fetchUser} />
          )
        ) : (
          <Loader />
        )
      ) : (
        <Login login={login} />
      )}
    </>
  );
};

export default BorrowersPage;
