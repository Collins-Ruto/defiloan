import React, { useEffect, useState, useCallback } from "react";
import { login } from "../utils/auth";
import { Notification } from "../components/utils/Notifications";
import Lenders from "../components/userManager/Lenders";
import { getLenderByOwner } from "../utils/lenderManager";
import Login from "./Login";
import SignLender from "../components/userManager/SignLender";
import Loader from "../components/utils/Loader";

const LendersPage = () => {
  const [lender, setLender] = useState({});
  const [loading, setLoading] = useState(false);

  const isAuthenticated = window.auth.isAuthenticated;

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setLender(
        await getLenderByOwner().then(async (res) => {
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

  console.log("lender", lender);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        !loading ? (
          lender?.name ? (
            <main>
              <Lenders lender={lender} />
            </main>
          ) : (
            <SignLender fetchUser={fetchUser} />
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

export default LendersPage;
