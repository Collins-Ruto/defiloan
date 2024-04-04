import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createLoan(loan) {
  return window.canister.loanManager.addLoan(loan);
}

export async function updateLoan(loan) {
  return window.canister.loanManager.updateLoan(loan);
}

// loanstatus;
export async function loanstatus(loan) {
  return window.canister.loanManager.loanstatus(loan);
}

// selectRequest
export async function selectRequest(requestId) {
  return window.canister.loanManager.selectRequest(requestId);
}

// getRequests;
export async function getRequests() {
  return window.canister.loanManager.getRequests();
}

// getLoanRequests
export async function getLoanRequests(loanId) {
  return window.canister.loanManager.getLoanRequests(loanId);
}

// getRequest;
export async function getRequest(requestId) {
  return window.canister.loanManager.getRequest(requestId);
}

// addRequest
export async function addRequest(loanId, description, amount) {
  return window.canister.loanManager.addRequest(loanId, description, amount);
}

// getActiveLoans
export async function getActiveLoans() {
  try {
    return await window.canister.loanManager.getActiveLoans();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getLoans() {
  try {
    return await window.canister.loanManager.getLoans();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// getAddressFromPrincipal
export async function getAddressFromPrincipal(principal) {
  return await window.canister.loanManager.getAddressFromPrincipal(principal);
}

export async function payRequest(loanId) {
  const loanManagerCanister = window.canister.loanManager;
  const orderResponse = await loanManagerCanister.createPaymentPay(loanId);

  console.log(orderResponse);
  const borrowerPrincipal = Principal.from(orderResponse.Ok.borrower);
  const borrowerAddress = await loanManagerCanister.getAddressFromPrincipal(
    borrowerPrincipal
  );
  const block = await transferICP(
    borrowerAddress,
    orderResponse.Ok.price,
    orderResponse.Ok.memo
  );
  await loanManagerCanister.completePayment(
    borrowerPrincipal,
    loanId,
    orderResponse.Ok.price,
    block,
    orderResponse.Ok.memo
  );
}

export async function rePaymentRequest(loanId, amount) {
  const loanManagerCanister = window.canister.loanManager;
  const orderResponse = await loanManagerCanister.createRePayment(
    loanId,
    amount
  );

  console.log(orderResponse);
  const lenderPrincipal = Principal.from(orderResponse.Ok.lender);
  const lenderAddress = await loanManagerCanister.getAddressFromPrincipal(
    lenderPrincipal
  );
  const block = await transferICP(
    lenderAddress,
    orderResponse.Ok.price,
    orderResponse.Ok.memo
  );
  await loanManagerCanister.completeRePayment(
    lenderPrincipal,
    loanId,
    orderResponse.Ok.price,
    block,
    orderResponse.Ok.memo
  );
}

// add savings
export async function addSavings(lenderId, amount) {
  const loanManagerCanister = window.canister.loanManager;
  const orderResponse = await loanManagerCanister.createSavings(
    lenderId,
    amount
  );

  console.log(orderResponse);
  const lenderPrincipal = Principal.from(orderResponse.Ok.lender);
  const lenderAddress = await loanManagerCanister.getAddressFromPrincipal(
    lenderPrincipal
  );
  const block = await transferICP(
    lenderAddress,
    orderResponse.Ok.price,
    orderResponse.Ok.memo
  );
  await loanManagerCanister.completeSaving(
    lenderPrincipal,
    lenderId,
    orderResponse.Ok.price,
    block,
    orderResponse.Ok.memo
  );
}
