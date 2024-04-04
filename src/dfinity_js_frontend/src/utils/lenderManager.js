export async function createLender(lender) {
  return window.canister.loanManager.addLender(lender);
}

export async function updateLender(lender) {
  return window.canister.loanManager.updateLender(lender);
}

// getLenderPendingLoans
export async function getLenderPendingLoans(id) {
  try {
    return await window.canister.loanManager.getLenderLoanRequest(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// approveLoan
export async function approveLoan(loan) {
  return window.canister.loanManager.approveLoan(loan);
}

// getLenderActiveLoans
export async function getLenderActiveLoans(id) {
  try {
    return await window.canister.loanManager.getLenderActiveLoans(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// getLenderCompletedLoans
export async function getLenderCompletedLoans(id) {
  try {
    return await window.canister.loanManager.getLenderCompletedLoans(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getLenderByOwner() {
  try {
    return await window.canister.loanManager.getLenderByOwner();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getLenders() {
  try {
    return await window.canister.loanManager.getLenders();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
