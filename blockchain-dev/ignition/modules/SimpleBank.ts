import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SimpleBankModule", (m) => {
  const bank = m.contract("SimpleBank");
  return { bank };
});
