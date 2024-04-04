# Loan Management System

This loan management system is a decentralized application (dApp) built on the Internet Computer platform. It allows borrowers to request loans backed by collateral and lenders to provide funds for these loans. The system ensures transparency, security, and fairness in loan transactions.

## Table of Contents

- [Loan Management System](#loan-management-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Key Functions](#key-functions)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [API Reference](#api-reference)
  - [Contributing](#contributing)
  - [License](#license)
  - [Things to be explained in the course](#things-to-be-explained-in-the-course)
  - [How to deploy canisters implemented in the course](#how-to-deploy-canisters-implemented-in-the-course)
    - [Ledger canister](#ledger-canister)
    - [Internet identity canister](#internet-identity-canister)
    - [eventManager canister](#eventmanager-canister)
    - [eventManager frontend canister](#eventmanager-frontend-canister)

## Overview

The Loan Management System aims to facilitate peer-to-peer lending by connecting borrowers and lenders in a decentralized manner. It leverages smart contracts on the Internet Computer to enable secure and transparent loan transactions without the need for intermediaries.

## Features

- Borrowers can request loans by providing collateral.
- Lenders can fund loans and earn interest on their investments.
- Smart contracts ensure trustless and transparent loan agreements.
- Borrower and lender profiles for tracking transaction history.
- Integration with the Internet Computer Ledger for secure payments and settlements.

## Project Structure

The project follows a structured organization to maintain modularity and clarity:

- **`canisters/`**: Contains the smart contract canisters written in Motoko.
- **`src/`**: Frontend source code for the user interface.
- **`scripts/`**: Scripts for deployment, testing, and other utilities.
- **`tests/`**: Test suites for ensuring code correctness and reliability.
- **`docs/`**: Documentation files, including README, API reference, and contributing guidelines.

## Key Functions

The Loan Management System provides several essential functions to manage loan transactions:

- **`addLoan(payload: LoanPayload): Result<Loan, ErrorType>`**: Allows borrowers to add a new loan request, specifying details such as title, description, collateral, and loan amount.
  
- **`getLoans(): Vec<Loan>`**: Retrieves a list of all active loans available in the system.
  
- **`addRequest(loanId: text, description: text, amount: nat64): Result<Request, ErrorType>`**: Enables borrowers to submit a loan request for a specific loan ID, including the desired loan amount and description.
  
- **`getRequests(): Vec<Request>`**: Fetches all loan requests submitted by borrowers.
  
- **`selectRequest(requestId: text): Result<Loan, ErrorType>`**: Allows lenders to select a loan request by ID, providing funds and marking the loan as assigned.
  
- **`createPaymentPay(loanId: text): Result<ReservePayment, ErrorType>`**: Initiates the payment process for a loan, creating a payment reservation for the borrower to fulfill.
  
- **`completePayment(reservor: Principal, loanId: text, reservePrice: nat64, block: nat64, memo: nat64): Result<ReservePayment, ErrorType>`**: Verifies and completes the payment reservation initiated by the borrower, updating the payment status accordingly.
  
- **`createRePayment(loanId: text, amount: nat64): Result<ReserveRePayment, ErrorType>`**: Facilitates the repayment process for borrowers, creating a repayment reservation for the specified loan and amount.
  
- **`completeRePayment(reservor: Principal, loanId: text, reservePrice: nat64, block: nat64, memo: nat64): Result<ReserveRePayment, ErrorType>`**: Verifies and completes the repayment reservation initiated by the borrower, updating the repayment status accordingly.

## Getting Started

### Prerequisites

To run the Loan Management System locally, you need:

- [Node.js](https://nodejs.org/) installed on your machine.
- An Internet Computer development environment set up (e.g., using DFX).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/loan-management-system.git
   ```

2. Install dependencies:

   ```bash
   cd loan-management-system
   npm install
   ```

## Usage

1. Start the local development environment:

   ```bash
   dfx start
   ```

2. Deploy the canister smart contracts:

   ```bash
   dfx deploy
   ```

3. Interact with the dApp using the provided API or user interface.

## API Reference

The Loan Management System provides a set of API endpoints for interacting with the smart contracts. Refer to the [API documentation](./API.md) for detailed usage instructions.

## Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the [MIT License](./LICENSE).

## Things to be explained in the course

1. What is Ledger? More details here: <https://internetcomputer.org/docs/current/developer-docs/integrations/ledger/>
2. What is Internet Identity? More details here: <https://internetcomputer.org/internet-identity>
3. What is Principal, Identity, Address? <https://internetcomputer.org/internet-identity> | <https://yumieventManager.medium.com/whats-the-difference-between-principal-id-and-account-id-3c908afdc1f9>
4. Canister-to-canister communication and how multi-canister development is done? <https://medium.com/icp-league/explore-backend-multi-canister-development-on-ic-680064b06320>

## How to deploy canisters implemented in the course

### Ledger canister

`./deploy-local-ledger.sh` - deploys a local Ledger canister. IC works differently when run locally so there is no default network token available and you have to deploy it yourself. Remember that it's not a token like ERC-20 in Ethereum, it's a native token for ICP, just deployed separately.
This canister is described in the `dfx.json`:

```markdown
 "ledger_canister": {
   "type": "custom",
   "candid": "https://raw.githubborrowerloan.com/dfinity/ic/928caf66c35627efe407006230beee60ad38f090/rs/rosetta-api/icp_ledger/ledger.did",
   "wasm": "https://download.dfinity.systems/ic/928caf66c35627efe407006230beee60ad38f090/canisters/ledger-canister.wasm.gz",
   "remote": {
     "id": {
       "ic": "ryjl3-tyaaa-aaaaa-aaaba-cai"
     }
   }
 }
```

`remote.id.ic` - that is the principal of the Ledger canister and it will be available by this principal when you work with the ledger.

Also, in the scope of this script, a minter identity is created which can be used for minting tokens
for the testing purposes.
Additionally, the default identity is pre-populated with 1000_000_000_000 e8s which is equal to 10_000 * 10**8 ICP.
The decimals value for ICP is 10**8.

List identities:
`dfx identity list`

Switch to the minter identity:
`dfx identity use minter`

Transfer ICP:
`dfx ledger transfer <ADDRESS>  --memo 0 --icp 100 --fee 0`
where:

- `--memo` is some correlation id that can be set to identify some particular transactions (we use that in the eventManager canister).
- `--icp` is the transfer amount
- `--fee` is the transaction fee. In this case it's 0 because we make this transfer as the minter idenity thus this transaction is of type MINT, not TRANSFER.
- `<ADDRESS>` is the address of the recipient. To get the address from the principal, you can get it directly from the wallet icon top right or use the helper function from the eventManager canister - `getAddressFromPrincipal(principal: Principal)`, it can be called via the Candid UI.

### Internet identity canister

`dfx deploy internet_identity` - that is the canister that handles the authentication flow. Once it's deployed, the `js-agent` library will be talking to it to register identities. There is UI that acts as a wallet where you can select existing identities
or create a new one.

### eventManager canister

`dfx deploy dfinity_js_backend` - deploys the eventManager canister where the business logic is implemented.
Basically, it implements functions like add, view, update, delete, and buy events + a set of helper functions.

Do not forget to run `dfx generate dfinity_js_backend` anytime you add/remove functions in the canister or when you change the signatures.
Otherwise, these changes won't be reflected in IDL's and won't work when called using the JS agent.

### eventManager frontend canister

`dfx deploy dfinity_js_frontend` - deployes the frontend app for the `dfinity_js_backend` canister on IC.
