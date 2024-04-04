import { request } from "@dfinity/agent/lib/cjs/canisterStatus";
import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  Ok,
  Err,
  ic,
  Opt,
  None,
  Some,
  Principal,
  Duration,
  nat64,
  bool,
  Result,
  Canister,
} from "azle";
import {
  Ledger,
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
} from "azle/canisters/ledger";
//@ts-ignore
import { hashCode } from "hashcode";
// Importing UUID v4 for generating unique identifiers
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

/**
 * This type represents an loan that can be listed on an loan manager.
 * It contains basic properties needed to define an loan.
 */

const Collateral = Record({
  id: text,
  owner: Principal,
  assetType: text,
  value: nat64,
  status: text,
});

const CollateralPayload = Record({
  assetType: text,
  value: nat64,
});

// Structure representing a borrower
const Borrower = Record({
  id: text,
  principal: Principal,
  name: text,
  email: text,
  creditScore: nat64,
  address: text,
  savings: nat64,
  imageUrl: text,
  loans: Vec(text),
  collaterals: Vec(text),
});

const Lender = Record({
  id: text,
  principal: Principal,
  name: text,
  email: text,
  interestRate: nat64,
  lenderGroup: text,
  address: text,
  imageUrl: text,
  loans: Vec(text),
});

const Loan = Record({
  id: text,
  title: text,
  description: text,
  category: text,
  status: text,
  borrower: Borrower,
  lender: Lender,
  amount: nat64,
  rePaid: nat64,
  terms: Opt(text),
  collateral: Collateral,
  interestRate: nat64,
  duration: text,
  guarantors: Vec(text),
  dueDate: Opt(text),
  createdDate: text,
  updatedAt: Opt(text),
});

// Payload structure for creating an loan
const LoanPayload = Record({
  title: text,
  description: text,
  lenderId: text,
  category: text,
  collateralId: text,
  guarantorId: text,
  amount: nat64,
  duration: text,
});

// Payload structure for updating an loan
const UpdateLoanPayload = Record({
  id: text,
  description: text,
});

const LoanLenderPayload = Record({
  id: text,
  terms: text,
  duration: text,
  status: text,
});

// Payload structure for creating a borrower
const BorrowerPayload = Record({
  name: text,
  email: text,
  address: text,
  imageUrl: text,
});

// Payload structure for updating a borrower
const UpdateBorrowerPayload = Record({
  id: text,
  name: text,
  email: text,
  creditScore: nat64,
  address: text,
  imageUrl: text,
});

const LenderPayload = Record({
  name: text,
  email: text,
  interestRate: nat64,
  lenderGroup: text,
  address: text,
  imageUrl: text,
});

const UpdateLenderPayload = Record({
  id: text,
  name: text,
  email: text,
  lenderGroup: nat64,
  address: text,
  imageUrl: text,
});

export const Paymentstatus = Variant({
  PaymentPending: text,
  Completed: text,
});

export const ReservePayment = Record({
  price: nat64,
  status: text,
  borrower: Principal,
  paid_at_block: Opt(nat64),
  memo: nat64,
});

export const ReserveRePayment = Record({
  price: nat64,
  status: text,
  lender: Principal,
  paid_at_block: Opt(nat64),
  memo: nat64,
});

export const ReserveSavings = Record({
  price: nat64,
  status: text,
  lender: Principal,
  paid_at_block: Opt(nat64),
  memo: nat64,
});

const Repayment = Record({
  id: text,
  loanId: text,
  amount: nat64,
  paidAt: text,
});

// Variant representing different error types
const ErrorType = Variant({
  NotFound: text,
  InvalidPayload: text,
  PaymentFailed: text,
  PaymentCompleted: text,
});

/**
 * `loansStorage` - a key-value data structure used to store loans by borrowers.
 * {@link StableBTreeMap} is a self-balancing tree that acts as durable data storage across canister upgrades.
 * For this contract, `StableBTreeMap` is chosen for the following reasons:
 * - `insert`, `get`, and `remove` operations have constant time complexity (O(1)).
 * - Data stored in the map survives canister upgrades, unlike using HashMap where data is lost after an upgrade.
 *
 * Breakdown of the `StableBTreeMap(text, Loan)` data structure:
 * - The key of the map is an `loanId`.
 * - The value in this map is an loan (`Loan`) related to a given key (`loanId`).
 *
 * Constructor values:
 * 1) 0 - memory id where to initialize a map.
 * 2) 16 - maximum size of the key in bytes.
 * 3) 1024 - maximum size of the value in bytes.
 * Values 2 and 3 are not used directly in the constructor but are utilized by the Azle compiler during compile time.
 */
