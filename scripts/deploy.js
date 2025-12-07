// scripts/deploy.js
/**
 * Script de deployment para JobFactory y FreelanceEscrow
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Iniciando deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Deploying contratos con: ${deployer.address}\n`);

  // 1. Desplegar FreelanceEscrow (implementación base para clones)
  console.log("1️⃣  Desplegando FreelanceEscrow...");
  const FreelanceEscrow = await hre.ethers.getContractFactory(
    "FreelanceEscrow"
  );
  const freelanceEscrow = await FreelanceEscrow.deploy();
  await freelanceEscrow.waitForDeployment();
  const escrowAddress = await freelanceEscrow.getAddress();
  console.log(`✅ FreelanceEscrow desplegado en: ${escrowAddress}\n`);

  // 2. Desplegar JobFactory
  console.log("2️⃣  Desplegando JobFactory...");
  const JobFactory = await hre.ethers.getContractFactory("JobFactory");
  const jobFactory = await JobFactory.deploy();
  await jobFactory.waitForDeployment();
  const factoryAddress = await jobFactory.getAddress();
  console.log(`✅ JobFactory desplegado en: ${factoryAddress}\n`);

  // 3. Verificar la implementación del escrow en el factory
  const implementationAddress = await jobFactory.escrowImplementation();
  console.log(
    `✓ Verificación: escrow implementation = ${implementationAddress}`
  );
  console.log(
    `✓ Coincide con desplegado: ${implementationAddress === escrowAddress}\n`
  );

  // 4. Guardar direcciones en archivo
  const addresses = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    FreelanceEscrow: escrowAddress,
    JobFactory: factoryAddress,
    timestamp: new Date().toISOString(),
  };

  const deploymentFile = path.join(
    __dirname,
    "../deployments",
    `${hre.network.name}.json`
  );

  // Crear directorio si no existe
  const dir = path.dirname(deploymentFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(deploymentFile, JSON.stringify(addresses, null, 2));
  console.log(`📄 Direcciones guardadas en: ${deploymentFile}\n`);

  // 5. Actualizar archivo de direcciones en frontend
  const addressesFile = path.join(
    __dirname,
    "../src/contracts/addresses.js"
  );

  const addressesContent = `// src/contracts/addresses.js (auto-generado por deploy.js)
const CONTRACTS = {
  JobFactory: {
    "${hre.network.name}": "${factoryAddress}",
  },
};

module.exports = CONTRACTS;
`;

  fs.writeFileSync(addressesFile, addressesContent);
  console.log(`✅ Archivo de direcciones actualizado\n`);

  // 6. Resumen
  console.log("═══════════════════════════════════════════════════════");
  console.log("📋 RESUMEN DE DEPLOYMENT");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`Red: ${hre.network.name}`);
  console.log(`Chain ID: ${addresses.chainId}`);
  console.log(`Deployer: ${addresses.deployer}`);
  console.log(`\n📍 Direcciones de contrato:`);
  console.log(`   - FreelanceEscrow: ${escrowAddress}`);
  console.log(`   - JobFactory: ${factoryAddress}`);
  console.log("\n✨ Deployment completado exitosamente!");
  console.log("═══════════════════════════════════════════════════════\n");

  // Exportar para uso en pruebas
  return {
    freelanceEscrow,
    jobFactory,
    addresses,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
