import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyTokenModule", (m) => {
  const initialOwner = m.getAccount(0);
  const token = m.contract("MyToken", [initialOwner]);
  return { token };
});
