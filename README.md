# Simple AA dApp

This is a full-stack project that demonstrates how to build account abstraction dApps without using any convernience aa library. It features an ERC20 token and a user interface that allows users to interact with the token's features, such as minting, transferring, burning, and dispersing tokens, with the option of gas sponsorship.

This is a pnpm monorepo with the following structure:

-   `contracts/`: A Hardhat project for the `SimpleAAToken` smart contract.
-   `ui/`: A Next.js project for the dApp's user interface.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20.18 or later)
-   [pnpm](https://pnpm.io/installation)

### 1. Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/AjayiMike/simple-aa-dapp.git
cd simple-aa-dapp
```

### 2. Install Dependencies

Install all project dependencies from the root of the monorepo:

```bash
pnpm install
```

### 3. Set Up and Deploy the Smart Contract

First, we'll set up and deploy the `SimpleAAToken` smart contract.

#### a. Set Up Environment Variables

1.  Navigate to the `contracts` directory and create a `.env` file.
2.  Add the following variables to the `.env` file, replacing the placeholder values with your own:

    ```
    RPC_URL="YOUR_SEPOLIA_RPC_URL"
    PRIVATE_KEY="YOUR_PRIVATE_KEY"
    CHAIN_ID=11155111
    ETHERSCAN_KEY="YOUR_ETHERSCAN_API_KEY"
    ```

#### b. Deploy and Verify

1.  **Deploy to Sepolia Testnet:**

    From the root of the project, run:

    ```bash
    pnpm contracts deploy
    ```

    After a successful deployment, take note of the deployed contract address. You will need it for the UI setup.

2.  **Verify on Etherscan:**

    ```bash
    pnpm contracts verify
    ```

### 4. Set Up the User Interface

Now, let's set up the user interface.

#### a. Set Up Environment Variables

1.  Navigate to the `ui` directory and create a `.env` file from the example file.
2.  Add your environment variable values to the `.env` file. The required variables are:
    -   `NEXT_PUBLIC_MAGIC_API_KEY`
    -   `NEXT_PUBLIC_CHAIN_ID`
    -   `NEXT_PUBLIC_RPC_URL`
    -   `NEXT_PUBLIC_PAYMASTER_URL`
    -   `NEXT_PUBLIC_BUNDLER_URL`
    -   `NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS` (from the deployment step above)

#### b. Getting API Keys

-   **Particle Network (`PAYMASTER_URL` & `BUNDLER_URL`)**

    1.  Go to the [Particle Network Dashboard](https://dashboard.particle.network).
    2.  Create a new project or select an existing one.
    3.  Copy your project's Bundler and Paymaster URLs.

-   **Magic Link (`MAGIC_API_KEY`)**
    1.  Go to the [Magic Link Dashboard](https://dashboard.magic.link).
    2.  Create a new project or select an existing one.
    3.  From your project's dashboard, copy the "Publishable API Key".
    4.  Make sure to set up Google Social Login for your project. The Magic Link dashboard and documentation provide detailed instructions on how to do this.

### 5. Run the User Interface

To start the Next.js development server for the UI, run the following command from the root of the project:

```bash
pnpm ui dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the dApp in action.
