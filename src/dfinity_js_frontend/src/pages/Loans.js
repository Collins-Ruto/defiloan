import React from "react";
import { login } from "../utils/auth";
import Loans from "../components/loanManager/Loans";
import Cover from "../components/utils/Cover";
import coverImg from "../assets/img/cover.jpg";
import { Notification } from "../components/utils/Notifications";

const LoansPage = () => {
  const isAuthenticated = window.auth.isAuthenticated;

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        <div fluid="md" className="bg-grey-800">
          <main>
            <Loans />
          </main>
        </div>
      ) : (
        <Cover name="Street Food" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default LoansPage;
