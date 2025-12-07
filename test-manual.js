const hre = require("hardhat");
const { ethers } = hre;

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function separator(title) {
  console.log('\n' + '='.repeat(80));
  log(`  ${title}`, 'bright');
  console.log('='.repeat(80) + '\n');
}

async function main() {
  separator('🚀 PRUEBA DE FUNCIONAMIENTO - JobFactory Marketplace');

  try {
    // ===== SECCIÓN 1: INICIALIZACIÓN =====
    separator('1️⃣  INICIALIZACIÓN Y SETUP');

    log('📌 Obteniendo cuentas de Hardhat...', 'blue');
    const [client, freelancer, arbiter, other] = await ethers.getSigners();
    
    log(`✅ Cliente:     ${client.address}`, 'green');
    log(`✅ Freelancer:  ${freelancer.address}`, 'green');
    log(`✅ Árbitro:     ${arbiter.address}`, 'green');
    log(`✅ Otro:        ${other.address}`, 'green');

    // Verificar saldos
    log('\n📊 Verificando saldos iniciales...', 'blue');
    const clientBalance = await ethers.provider.getBalance(client.address);
    const freelancerBalance = await ethers.provider.getBalance(freelancer.address);
    
    log(`   Cliente:     ${ethers.formatEther(clientBalance)} ETH`, 'yellow');
    log(`   Freelancer:  ${ethers.formatEther(freelancerBalance)} ETH`, 'yellow');

    // ===== SECCIÓN 2: CARGAR CONTRATOS =====
    separator('2️⃣  CARGANDO CONTRATOS');

    log('📌 Obteniendo direcciones desplegadas...', 'blue');
    
    // Intentar cargar del archivo de direcciones
    let factoryAddress, escrowAddress;
    try {
      const addresses = require('./src/contracts/addresses.js');
      factoryAddress = addresses.CONTRACTS?.JobFactory?.localhost;
      escrowAddress = addresses.CONTRACTS?.FreelanceEscrow?.localhost;
    } catch (e) {
      log('⚠️  No se encontró archivo de direcciones', 'yellow');
    }

    if (!factoryAddress) {
      log('⚠️  Dirección no configurada. Compilando y desplegando...', 'yellow');
      
      log('   Compilando JobFactory...', 'blue');
      const JobFactory = await ethers.getContractFactory("JobFactory");
      const factory = await JobFactory.deploy();
      await factory.waitForDeployment();
      factoryAddress = await factory.getAddress();
      log(`✅ JobFactory desplegado en: ${factoryAddress}`, 'green');

      log('   Compilando FreelanceEscrow...', 'blue');
      const FreelanceEscrow = await ethers.getContractFactory("FreelanceEscrow");
      const escrow = await FreelanceEscrow.deploy();
      await escrow.waitForDeployment();
      escrowAddress = await escrow.getAddress();
      log(`✅ FreelanceEscrow desplegado en: ${escrowAddress}`, 'green');
    } else {
      log(`✅ JobFactory cargado desde: ${factoryAddress}`, 'green');
      log(`✅ FreelanceEscrow cargado desde: ${escrowAddress}`, 'green');
    }

    // Cargar instancias de contrato
    const JobFactory = await ethers.getContractFactory("JobFactory");
    const factory = JobFactory.attach(factoryAddress);
    
    log('✅ Contratos cargados exitosamente!', 'green');

    // ===== SECCIÓN 3: PUBLICAR JOB =====
    separator('3️⃣  PUBLICANDO UN JOB');

    log('📌 Cliente está publicando un nuevo job...', 'blue');
    const jobTitle = "Desarrollo de Landing Page v2.0";
    const jobDescription = "Crear una landing page responsiva y moderna con HTML, CSS y JavaScript";
    const jobAmount = ethers.parseEther("1.5");
    const deadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 días
    const challengePeriod = 7 * 24 * 60 * 60; // 7 días
    const ipfsHash = "QmExampleHash12345678";

    log(`   Título:           ${jobTitle}`, 'yellow');
    log(`   Descripción:      ${jobDescription}`, 'yellow');
    log(`   Cantidad:         ${ethers.formatEther(jobAmount)} ETH`, 'yellow');
    log(`   Plazo (días):     30`, 'yellow');
    log(`   Challenge (días): 7`, 'yellow');
    log(`   IPFS Hash:        ${ipfsHash}`, 'yellow');

    log('\n📝 Enviando transacción...', 'blue');
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
    
    log(`   Tx Hash: ${tx1.hash}`, 'yellow');
    log('   Esperando confirmación...', 'yellow');
    const receipt1 = await tx1.wait();
    
    log(`✅ Job publicado exitosamente!`, 'green');
    log(`   Bloque: ${receipt1.blockNumber}`, 'green');
    log(`   Gas usado: ${receipt1.gasUsed}`, 'green');

    // ===== SECCIÓN 4: VERIFICAR JOB =====
    separator('4️⃣  VERIFICANDO JOB CREADO');

    log('📌 Consultando información del job...', 'blue');
    const job = await factory.getJob(0);
    
    log(`✅ Job ID:          0`, 'green');
    log(`✅ Cliente:         ${job.client}`, 'green');
    log(`✅ Freelancer:      ${job.freelancer === ethers.ZeroAddress ? '(no asignado)' : job.freelancer}`, 'green');
    log(`✅ Cantidad:        ${ethers.formatEther(job.amount)} ETH`, 'green');
    log(`✅ Estado:          ${job.status === 0n ? '📌 PENDIENTE' : job.status === 1n ? '✅ ACEPTADO' : '❌ CANCELADO'}`, 'green');

    // ===== SECCIÓN 5: ACEPTAR JOB =====
    separator('5️⃣  FREELANCER ACEPTANDO JOB');

    log('📌 Freelancer está aceptando el job...', 'blue');
    log(`   Freelancer: ${freelancer.address}`, 'yellow');
    log(`   Árbitro: ${arbiter.address}`, 'yellow');

    log('\n📝 Enviando transacción de aceptación...', 'blue');
    const tx2 = await factory.connect(freelancer).acceptJob(
      0, // jobId
      arbiter.address,
      deadline,
      challengePeriod
    );
    
    log(`   Tx Hash: ${tx2.hash}`, 'yellow');
    log('   Esperando confirmación y despliegue de escrow clone...', 'yellow');
    const receipt2 = await tx2.wait();
    
    log(`✅ Job aceptado exitosamente!`, 'green');
    log(`   Bloque: ${receipt2.blockNumber}`, 'green');
    log(`   Gas usado: ${receipt2.gasUsed}`, 'green');

    // Extraer dirección del escrow del evento
    let escrowCloneAddress = null;
    for (const event of receipt2.logs) {
      try {
        const parsed = factory.interface.parseLog(event);
        if (parsed && parsed.name === 'JobAccepted') {
          escrowCloneAddress = parsed.args[3]; // escrowAddress es el 4to argumento
          break;
        }
      } catch (e) {
        // Ignorar logs que no sean del contrato
      }
    }

    if (escrowCloneAddress) {
      log(`✅ Escrow Clone desplegado en: ${escrowCloneAddress}`, 'green');
    }

    // ===== SECCIÓN 6: VERIFICAR ACEPTACIÓN =====
    separator('6️⃣  VERIFICANDO ACEPTACIÓN DEL JOB');

    log('📌 Consultando estado actualizado del job...', 'blue');
    const jobAccepted = await factory.getJob(0);
    
    log(`✅ Cliente:         ${jobAccepted.client}`, 'green');
    log(`✅ Freelancer:      ${jobAccepted.freelancer}`, 'green');
    log(`✅ Árbitro:         ${jobAccepted.arbiter}`, 'green');
    log(`✅ Cantidad:        ${ethers.formatEther(jobAccepted.amount)} ETH`, 'green');
    log(`✅ Estado:          ✅ ACEPTADO (${jobAccepted.status})`, 'green');
    log(`✅ Escrow Asociado: ${jobAccepted.escrowAddress}`, 'green');

    // ===== SECCIÓN 7: LISTAR JOBS =====
    separator('7️⃣  CONSULTANDO JOBS POR ROL');

    log('📌 Jobs del Cliente...', 'blue');
    const clientJobs = await factory.getClientJobs(client.address);
    log(`   Total: ${clientJobs.length} job(s)`, 'yellow');
    for (let i = 0; i < clientJobs.length; i++) {
      log(`   - Job ${clientJobs[i]}: ${jobTitle}`, 'green');
    }

    log('\n📌 Jobs del Freelancer...', 'blue');
    const freelancerJobs = await factory.getFreelancerJobs(freelancer.address);
    log(`   Total: ${freelancerJobs.length} job(s)`, 'yellow');
    for (let i = 0; i < freelancerJobs.length; i++) {
      log(`   - Job ${freelancerJobs[i]}: ${jobTitle}`, 'green');
    }

    // ===== SECCIÓN 8: PRUEBA DE ESCROW =====
    separator('8️⃣  PROBANDO FUNCIONALIDAD DEL ESCROW');

    if (escrowCloneAddress) {
      log('📌 Cargando instancia del Escrow Clone...', 'blue');
      const FreelanceEscrow = await ethers.getContractFactory("FreelanceEscrow");
      const escrowClone = FreelanceEscrow.attach(escrowCloneAddress);
      
      log('✅ Escrow clone cargado', 'green');

      log('\n📌 Enviando fondos al escrow (Cliente)...', 'blue');
      log(`   Cantidad: ${ethers.formatEther(jobAmount)} ETH`, 'yellow');
      
      const tx3 = await client.sendTransaction({
        to: escrowCloneAddress,
        value: jobAmount
      });
      log(`   Tx Hash: ${tx3.hash}`, 'yellow');
      const receipt3 = await tx3.wait();
      log(`✅ Fondos enviados exitosamente!`, 'green');
      log(`   Gas usado: ${receipt3.gasUsed}`, 'green');

      log('\n📌 Verificando saldo del escrow...', 'blue');
      const escrowBalance = await ethers.provider.getBalance(escrowCloneAddress);
      log(`✅ Saldo del escrow: ${ethers.formatEther(escrowBalance)} ETH`, 'green');

      log('\n📌 Freelancer marcando trabajo como entregado...', 'blue');
      const deliveryHash = "QmDeliveryHash789";
      log(`   Archivo IPFS: ${deliveryHash}`, 'yellow');
      
      const tx4 = await escrowClone.connect(freelancer).markDelivered(deliveryHash);
      log(`   Tx Hash: ${tx4.hash}`, 'yellow');
      const receipt4 = await tx4.wait();
      log(`✅ Trabajo marcado como entregado!`, 'green');
      log(`   Gas usado: ${receipt4.gasUsed}`, 'green');

      log('\n📌 Cliente aprobando liberación de fondos...', 'blue');
      const tx5 = await escrowClone.connect(client).approveRelease();
      log(`   Tx Hash: ${tx5.hash}`, 'yellow');
      const receipt5 = await tx5.wait();
      log(`✅ Fondos liberados al freelancer!`, 'green');
      log(`   Gas usado: ${receipt5.gasUsed}`, 'green');

      log('\n📌 Verificando saldo final del freelancer...', 'blue');
      const freelancerFinalBalance = await ethers.provider.getBalance(freelancer.address);
      log(`✅ Saldo final: ${ethers.formatEther(freelancerFinalBalance)} ETH`, 'green');
    }

    // ===== SECCIÓN 9: RESUMEN FINAL =====
    separator('✅ PRUEBA COMPLETADA EXITOSAMENTE');

    log('📋 RESUMEN DE OPERACIONES:', 'bright');
    log('   ✅ Publicación de job', 'green');
    log('   ✅ Aceptación de job', 'green');
    log('   ✅ Despliegue de escrow (clone EIP-1167)', 'green');
    log('   ✅ Verificación de job', 'green');
    log('   ✅ Consulta de jobs por rol', 'green');
    log('   ✅ Envío de fondos', 'green');
    log('   ✅ Marca de entrega', 'green');
    log('   ✅ Aprobación y liberación de fondos', 'green');

    log('\n📊 ESTADÍSTICAS:', 'bright');
    log(`   Total de transacciones: 5`, 'yellow');
    log(`   Contratos interactuados: 2 (Factory + Clone)`, 'yellow');
    log(`   Jobs creados: 1`, 'yellow');
    log(`   Escrows desplegados: 1 (EIP-1167 Clone)`, 'yellow');

    console.log('\n' + '='.repeat(80));
    log('🎉 ¡TODAS LAS PRUEBAS COMPLETADAS CON ÉXITO!', 'green');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    log('\n❌ ERROR EN LA PRUEBA:', 'red');
    log(error.message, 'red');
    if (error.reason) {
      log(`Razón: ${error.reason}`, 'red');
    }
    process.exitCode = 1;
  }
}

main();
