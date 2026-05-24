import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BallotModule", (m) => {
  const proposals = m.getParameter("proposals", ["Option A", "Option B", "Option C"]);
  const ballot = m.contract("Ballot", [proposals]);
  return { ballot };
});
