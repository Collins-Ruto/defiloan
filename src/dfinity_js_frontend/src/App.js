import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BorrowersPage from "./pages/Borrowers";
import LoansPage from "./pages/Loans";
import "./App.css";
import "./styles/font.css"
import "./styles/index.css";
import "./styles/tailwind.css";

import { Notification } from "./components/utils/Notifications";
import LendersPage from "./pages/Lender";

const App = function AppWrapper() {
  return (
    <>
      <Notification />
      <Router>
        <Routes>
          <Route exact path="/" element={<LoansPage />} />
          <Route path="/borrowers" element={<BorrowersPage />} />
          <Route path="/lenders" element={<LendersPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
