# Simple AA dApp Monorepo

This is a pnpm monorepo containing a Hardhat project for smart contracts and a Next.js project for the UI.

## Project Structure

-   `contracts/`: Hardhat project for your smart contracts.
-   `ui/`: Next.js project for your dApp's user interface.
-   `pnpm-workspace.yaml`: Defines the pnpm workspace.
-   `package.json`: Root package.json with scripts for each workspace.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [pnpm](https://pnpm.io/installation)

### Installation

1. Clone the repository.
2. Install dependencies from the root of the project:
    ```bash
    pnpm install
    ```

### Development

-   To run the Next.js development server:

    ```bash
    pnpm ui dev
    ```

-   To compile the smart contracts:
    ```bash
    pnpm contracts compile
    ```
