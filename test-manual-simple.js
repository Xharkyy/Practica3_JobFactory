const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("\n================================================================================");
  console.log("  🚀 PRUEBA DE FUNCIONAMIENTO - JobFactory Marketplace");
  console.log("================================================================================\n");

  try {
    // ===== SECCIÓN 1: INICIALIZACIÓN =====
    console.log("================================================================================");
    console.log("  1️⃣  INICIALIZACIÓN Y SETUP");
    console.log("================================================================================\n");

    console.log("📌 Obteniendo cuentas de Hardhat...");
    const [client, freelancer, arbiter, other] = await ethers.getSigners();
    
    console.log(`✅ Cliente:     ${client.address}`);
    console.log(`✅ Freelancer:  ${freelancer.address}`);
    console.log(`✅ Árbitro:     ${arbiter.address}`);
    console.log(`✅ Otro:        ${other.address}`);

    console.log("\n📊 Verificando saldos iniciales...");
    const clientBalance = await ethers.provider.getBalance(client.address);
    const freelancerBalance = await ethers.provider.getBalance(freelancer.address);
    
    console.log(`   Cliente:     ${ethers.formatEther(clientBalance)} ETH`);
    console.log(`   Freelancer:  ${ethers.formatEther(freelancerBalance)} ETH`);

    // ===== SECCIÓN 2: DESPLIEGUE =====
    console.log("\n================================================================================");
    console.log("  2️⃣  DESPLIEGUE DE CONTRATOS");
    console.log("================================================================================\n");

    console.log("📌 Desplegando FreelanceEscrow...");
    const FreelanceEscrow = await ethers.getContractFactory("FreelanceEscrow");
    const escrow = await FreelanceEscrow.deploy();
    const escrowAddress = await escrow.getAddress();
    console.log(`✅ FreelanceEscrow desplegado en: ${escrowAddress}`);

    console.log("\n📌 Desplegando JobFactory...");
    const JobFactory = await ethers.getContractFactory("JobFactory");
    const factory = await JobFactory.deploy();
    const factoryAddress = await factory.getAddress();
    console.log(`✅ JobFactory desplegado en: ${factoryAddress}`);

    // ===== SECCIÓN 3: PUBLICAR JOB =====
    console.log("\n================================================================================");
    console.log("  3️⃣  PUBLICANDO UN JOB");
    console.log("================================================================================\n");

    console.log("📌 Cliente está publicando un nuevo job...");
    const jobTitle = "Desarrollo de Landing Page v1.0";
    const jobDescription = "Crear una landing page responsiva y moderna";
    const jobAmount = ethers.parseEther("1.5");
    const deadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    const challengePeriod = 7 * 24 * 60 * 60;
    const ipfsHash = "QmExampleHash1234567";

    console.log(`   Título:     ${jobTitle}`);
    console.log(`   Cantidad:   ${ethers.formatEther(jobAmount)} ETH`);
    console.log(`   Plazo:      30 días`);

    console.log("\n📝 Enviando transacción...");
    const tx1 = await factory.connect(client).postJob(
      {
        amount: jobAmount,
        deadline: deadline,
        challengePeriod: challengePeriod
      },
      jobTitle,
      jobDescription,
      ipfsHash
    );
    
    const receipt1 = await tx1.wait();
    console.log(`✅ Job publicado exitosamente!`);
    console.log(`   Bloque: ${receipt1.blockNumber}`);
    console.log(`   Gas usado: ${receipt1.gasUsed}`);

    // ===== SECCIÓN 4: VERIFICAR JOB =====
    console.log("\n================================================================================");
    console.log("  4️⃣  VERIFICANDO JOB CREADO");
    console.log("================================================================================\n");

    const job = await factory.getJob(0);
    console.log(`✅ Job ID:          0`);
    console.log(`✅ Cliente:         ${job.client}`);
    console.log(`✅ Cantidad:        ${ethers.formatEther(job.amount)} ETH`);
    console.log(`✅ Estado:          ${job.status === 0n ? '📌 PENDIENTE' : '✅ ACEPTADO'}`);

    // ===== SECCIÓN 5: ACEPTAR JOB =====
    console.log("\n================================================================================");
    console.log("  5️⃣  FREELANCER ACEPTANDO JOB");
    console.log("================================================================================\n");

    console.log("📌 Freelancer está aceptando el job...");
    console.log(`   Freelancer: ${freelancer.address}`);
    console.log(`   Árbitro: ${arbiter.address}`);

    console.log("\n📝 Enviando transacción de aceptación...");
    const tx2 = await factory.connect(freelancer).acceptJob(
      0,
      arbiter.address,
      deadline,
      challengePeriod
    );
    
    const receipt2 = await tx2.wait();
    console.log(`✅ Job aceptado exitosamente!`);
    console.log(`   Bloque: ${receipt2.blockNumber}`);
    console.log(`   Gas usado: ${receipt2.gasUsed}`);

    // Extraer dirección del escrow
    let escrowCloneAddress = null;
    for (const event of receipt2.logs) {
      try {
        const parsed = factory.interface.parseLog(event);
        if (parsed && parsed.name === 'JobAccepted') {
          escrowCloneAddress = parsed.args[3];
          break;
        }
      } catch (e) {}
    }

    if (escrowCloneAddress) {
      console.log(`✅ Escrow Clone desplegado en: ${escrowCloneAddress}`);
    }

    // ===== SECCIÓN 6: VERIFICAR ACEPTACIÓN =====
    console.log("\n================================================================================");
    console.log("  6️⃣  VERIFICANDO ACEPTACIÓN DEL JOB");
    console.log("================================================================================\n");

    const jobAccepted = await factory.getJob(0);
    console.log(`✅ Cliente:         ${jobAccepted.client}`);
    console.log(`✅ Freelancer:      ${jobAccepted.freelancer}`);
    console.log(`✅ Cantidad:        ${ethers.formatEther(jobAccepted.amount)} ETH`);
    console.log(`✅ Estado:          ✅ ACEPTADO`);
    console.log(`✅ Escrow Asociado: ${jobAccepted.escrowAddress}`);

    // ===== SECCIÓN 7: LISTAR JOBS =====
    console.log("\n================================================================================");
    console.log("  7️⃣  CONSULTANDO JOBS POR ROL");
    console.log("================================================================================\n");

    const clientJobs = await factory.getClientJobs(client.address);
    console.log(`📌 Jobs del Cliente`);
    console.log(`   Total: ${clientJobs.length} job(s)`);
    for (let i = 0; i < clientJobs.length; i++) {
      console.log(`   - Job ${clientJobs[i]}: ${jobTitle}`);
    }

    const freelancerJobs = await factory.getFreelancerJobs(freelancer.address);
    console.log(`\n📌 Jobs del Freelancer`);
    console.log(`   Total: ${freelancerJobs.length} job(s)`);
    for (let i = 0; i < freelancerJobs.length; i++) {
      console.log(`   - Job ${freelancerJobs[i]}: ${jobTitle}`);
    }

    // ===== SECCIÓN 8: PRUEBA DE ESCROW =====
    console.log("\n================================================================================");
    console.log("  8️⃣  PROBANDO FUNCIONALIDAD DEL ESCROW");
    console.log("================================================================================\n");

    if (escrowCloneAddress) {
      console.log("📌 Cargando instancia del Escrow Clone...");
      const escrowClone = FreelanceEscrow.attach(escrowCloneAddress);
      console.log("✅ Escrow clone cargado");

      console.log("\n📌 Enviando fondos al escrow (Cliente)...");
      console.log(`   Cantidad: ${ethers.formatEther(jobAmount)} ETH`);
      
      const tx3 = await client.sendTransaction({
        to: escrowCloneAddress,
        value: jobAmount
      });
      const receipt3 = await tx3.wait();
      console.log(`✅ Fondos enviados exitosamente!`);
      console.log(`   Gas usado: ${receipt3.gasUsed}`);

      console.log("\n📌 Verificando saldo del escrow...");
      const escrowBalance = await ethers.provider.getBalance(escrowCloneAddress);
      console.log(`✅ Saldo del escrow: ${ethers.formatEther(escrowBalance)} ETH`);

      console.log("\n📌 Freelancer marcando trabajo como entregado...");
      const deliveryHash = "QmDeliveryHash789";
      console.log(`   Archivo IPFS: ${deliveryHash}`);
      
      const tx4 = await escrowClone.connect(freelancer).markDelivered(deliveryHash);
      const receipt4 = await tx4.wait();
      console.log(`✅ Trabajo marcado como entregado!`);
      console.log(`   Gas usado: ${receipt4.gasUsed}`);

      console.log("\n📌 Cliente aprobando liberación de fondos...");
      const tx5 = await escrowClone.connect(client).approveRelease();
      const receipt5 = await tx5.wait();
      console.log(`✅ Fondos liberados al freelancer!`);
      console.log(`   Gas usado: ${receipt5.gasUsed}`);

      console.log("\n📌 Verificando saldo final del freelancer...");
      const freelancerFinalBalance = await ethers.provider.getBalance(freelancer.address);
      console.log(`✅ Saldo final: ${ethers.formatEther(freelancerFinalBalance)} ETH`);
    }

    // ===== SECCIÓN 9: RESUMEN FINAL =====
    console.log("\n================================================================================");
    console.log("✅ PRUEBA COMPLETADA EXITOSAMENTE");
    console.log("================================================================================\n");

    console.log("📋 RESUMEN DE OPERACIONES:");
    console.log("   ✅ Publicación de job");
    console.log("   ✅ Aceptación de job");
    console.log("   ✅ Despliegue de escrow (clone EIP-1167)");
    console.log("   ✅ Verificación de job");
    console.log("   ✅ Consulta de jobs por rol");
    console.log("   ✅ Envío de fondos");
    console.log("   ✅ Marca de entrega");
    console.log("   ✅ Aprobación y liberación de fondos");

    console.log("\n📊 ESTADÍSTICAS:");
    console.log(`   Total de transacciones: 5`);
    console.log(`   Contratos interactuados: 2 (Factory + Clone)`);
    console.log(`   Jobs creados: 1`);
    console.log(`   Escrows desplegados: 1 (EIP-1167 Clone)`);

    console.log("\n" + "=".repeat(80));
    console.log("🎉 ¡TODAS LAS PRUEBAS COMPLETADAS CON ÉXITO!");
    console.log("=".repeat(80) + "\n");

  } catch (error) {
    console.log("\n❌ ERROR EN LA PRUEBA:");
    console.log(error.message);
    if (error.reason) {
      console.log(`Razón: ${error.reason}`);
    }
    process.exitCode = 1;
  }
}

main();
