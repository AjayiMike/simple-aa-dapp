# Simple AA dApp - Frontend

This is the frontend for the Simple AA dApp

## Table of Contents

-   [Simple AA dApp - Frontend](#simple-aa-dapp---frontend)
    -   [Table of Contents](#table-of-contents)
    -   [Getting Started](#getting-started)
        -   [Prerequisites](#prerequisites)
        -   [Installation](#installation)
    -   [Environment Setup](#environment-setup)
    -   [Available Scripts](#available-scripts)
        -   [`pnpm dev`](#pnpm-dev)
        -   [`pnpm build`](#pnpm-build)
        -   [`pnpm start`](#pnpm-start)
        -   [`pnpm lint`](#pnpm-lint)
    -   [Learn More](#learn-more)
    -   [Deploy on Vercel](#deploy-on-vercel)

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v20.18 or later)
-   [pnpm](https://pnpm.io/)

### Installation

1.  Navigate to the `ui` directory:
    ```bash
    cd ui
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```

## Environment Setup

1.  Duplicate the `.env.example` file and rename it to `.env`:
    ```bash
    cp .env.example .env
    ```
2.  Add your environment variable values to the `.env` file. The required variables are:
    -   `NEXT_PUBLIC_PIMLICO_URL`
    -   `NEXT_PUBLIC_PIMLICO_API_KEY`
    -   `NEXT_PUBLIC_RPC_URL`
    -   `NEXT_PUBLIC_MAGIC_API_KEY`
    -   `NEXT_PUBLIC_CHAIN_ID`

## Available Scripts

In the project directory, you can run:

### `pnpm dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `pnpm build`

Builds the app for production to the `.next` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `pnpm start`

Starts the production server.

### `pnpm lint`

Lints the project files.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
