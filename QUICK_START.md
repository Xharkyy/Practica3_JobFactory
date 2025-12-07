# ⚡ Quick Start - JobFactory

## 📋 Tabla de Contenidos

1. [Instalación (2 min)](#instalación)
2. [Tests (1 min)](#tests)
3. [Deployment Local (3 min)](#deployment-local)
4. [Uso desde Código (5 min)](#uso-desde-código)

---

## Instalación

### Paso 1: Dependencias
```bash
cd Practica3_JobFactory
npm install
```

**Esperado:**
```
added 579 packages, audited 580 packages in 33s
13 low severity vulnerabilities found
```

### Paso 2: Verificar Compilación
```bash
npm run compile
```

**Esperado:**
```
✔ Compiled 2 Solidity files successfully (evm target: paris)
```

✅ **Status:** Listo para tests

---

## Tests

```bash
npm test
```

**Esperado:**
```
✓ 14 tests passing (621ms)
✓ Gas data: First clone ~141k, subsequent ~161k
```

### Cobertura

| Área | Tests | Status |
|------|-------|--------|
| Job Creation | 3 | ✅ |
| Job Acceptance | 5 | ✅ |
| Escrow Flow | 2 | ✅ |
| Cancellation | 3 | ✅ |
| Gas Optimization | 1 | ✅ |

---

## Deployment Local

### Terminal 1: Iniciar Blockchain Local

```bash
npx hardhat node
```

**Outputs:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts:
(0) 0x1234...abcd
(1) 0x5678...efgh
...
```

### Terminal 2: Desplegar Contratos

```bash
npm run deploy
```

**Outputs:**
```
✅ FreelanceEscrow desplegado en: 0xabcd...
✅ JobFactory desplegado en: 0x1234...
```

✅ **Status:** Blockchain corriendo en http://127.0.0.1:8545

---

## Uso desde Código

### 1️⃣ Conectar Wallet

```javascript
import web3Service from './services/web3';

await web3Service.initialize();
console.log('✅ Conectado');
```

### 2️⃣ Publicar Job

```javascript
const tx = await web3Service.postJob(
  "Desarrollar landing page",           // título
  "Responsive, SEO-friendly",           // descripción
  ethers.parseEther("1.5"),             // cantidad ETH
  Math.floor(Date.now() / 1000) + 30*24*60*60,  // deadline (30 días)
  7*24*60*60,                           // challenge period (7 días)
  "QmXxxx..."                           // IPFS hash
);

const receipt = await tx.wait();
const jobId = receipt.logs[0].topics[1];
console.log('✅ Job publicado:', jobId);
```

### 3️⃣ Aceptar Job (como Freelancer)

```javascript
const tx = await web3Service.acceptJob(
  jobId,                    // ID del job
  arbiterAddress,           // dirección del árbitro
  deadlineTimestamp,        // timestamp del deadline
  challengePeriodSeconds    // segundos del challenge period
);

const receipt = await tx.wait();
console.log('✅ Job aceptado');
console.log('✅ Escrow clone desplegado en:', receipt.events[1].args.escrowAddress);
```

### 4️⃣ Fondear Escrow (Cliente)

```javascript
const escrowAddress = receipt.events[1].args.escrowAddress;
const tx = await web3Service.fundEscrow(escrowAddress);
await tx.wait();
console.log('✅ Escrow fondeado con 1.5 ETH');
```

### 5️⃣ Marcar Entrega (Freelancer)

```javascript
const tx = await web3Service.markDelivered(
  escrowAddress,
  "QmDeliveryHash..."    // IPFS hash del trabajo entregado
);
await tx.wait();
console.log('✅ Trabajo marcado como entregado');
```

### 6️⃣ Aprobar Pago (Cliente)

```javascript
const tx = await web3Service.approveRelease(escrowAddress);
await tx.wait();
console.log('✅ Pago liberado al freelancer');
```

---

## 🔗 Rutas de Archivos Clave

```
Practica3_JobFactory/
├── contracts/
│   ├── FreelanceEscrow.sol    ← Contrato del escrow
│   └── JobFactory.sol          ← Factory de jobs
├── test/
│   └── JobFactory.test.js      ← Suite de tests (14 tests)
├── src/
│   ├── services/
│   │   ├── web3.js             ← API Web3
│   │   └── ipfs.js             ← API IPFS
│   └── contracts/
│       └── addresses.js        ← Direcciones deployadas
├── scripts/
│   └── deploy.js               ← Script de despliegue
├── hardhat.config.js           ← Config Hardhat
├── package.json                ← Dependencias
├── DEPLOYMENT.md               ← Guía detallada
├── PROJECT_STATUS.md           ← Reporte completo
└── QUICK_START.md             ← Este archivo
```

---

## 🎯 Checklist

- [ ] `npm install` completado
- [ ] `npm run compile` sin errores
- [ ] `npm test` 14/14 pasando
- [ ] `npx hardhat node` corriendo en terminal 1
- [ ] `npm run deploy` completado
- [ ] `web3Service.initialize()` exitoso
- [ ] Job publicado correctamente
- [ ] Job aceptado y escrow desplegado

---

## 🐛 Troubleshooting

### Error: "Port 8545 in use"
```bash
# Cambiar puerto en hardhat.config.js
networks: {
  hardhat: {
    chainId: 1337,
  },
  localhost: {
    url: "http://127.0.0.1:8546"  // Cambiar puerto aquí
  }
}
```

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Contract not found"
Asegurarse de ejecutar `npm run deploy` en Terminal 2 mientras `npx hardhat node` corre en Terminal 1.

---

## 📚 Documentación Completa

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía de despliegue detallada
- **[TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)** - Documentación técnica
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Reporte del proyecto

---

## 💡 Ejemplo Completo

```javascript
import web3Service from './services/web3';
import ipfsService from './services/ipfs';

async function completeFlow() {
  // 1. Conectar
  await web3Service.initialize();
  
  // 2. Subir especificación a IPFS
  const specFile = new File(['...'], 'spec.json', { type: 'application/json' });
  const { cid: specCID } = await ipfsService.uploadJobSpecification(specFile);
  
  // 3. Publicar job
  const postTx = await web3Service.postJob(
    "Landing Page",
    "Responsive HTML/CSS",
    ethers.parseEther("1.5"),
    Math.floor(Date.now()/1000) + 30*24*60*60,
    7*24*60*60,
    specCID
  );
  const postReceipt = await postTx.wait();
  const jobId = postReceipt.logs[0].topics[1];
  
  // 4. Aceptar job
  const acceptTx = await web3Service.acceptJob(
    jobId,
    "0xArbiterAddress...",
    Math.floor(Date.now()/1000) + 30*24*60*60,
    7*24*60*60
  );
  const acceptReceipt = await acceptTx.wait();
  const escrowAddr = acceptReceipt.events[1].args.escrowAddress;
  
  // 5. Fondear escrow
  await (await web3Service.fundEscrow(escrowAddr)).wait();
  
  // 6. Entregar trabajo
  const deliveryFile = new File(['...'], 'delivery.zip');
  const { cid: deliveryCID } = await ipfsService.uploadDeliverable(deliveryFile);
  await (await web3Service.markDelivered(escrowAddr, deliveryCID)).wait();
  
  // 7. Aprobar pago
  await (await web3Service.approveRelease(escrowAddr)).wait();
  
  console.log('✅ Ciclo completo exitoso');
}

completeFlow().catch(console.error);
```

---

**Última actualización:** 7 de diciembre de 2025
**Status:** ✅ Production Ready (Fase 1)

