export const simpleAATokenAbi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

export const entryPointAbi = [
    {
        inputs: [{ internalType: "address", name: "sender", type: "address" }],
        name: "SenderAddressResult",
        type: "error",
    },
    {
        inputs: [
            { internalType: "address", name: "sender", type: "address" },
            { internalType: "uint192", name: "key", type: "uint192" },
        ],
        name: "getNonce",
        outputs: [{ internalType: "uint256", name: "nonce", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "initCode", type: "bytes" }],
        name: "getSenderAddress",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

export const simpleAccountAbi = [
    {
        inputs: [
            { internalType: "address", name: "dest", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "bytes", name: "func", type: "bytes" },
        ],
        name: "execute",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address[]", name: "dest", type: "address[]" },
            { internalType: "bytes[]", name: "func", type: "bytes[]" },
        ],
        name: "executeBatch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
];
export const simpleAccountFactoryAbi = [
    {
        inputs: [
            { name: "owner", type: "address" },
            { name: "salt", type: "uint256" },
        ],
        name: "createAccount",
        outputs: [{ name: "ret", type: "address" }],
        stateMutability: "nonpayable",
        type: "function",
    },
];
