import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SimpleAATokenModule = buildModule("SimpleAATokenModule", (m) => {
    const simpleAAToken = m.contract("SimpleAAToken");

    return { simpleAAToken };
});

export default SimpleAATokenModule;