const loansStorage = StableBTreeMap(0, text, Loan);
const lendersStorage = StableBTreeMap(1, text, Lender);
const borrowersStorage = StableBTreeMap(3, text, Borrower);
const pendingPayments = StableBTreeMap(4, nat64, ReservePayment);
const pendingRepayments = StableBTreeMap(9, nat64, ReserveRePayment);
const collateralStorage = StableBTreeMap(5, text, Collateral);
const repaymentStorage = StableBTreeMap(6, text, Repayment);
const persistedPayments = StableBTreeMap(7, Principal, ReservePayment);
const persistedRePayments = StableBTreeMap(8, Principal, ReserveRePayment);
const pendingSavings = StableBTreeMap(10, nat64, ReserveSavings);
const persistedSavings = StableBTreeMap(11, Principal, ReserveSavings);

const PAYMENT_RESERVATION_PERIOD = 120n; // reservation period in seconds

const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

// Exporting default Canister module
export default Canister({
  // Function to add an loan
  addLoan: update([LoanPayload], Result(Loan, ErrorType), (payload) => {
    // Check if the payload is a valid object
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ InvalidPayload: "invalid payload" });
    }

    // get borrower with the same principal
    const borrowerOpt = borrowersStorage.values().filter((borrower) => {
      return borrower.principal.toText() === ic.caller().toText();
    });

    // const guarantorOpt = borrowersStorage.get(payload.guarantorId);

    const borrower = borrowerOpt[0];
    // const guarantor = guarantorOpt.Some;

    const lenderOpt = lendersStorage.get(payload.lenderId);
    const lender = lenderOpt.Some;

    const collateralOpt = collateralStorage.get(payload.collateralId);
    const collateral = collateralOpt.Some;
    // Create an loan with a unique id generated using UUID v4
    const loan = {
      id: uuidv4(),
      status: "pending",
      borrower: borrower,
      createdDate: new Date().toISOString(),
      rePaid: 0n,
      lender: lender,
      interestRate: lender.interestRate,
      collateral,
      updatedAt: None,
      guarantors: [payload.guarantorId],
      dueDate: None,
      terms: None,
      ...payload,
    };

    const updatedBorrower = {
      ...borrower,
      loans: [...borrower.loans, loan.id],
    };
    borrowersStorage.insert(borrower.id, updatedBorrower);

    // Insert the loan into the loansStorage
    loansStorage.insert(loan.id, loan);
    return Ok(loan);
  }),

  // get all loans
  getLoans: query([], Vec(Loan), () => {
    return loansStorage.values();
  }),

  // Function get loan by id
  getLoan: query([text], Result(Loan, ErrorType), (id) => {
    const loanOpt = loansStorage.get(id);
    if ("None" in loanOpt) {
      return Err({ NotFound: `loan with id=${id} not found` });
    }
    return Ok(loanOpt.Some);
  }),

  // Function to update an loan
  updateLoan: update(
    [UpdateLoanPayload],
    Result(Loan, ErrorType),
    (payload) => {
      const loanOpt = loansStorage.get(payload.id);
      if ("None" in loanOpt) {
        return Err({ NotFound: `loan with id=${payload.id} not found` });
      }
      const loan = loanOpt.Some;
      const updatedLoan = {
        ...loan,
        ...payload,
      };
      loansStorage.insert(loan.id, updatedLoan);
      return Ok(updatedLoan);
    }
  ),

  // function for lender to approve loan
  approveLoan: update(
    [LoanLenderPayload],
    Result(Loan, ErrorType),
    (payload) => {
      const loanOpt = loansStorage.get(payload.id);
      if ("None" in loanOpt) {
        return Err({ NotFound: `loan with id=${payload.id} not found` });
      }
      const loan = loanOpt.Some;
      if (payload.status === "rejected") {
        const updatedLoan = {
          ...loan,
          status: "rejected",
          updatedAt: Some(new Date().toISOString()),
        };
        loansStorage.insert(loan.id, updatedLoan);
        return Ok(updatedLoan);
      } else {
        const updatedLoan = {
          ...loan,
          ...payload,
          terms: Some(payload.terms),
          status: "approved",
          dueDate: Some(new Date().toISOString()),
          updatedAt: Some(new Date().toISOString()),
        };
        loansStorage.insert(loan.id, updatedLoan);
        return Ok(updatedLoan);
      }
    }
  ),

  // Function to add a borrower
  addBorrower: update(
    [BorrowerPayload],
    Result(Borrower, ErrorType),
    (payload) => {
      // Check if the payload is a valid object
      if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payload" });
      }
      // Create a borrower with a unique id generated using UUID v4
      const borrower = {
        id: uuidv4(),
        principal: ic.caller(),
        loans: [],
        creditScore: 100n,
        savings: 0n,
        collaterals: [],
        ...payload,
      };
      // Insert the borrower into the borrowersStorage
      borrowersStorage.insert(borrower.id, borrower);
      return Ok(borrower);
    }
  ),

  // get all borrowers
  getBorrowers: query([], Vec(Borrower), () => {
    return borrowersStorage.values();
  }),

  // Function get borrower by id
  getBorrower: query([text], Result(Borrower, ErrorType), (id) => {
    const borrowerOpt = borrowersStorage.get(id);
    if ("None" in borrowerOpt) {
      return Err({ NotFound: `borrower with id=${id} not found` });
    }
    const borrower = borrowerOpt.Some;
    return Ok(borrower);
  }),

  // get borrower by owner
  getBorrowerByOwner: query([], Result(Borrower, ErrorType), () => {
    const principal = ic.caller();
    const borrowerOpt = borrowersStorage.values().filter((borrower) => {
      return borrower.principal.toText() === principal.toText();
    });
    if (borrowerOpt.length === 0) {
      return Err({
        NotFound: `borrower with principal=${principal} not found`,
      });
    }
    return Ok(borrowerOpt[0]);
  }),

  // get loans reserved by a borrower
  getBorrowerLoans: query([text], Vec(Loan), (id) => {
    const borrowerOpt = borrowersStorage.get(id);
    if ("None" in borrowerOpt) {
      return [];
    }
    const borrower = borrowerOpt.Some;
    return loansStorage.values().filter((loan) => {
      return borrower.loans.includes(loan.id);
    });
  }),

  // add collateral
  addCollateral: update(
    [CollateralPayload],
    Result(Collateral, ErrorType),
    (payload) => {
      const borrower = borrowersStorage.values().filter((borrower) => {
        return borrower.principal.toText() === ic.caller().toText();
      })[0];
      // Check if the payload is a valid object
      if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payload" });
      }
      // Create a collateral with a unique id generated using UUID v4
      const collateral = {
        id: uuidv4(),
        owner: ic.caller(),
        status: "active",
        ...payload,
      };

      // add collateral to the borrower
      const updatedBorrower = {
        ...borrower,
        collaterals: [...borrower.collaterals, collateral.id],
      };

      borrowersStorage.insert(borrower.id, updatedBorrower);

      // Insert the collateral into the collateralStorage
      collateralStorage.insert(collateral.id, collateral);
      return Ok(collateral);
    }
  ),

  // Function to update a borrower
  updateBorrower: update(
    [UpdateBorrowerPayload],
    Result(Borrower, ErrorType),
    (payload) => {
      const borrowerOpt = borrowersStorage.get(payload.id);
      if ("None" in borrowerOpt) {
        return Err({ NotFound: `borrower with id=${payload.id} not found` });
      }
      const borrower = borrowerOpt.Some;
      const updatedBorrower = {
        ...borrower,
        ...payload,
      };
      borrowersStorage.insert(borrower.id, updatedBorrower);
      return Ok(updatedBorrower);
    }
  ),

  // get borrower collaterals
  getBorrowerCollaterals: query([text], Vec(Collateral), (id) => {
    const borrowerOpt = borrowersStorage.get(id);
    if ("None" in borrowerOpt) {
      return [];
    }
    const borrower = borrowerOpt.Some;
    return collateralStorage.values().filter((collateral) => {
      return (
        borrower.collaterals.includes(collateral.id) &&
        collateral.status === "active"
      );
    });
  }),

  // get borrower pending loans
  getBorrowerPendingLoans: query([text], Vec(Loan), (id) => {
    const borrowerOpt = borrowersStorage.get(id);
    if ("None" in borrowerOpt) {
      return [];
    }
    const borrower = borrowerOpt.Some;
    return loansStorage.values().filter((loan) => {
      return loan.borrower.id === borrower.id && loan.status === "pending";
    });
  }),

  // get borrower active loans
  getBorrowerActiveLoans: query([text], Vec(Loan), (id) => {
    const borrowerOpt = borrowersStorage.get(id);
    if ("None" in borrowerOpt) {
      return [];
    }
    const borrower = borrowerOpt.Some;
    return loansStorage.values().filter((loan) => {
      return loan.borrower.id === borrower.id && loan.status === "approved";
    });
  }),

  // get borrower completed loans
  getBorrowerCompletedLoans: query([text], Vec(Loan), (id) => {
    const borrowerOpt = borrowersStorage.get(id);
    if ("None" in borrowerOpt) {
      return [];
    }
    const borrower = borrowerOpt.Some;
    return loansStorage.values().filter((loan) => {
      return loan.borrower.id === borrower.id && loan.status === "completed";
    });
  }),

  // Function to add a lender
  addLender: update([LenderPayload], Result(Lender, ErrorType), (payload) => {
    // Check if the payload is a valid object
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ NotFound: "invalid payload" });
    }
    // Create a lender with a unique id generated using UUID v4
    const lender = {
      id: uuidv4(),
      principal: ic.caller(),
      loans: [],
      ...payload,
    };
    // Insert the lender into the lendersStorage
    lendersStorage.insert(lender.id, lender);
    return Ok(lender);
  }),

  // get all lenders
  getLenders: query([], Vec(Lender), () => {
    return lendersStorage.values();
  }),

  // Function get lender by id
  getLender: query([text], Result(Lender, ErrorType), (id) => {
    const lenderOpt = lendersStorage.get(id);
    if ("None" in lenderOpt) {
      return Err({ NotFound: `lender with id=${id} not found` });
    }
    return Ok(lenderOpt.Some);
  }),

  // get lender by owner
  getLenderByOwner: query([], Result(Lender, ErrorType), () => {
    const principal = ic.caller();
    const lenderOpt = lendersStorage.values().filter((lender) => {
      return lender.principal.toText() === principal.toText();
    });
    if (lenderOpt.length === 0) {
      return Err({ NotFound: `lender with principal=${principal} not found` });
    }
    return Ok(lenderOpt[0]);
  }),

  // get loans reserved by a lender
  getLenderLoans: query([text], Vec(Loan), (id) => {
    const lenderOpt = lendersStorage.get(id);
    if ("None" in lenderOpt) {
      return [];
    }
    const lender = lenderOpt.Some;
    return loansStorage.values().filter((loan) => {
      return lender.loans.includes(loan.id);
    });
  }),

  // get lender loan request
  getLenderLoanRequest: query([text], Vec(Loan), (id) => {
    return loansStorage.values().filter((loan) => {
      return loan.lender.id === id && loan.status === "pending";
    });
  }),

  // get lender active loans
  getLenderActiveLoans: query([text], Vec(Loan), (id) => {
    return loansStorage.values().filter((loan) => {
      return loan.lender.id === id && loan.status === "approved";
    });
  }),

  // get lender completed loans
  getLenderCompletedLoans: query([text], Vec(Loan), (id) => {
    return loansStorage.values().filter((loan) => {
      return loan.lender.id === id && loan.status === "completed";
    });
  }),

  // Function to update a lender
  updateLender: update(
    [UpdateLenderPayload],
    Result(Lender, ErrorType),
    (payload) => {
      const lenderOpt = lendersStorage.get(payload.id);
      if ("None" in lenderOpt) {
        return Err({ NotFound: `lender with id=${payload.id} not found` });
      }
      const lender = lenderOpt.Some;
      const updatedLender = {
        ...lender,
        ...payload,
      };
      lendersStorage.insert(lender.id, updatedLender);
      return Ok(updatedLender);
    }
  ),

  // get borrower loans
  getActiveLoans: query([], Vec(Loan), () => {
    const borrowerOpt = borrowersStorage.values().filter((borrower) => {
      return borrower.principal.toText() === ic.caller().toText();
    });
    if (borrowerOpt.length === 0) {
      return [];
    }
    const borrower = borrowerOpt[0];

    const loans = loansStorage.values().filter((loan) => {
      return (
        loan.borrower.toText() === ic.caller().toText() ||
        loan.lender.Some === borrower.id
      );
    });

    return loans;
  }),

  createPaymentPay: update(
    [text],
    Result(ReservePayment, ErrorType),
    (loanId) => {
      const loanOpt = loansStorage.get(loanId);
      if ("None" in loanOpt) {
        return Err({
          NotFound: `cannot reserve Payment: Loan  with id=${loanId} not available`,
        });
      }
      const loan = loanOpt.Some;

      const amount = loan.amount;

      const lenderId = loan.lender.Some;
      // get lender
      const borrowerOpt = borrowersStorage.get(loan.borrower.id);

      const borrower = borrowerOpt.Some.principal;

      const reservePayment = {
        price: amount,
        status: "pending",
        borrower: borrower,
        paid_at_block: None,
        memo: generateCorrelationId(loanId),
      };

      // reduce the available units
      const updatedLoan = {
        ...loan,
        status: "completed",
      };

      loan.updatedAt = Some(new Date().toISOString());

      loansStorage.insert(loan.id, updatedLoan);

      pendingPayments.insert(reservePayment.memo, reservePayment);
      discardByTimeout(reservePayment.memo, PAYMENT_RESERVATION_PERIOD);
      return Ok(reservePayment);
    }
  ),

  completePayment: update(
    [Principal, text, nat64, nat64, nat64],
    Result(ReservePayment, ErrorType),
    async (reservor, loanId, reservePrice, block, memo) => {
      const paymentVerified = await verifyPaymentInternal(
        reservor,
        reservePrice,
        block,
        memo
      );
      if (!paymentVerified) {
        return Err({
          NotFound: `cannot complete the reserve: cannot verify the payment, memo=${memo}`,
        });
      }
      const pendingReservePayOpt = pendingPayments.remove(memo);
      if ("None" in pendingReservePayOpt) {
        return Err({
          NotFound: `cannot complete the reserve: there is no pending reserve with id=${loanId}`,
        });
      }
      const reservedPay = pendingReservePayOpt.Some;
      const updatedReservePayment = {
        ...reservedPay,
        status: "completed",
        paid_at_block: Some(block),
      };
      persistedPayments.insert(ic.caller(), updatedReservePayment);
      return Ok(updatedReservePayment);
    }
  ),

  // create repayment
  createRePayment: update(
    [text, nat64],
    Result(ReserveRePayment, ErrorType),
    (loanId, amount) => {
      const loanOpt = loansStorage.get(loanId);
      if ("None" in loanOpt) {
        return Err({
          NotFound: `cannot reserve Payment: Loan  with id=${loanId} not available`,
        });
      }
      const loan = loanOpt.Some;

      const lender = loan.lender.principal;

      const reserveRePayment = {
        price: amount,
        status: "pending",
        lender: lender,
        paid_at_block: None,
        memo: generateCorrelationId(loanId),
      };

      const repayment = {
        id: uuidv4(),
        loanId: loanId,
        amount: amount,
        paidAt: new Date().toISOString(),
      };
      loan.rePaid = loan.rePaid + amount;
      if (loan.rePaid >= loan.amount) {
        loan.status = "paid";
      }

      repaymentStorage.insert(repayment.id, repayment);

      loansStorage.insert(loan.id, loan);

      pendingRepayments.insert(reserveRePayment.memo, reserveRePayment);
      discardByTimeout(reserveRePayment.memo, PAYMENT_RESERVATION_PERIOD);
      return Ok(reserveRePayment);
    }
  ),

  completeRePayment: update(
    [Principal, text, nat64, nat64, nat64],
    Result(ReserveRePayment, ErrorType),
    async (reservor, loanId, reservePrice, block, memo) => {
      const paymentVerified = await verifyPaymentInternal(
        reservor,
        reservePrice,
        block,
        memo
      );
      if (!paymentVerified) {
        return Err({
          NotFound: `cannot complete the reserve: cannot verify the payment, memo=${memo}`,
        });
      }
      const pendingReservePayOpt = pendingPayments.remove(memo);
      if ("None" in pendingReservePayOpt) {
        return Err({
          NotFound: `cannot complete the reserve: there is no pending reserve with id=${loanId}`,
        });
      }
      const reservedPay = pendingReservePayOpt.Some;
      const updatedReservePayment = {
        ...reservedPay,
        status: "completed",
        paid_at_block: Some(block),
      };
      persistedRePayments.insert(ic.caller(), updatedReservePayment);
      return Ok(updatedReservePayment);
    }
  ),

  createSavings: update(
    [text, nat64],
    Result(Borrower, ErrorType),
    (lenderId, amount) => {
      const borrowerOpt = borrowersStorage.values().filter((borrower) => {
        return borrower.principal.toText() === ic.caller().toText();
      });

      const lenderOpt = lendersStorage.get(lenderId);
      if ("None" in lenderOpt) {
        return Err({
          NotFound: `cannot reserve Payment: Lender  with id=${lenderId} not available`,
        });
      }

      const lender = lenderOpt.Some;

      const borrower = borrowerOpt[0];

      const reserveSavings = {
        price: amount,
        status: "pending",
        lender: lender.principal,
        paid_at_block: None,
        memo: generateCorrelationId("savings"),
      };

      borrower.savings = borrower.savings + amount;

      borrowersStorage.insert(borrower.id, borrower);

      pendingSavings.insert(reserveSavings.memo, reserveSavings);
      discardByTimeout(reserveSavings.memo, PAYMENT_RESERVATION_PERIOD);
      return Ok(borrower);
    }
  ),

  completeSaving: update(
    [Principal, nat64, nat64, nat64],
    Result(ReserveSavings, ErrorType),
    async (reservor, reservePrice, block, memo) => {
      const paymentVerified = await verifyPaymentInternal(
        reservor,
        reservePrice,
        block,
        memo
      );
      if (!paymentVerified) {
        return Err({
          NotFound: `cannot complete the reserve: cannot verify the payment, memo=${memo}`,
        });
      }
      const pendingReservePayOpt = pendingSavings.remove(memo);
      if ("None" in pendingReservePayOpt) {
        return Err({
          NotFound: `cannot complete the reserve: there is no pending reserve with id=${memo}`,
        });
      }
      const reservedPay = pendingReservePayOpt.Some;
      const updatedReservePayment = {
        ...reservedPay,
        status: "completed",
        paid_at_block: Some(block),
      };
      persistedSavings.insert(ic.caller(), updatedReservePayment);
      return Ok(updatedReservePayment);
    }
  ),

  verifyPayment: query(
    [Principal, nat64, nat64, nat64],
    bool,
    async (receiver, amount, block, memo) => {
      return await verifyPaymentInternal(receiver, amount, block, memo);
    }
  ),

  /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
  getAddressFromPrincipal: query([Principal], text, (principal) => {
    return hexAddressFromPrincipal(principal, 0);
  }),
});

