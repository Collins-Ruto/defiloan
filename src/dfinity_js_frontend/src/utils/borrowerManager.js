export async function createBorrower(borrower) {
  return window.canister.loanManager.addBorrower(borrower);
}

export async function updateBorrower(borrower) {
  return window.canister.loanManager.updateBorrower(borrower);
}

export async function followBorrower(borrowerId) {
  return window.canister.loanManager.followBorrower(borrowerId);
}

// addCollateral
export async function addCollateral(collateral) {
  return window.canister.loanManager.addCollateral(collateral);
}

// getBorrowerCollaterals
export async function getBorrowerCollaterals(id) {
  try {
    return await window.canister.loanManager.getBorrowerCollaterals(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// getBorrowerPendingLoans
export async function getBorrowerPendingLoans(id) {
  try {
    return await window.canister.loanManager.getBorrowerPendingLoans(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// getBorrowerActiveLoans
export async function getBorrowerActiveLoans(id) {
  try {
    return await window.canister.loanManager.getBorrowerActiveLoans(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// getBorrowerCompletedLoans
export async function getBorrowerCompletedLoans(id) {
  try {
    return await window.canister.loanManager.getBorrowerCompletedLoans(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getBorrowerByOwner() {
  try {
    return await window.canister.loanManager.getBorrowerByOwner();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getBorrowers() {
  try {
    return await window.canister.loanManager.getBorrowers();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
