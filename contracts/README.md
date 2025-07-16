# Simple AA Token

This project contains the smart contract for the Simple AA Token, an ERC20 token designed to be used in a simple account abstraction dApp.

## Table of Contents

-   [Simple AA Token](#simple-aa-token)
    -   [Table of Contents](#table-of-contents)
    -   [Getting Started](#getting-started)
        -   [Prerequisites](#prerequisites)
        -   [Installation](#installation)
    -   [Environment Setup](#environment-setup)
    -   [Deployment](#deployment)
    -   [Verification](#verification)

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v20.18 or later)
-   [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
    ```bash
    git clone git@github.com:AjayiMike/simple-aa-dapp.git
    ```
2. Navigate to the contracts directory:
    ```bash
    cd simple-aa-dapp/contracts
    ```
3. Install dependencies:
    ```bash
    pnpm install
    ```

## Environment Setup

1. Create a `.env` file in the `contracts` directory:
    ```bash
    touch .env
    ```
2. Copy and paste in the content of the `.env.example` file and provide the neccesary values:

    ```
    RPC_URL="YOUR_SEPOLIA_RPC_URL"
    PRIVATE_KEY="YOUR_PRIVATE_KEY"
    CHAIN_ID=11155111
    ETHERSCAN_KEY="YOUR_ETHERSCAN_API_KEY"
    ```

## Deployment

To deploy the `SimpleAAToken` contract to the Sepolia testnet, run the following command:

```bash
npx hardhat ignition deploy ./ignition/modules/SImpleAAToken.ts --network sepolia
```

## Verification

To verify the contract on Etherscan, run the following command:

```bash
npx hardhat ignition verify chain-11155111
```

If you provide a custom deployment-id at the time of deployment, Replace `chain-11155111` with the deployment-id.