/*
    a hash function that is used to generate correlation ids for loans.
    also, we use that in the verifyPayment function where we check if the used has actually paid the loan
*/
function hash(input: any): nat64 {
  return BigInt(Math.abs(hashCode().value(input)));
}

// A workaround to make the uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  },
};

// HELPER FUNCTIONS
function generateCorrelationId(loanId: text): nat64 {
  const correlationId = `${loanId}_${ic.caller().toText()}_${ic.time()}`;
  return hash(correlationId);
}

function discardByTimeout(memo: nat64, delay: Duration) {
  ic.setTimer(delay, () => {
    const loan = pendingPayments.remove(memo);
    console.log(`Reserve discarded ${loan}`);
  });
}
async function verifyPaymentInternal(
  receiver: Principal,
  amount: nat64,
  block: nat64,
  memo: nat64
): Promise<bool> {
  const blockData = await ic.call(icpCanister.query_blocks, {
    args: [{ start: block, length: 1n }],
  });
  const tx = blockData.blocks.find((block) => {
    if ("None" in block.transaction.operation) {
      return false;
    }
    const operation = block.transaction.operation.Some;
    const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
    const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
    return (
      block.transaction.memo === memo &&
      hash(senderAddress) === hash(operation.Transfer?.from) &&
      hash(receiverAddress) === hash(operation.Transfer?.to) &&
      amount === operation.Transfer?.amount.e8s
    );
  });
  return tx ? true : false;
}
