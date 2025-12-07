# 🏢 JobFactory - Marketplace Descentralizado de Trabajos

> Un marketplace blockchain descentralizado donde clientes publican trabajos y freelancers los aceptan, con escrows independientes desplegados automáticamente mediante clones EIP-1167.

## ✨ Características Principales

- **📋 Publicación de Trabajos**: Clientes publican jobs con descripción, presupuesto y plazo
- **🤝 Aceptación por Freelancers**: Los freelancers pueden aceptar trabajos disponibles
- **🔐 Escrow Inteligente**: Cada aceptación crea un contrato escrow independiente
- **💰 Gestión de Fondos**: Depósito, entrega, aprobación y liberación de pagos
- **⚖️ Resolución de Disputas**: Sistema de árbitro para resolver conflictos
- **📁 Almacenamiento IPFS**: Especificaciones y entregables guardados descentralizadamente
- **⚡ Optimización de Gas**: Usa EIP-1167 (clones mínimos) para reducir costos ~75%

## 🚀 Quick Start

### Instalación

```bash
# Clonar y entrar al directorio
cd Practica3_JobFactory

# Instalar dependencias
npm install

# Compilar contratos
npm run compile
```

### Ejecución de Tests

```bash
# Correr suite completa de tests
npm test

# Correr con cobertura
npx hardhat coverage
```

### Despliegue Local

```bash
# Terminal 1: Iniciar nodo Hardhat
npx hardhat node

# Terminal 2: Desplegar
npm run deploy

# Leer direcciones deployadas
cat deployments/localhost.json
```

## 📚 Documentación

- **[TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)** - Documentación técnica completa
  - Arquitectura detallada
  - Funciones de contrato
  - Flujos de usuario
  - Guías de integración
  - Troubleshooting

- **[agents.md](../agents.md)** - Governanza y operaciones
  - Roles de agentes
  - Workflows operacionales
  - Políticas de seguridad
  - Fuentes de verdad

## 🏗️ Arquitectura

### Contratos Inteligentes

```
┌──────────────────────────────────────┐
│          JobFactory                  │
│  ✓ Publicar jobs                    │
│  ✓ Registrar aceptaciones           │
│  ✓ Desplegar escrows (clones)       │
└─────────────┬────────────────────────┘
              │
    acceptJob()│ → crea clone
              ▼
    ┌─────────────────────┐
    │ FreelanceEscrow     │
    │ (EIP-1167 Clone)    │
    │ ✓ Gestiona fondos   │
    │ ✓ Valida entregas   │
    │ ✓ Resuelve disputas │
    └─────────────────────┘
```

### Stack Tecnológico

- **Blockchain:** Solidity ^0.8.30
- **Framework:** Hardhat
- **Pruebas:** Chai + Ethers.js
- **Frontend:** React + Ethers.js v6
- **Almacenamiento:** IPFS (Pinata)
- **Optimización:** EIP-1167 (Clones mínimos)

## 📋 Casos de Uso

### Cliente Publica Trabajo

```javascript
import web3Service from './services/web3';

// 1. Subir especificación a IPFS
const jobSpec = { title: "Build website", requirements: [...] };
const ipfsHash = await ipfsService.uploadJobSpecification(jobSpec);

// 2. Publicar job on-chain
await web3Service.postJob(
  "Build a React website",
  "Modern e-commerce site",
  1.5,  // 1.5 ETH
  Date.now() + 30*24*60*60*1000,  // 30 days deadline
  7*24*60*60,  // 7 days challenge period
  ipfsHash
);
```

### Freelancer Acepta Trabajo

```javascript
// 1. Visualizar job disponible
const job = await web3Service.getJob(jobId);

// 2. Aceptar job (crea escrow automáticamente)
const { escrowAddress } = await web3Service.acceptJob(
  jobId,
  arbiterAddress,
  deadline,
  challengePeriod
);
```

### Flujo Completo (Happy Path)

```javascript
// Cliente financia escrow
await web3Service.fundEscrow(escrowAddr, "1.5");

// Freelancer entrega trabajo
const deliveryFile = document.getElementById("file").files[0];
const deliveryHash = await ipfsService.uploadDeliverable(deliveryFile);
await web3Service.markDelivered(escrowAddr, deliveryHash);

// Cliente aprueba entrega
await web3Service.approveRelease(escrowAddr);
// → Freelancer recibe 1.5 ETH automáticamente
```

## 🛠️ Configuración

### Variables de Entorno

Crear `.env`:

```bash
# IPFS Gateway
REACT_APP_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs

# Pinata API (para uploads)
REACT_APP_PINATA_API_KEY=your_key_here
REACT_APP_PINATA_SECRET_KEY=your_secret_here
```

### Hardhat Config

```javascript
// hardhat.config.js
module.exports = {
  solidity: {
    version: "0.8.30",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    localhost: { url: "http://127.0.0.1:8545" },
    hardhat: { chainId: 1337 }
  }
};
```

## 📊 Estructura de Carpetas

```
Practica3_JobFactory/
├── contracts/                    # Contratos Solidity
│   ├── JobFactory.sol
│   └── FreelanceEscrow.sol
├── src/
│   ├── services/
│   │   ├── web3.js              # Web3 integration
│   │   └── ipfs.js              # IPFS integration
│   └── contracts/
│       ├── abis/                 # ABIs de contratos
│       └── addresses.js          # Direcciones deployadas
├── test/
│   └── JobFactory.test.js        # Suite de tests
├── scripts/
│   └── deploy.js                 # Script de deployment
├── hardhat.config.js
├── package.json
└── TECHNICAL_DOCUMENTATION.md
```

## 🧪 Tests

### Suite Completa

```bash
npm test
```

**Cobertura:**
- ✅ 15+ test cases
- ✅ Creación y cancelación de jobs
- ✅ Aceptación y despliegue de escrows
- ✅ Ciclo completo: fund → deliver → approve → release
- ✅ Manejo de disputas
- ✅ Timeouts y reembolsos
- ✅ Optimización de gas

## 🔐 Seguridad

### Protecciones

- ✅ **Reentrancy Guard**: Previene ataques de reentrancia
- ✅ **Access Control**: Restricciones por rol (cliente, freelancer, árbitro)
- ✅ **State Validation**: Transiciones de estado validadas
- ✅ **Timelock**: Plazos en blockchain no modificables
- ✅ **IPFS Integrity**: Hashes registrados on-chain

## 📈 Optimizaciones de Gas

### EIP-1167 Clones

**Reducción: ~75% en gas**

**Beneficio en números:**
- Precio gas: $100/gwei
- 1 escrow completo: 180k × 100 × 1e-9 = $0.018
- 100 escrows: 5.22 ETH vs 18 ETH = **Ahorro de 71%**

## 📞 Soporte

- **Documentación:** [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)
- **Governanza:** [agents.md](../agents.md)
- **Issues:** Crear issue con detalles y logs

## 📝 Licencia

GPL-3.0

---

**Hecho con ❤️ para Laboratorio de BlockChain - MUniCS**

## Estado actual

- Escrow funcional con subida de entregables a IPFS desde `localhost:3000`.
- JobFactory compilando y desplegable, pendiente de integrar completamente en la UI.
