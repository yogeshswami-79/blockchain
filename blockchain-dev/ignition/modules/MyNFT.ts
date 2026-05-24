import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyNFTModule", (m) => {
  const initialOwner = m.getAccount(0);
  const nft = m.contract("MyNFT", [initialOwner]);
  return { nft };
});
