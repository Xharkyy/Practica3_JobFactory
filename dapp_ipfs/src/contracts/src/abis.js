import FreelanceScrowAbi from "./abis/FreelanceScrowAbi.json";
import JobFactoryAbi from "./abis/JobFactoryAbi.json";

const abis = {
  escrow: FreelanceScrowAbi,
  jobFactory: JobFactoryAbi,   // <- F mayúscula, igual que en App.js
};

export default abis;
