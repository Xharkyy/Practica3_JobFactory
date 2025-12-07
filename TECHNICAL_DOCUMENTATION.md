# JobFactory - Marketplace Descentralizado

## 📋 Visión General

**JobFactory** es un marketplace descentralizado estilo Fiber que permite a clientes publicar encargos (trabajos) y a freelancers aceptarlos. Cada aceptación desencadena el despliegue automático de un contrato **FreelanceEscrow** individual mediante clones (EIP-1167), optimizando gas y manteniendo escrows independientes para cada trabajo.

### Arquitectura

```
┌─────────────────────────────────────┐
│      JobFactory (Factory)           │
│  - Publica jobs                     │
│  - Registra aceptaciones            │
│  - Despliega clones de escrow       │
└─────────────┬───────────────────────┘
              │
              │ acceptJob() → _deployEscrowClone()
              │
              ▼
    ┌──────────────────────┐
    │  FreelanceEscrow     │ (Clone via EIP-1167)
    │  - Escrow independiente
    │  - Gestiona fondos   │
    │  - Valida entregas   │
    │  - Resuelve disputas │
    └──────────────────────┘
```

---

## 🏗️ Estructura del Proyecto

```
Practica3_JobFactory/
├── contracts/                 # Contratos inteligentes
│   ├── FreelanceEscrow.sol   # Escrow para cada trabajo
│   └── JobFactory.sol         # Factory principal
├── src/                       # Frontend (React)
│   ├── services/
│   │   ├── web3.js           # Interacción blockchain
│   │   └── ipfs.js           # Gestión IPFS
│   └── contracts/
│       ├── abis/
│       │   ├── JobFactory.js  # ABI del factory
│       │   └── FreelanceEscrow.js
│       └── addresses.js       # Direcciones de despliegue
├── test/                      # Tests unitarios
│   └── JobFactory.test.js
├── scripts/
│   └── deploy.js             # Script de despliegue
├── hardhat.config.js         # Configuración Hardhat
├── package.json
└── README.md
```

---

## 🛠️ Configuración e Instalación

### 1. Dependencias

```bash
# Instalar dependencias
npm install

# Verificar Hardhat
npx hardhat --version
```

### 2. Variables de Entorno

Crear `.env` en la raíz (copiar de `.env.example`):

```
REACT_APP_PINATA_API_KEY=tu_api_key_aqui
REACT_APP_PINATA_SECRET_KEY=tu_secret_key_aqui
```

### 3. Compilación

```bash
# Compilar contratos
npm run compile

# O con Hardhat directamente
npx hardhat compile
```

---

## 📝 Contratos Inteligentes

### FreelanceEscrow

**Responsabilidades:**
- Gestionar fondos (depósito, liberación, reembolso)
- Registrar entregas con hash IPFS
- Manejar disputas con árbitro
- Imponer timeouts de vencimiento

**Estados:**
```
Created → Funded → Delivered ──► Released/Refunded
                      ↓
                   Disputed → Released (árbitro)
```

**Funciones Clave:**
```solidity
initialize(...)           // Inicializar (1 sola vez)
fund()                    // Cliente deposita ETH
markDelivered(ipfsHash)  // Freelancer marca entrega
approveRelease()          // Cliente aprueba
releaseAfterChallenge()   // Auto-libera tras período
raiseDispute()            // Abre disputa
resolveDispute(amount)    // Árbitro resuelve
refundIfDeadlinePassed()  // Reembolso si vence plazo
```

### JobFactory

**Responsabilidades:**
- Publicar y registrar jobs
- Aceptar freelancers y desplegar escrows
- Mantener histórico on-chain
- Permitir cancelación de jobs no aceptados

**Funciones Clave:**
```solidity
postJob(params, title, desc, ipfsHash)     // Publica job
acceptJob(jobId, arbiter, deadline, period) // Freelancer acepta
cancelJob(jobId)                           // Cliente cancela
getJob(jobId)                              // Obtiene job
getClientJobs(addr)                        // Jobs del cliente
getFreelancerJobs(addr)                    // Jobs del freelancer
```

**Optimización EIP-1167:**
```solidity
function _cloneEscrow(address implementation) internal returns (address) {
    // Usa inline assembly para crear minimal proxy
    // Reduce gas ~95% vs `new FreelanceEscrow()`
}
```

---

## 🧪 Tests

### Ejecución

```bash
# Correr todos los tests
npm test

# Correr específico
npx hardhat test test/JobFactory.test.js

# Con cobertura
npx hardhat coverage
```

### Cobertura de Tests

✅ **Creación de Jobs:**
- Publicar nuevo job
- Rastrear jobs del cliente
- Validar parámetros

✅ **Aceptación de Jobs:**
- Freelancer acepta job
- Despliegue de escrow clone
- Prevención de doble aceptación

✅ **Flujo Escrow Completo:**
- Depósito de fondos
- Marca de entrega con IPFS
- Aprobación de cliente
- Auto-liberación tras período
- Disputas y resolución de árbitro
- Reembolso por vencimiento

✅ **Optimización:**
- Gas eficiente con clones

---

## 🚀 Despliegue

### En Red Local (Hardhat Node)

```bash
# Terminal 1: Iniciar nodo local
npx hardhat node

# Terminal 2: Desplegar
npm run deploy
```

Salida esperada:
```
🚀 Iniciando deployment...
📝 Deploying contratos con: 0x...
1️⃣  Desplegando FreelanceEscrow...
✅ FreelanceEscrow desplegado en: 0x...
2️⃣  Desplegando JobFactory...
✅ JobFactory desplegado en: 0x...
```

### Redes Soportadas

El archivo `hardhat.config.js` soporta:
- `hardhat` (network local, por defecto en tests)
- `localhost` (nodo corriendolocalmente)

Para agregar Sepolia, Goerli, etc.:
```javascript
sepolia: {
  url: process.env.SEPOLIA_RPC_URL,
  accounts: [process.env.PRIVATE_KEY],
}
```

---

## 🌐 Integración Frontend

### Web3Service

Proporciona interface limpia a los contratos:

```javascript
import web3Service from './services/web3';

// Inicializar
await web3Service.initialize();

// Publicar job
await web3Service.postJob(
  "Título",
  "Descripción",
  1.0,  // amount en ETH
  Date.now() + 7*24*60*60*1000,  // deadline
  2*24*60*60,  // challengePeriod en segundos
  "QmHash..."  // IPFS hash
);

// Aceptar job
await web3Service.acceptJob(jobId, arbiterAddr, deadline, challengePeriod);

// Financiar escrow
await web3Service.fundEscrow(escrowAddr, "1.0");

// Marcar entrega
await web3Service.markDelivered(escrowAddr, "QmDeliveryHash...");

// Aprobar liberación
await web3Service.approveRelease(escrowAddr);
```

### IPFSService

Gestiona subida a IPFS:

```javascript
import ipfsService from './services/ipfs';

// Subir especificación de job
const jobSpec = {
  title: "Build website",
  requirements: ["React", "Node.js"],
  deliverables: ["Deployed URL", "Source code"]
};
const cid = await ipfsService.uploadJobSpecification(jobSpec);

// Subir entregable (archivo)
const deliveryCid = await ipfsService.uploadDeliverable(fileInput.files[0]);

// Obtener especificación
const spec = await ipfsService.getJobSpecification(cid);

// Generar URL pública
const publicUrl = ipfsService.getPublicUrl(cid);
```

---

## 📊 Flujo de Usuario

### Cliente

1. **Publica Job:**
   - Llena formulario (título, descripción, presupuesto)
   - Especificación sube a IPFS
   - Publica job on-chain vía `postJob()`

2. **Freelancer Acepta:**
   - Visualiza job disponible
   - Acepta vía `acceptJob()`
   - Se despliega escrow automáticamente

3. **Financia Escrow:**
   - Llama `fund()` en escrow con exacto `amount`

4. **Recibe Entrega:**
   - Freelancer marca `markDelivered(ipfsHash)`
   - Cliente puede ver entregable vía IPFS
   - Aprueba con `approveRelease()` → Freelancer recibe fondos

5. **Alternativa - Disputa:**
   - Si desacuerdo → `raiseDispute()`
   - Árbitro resuelve vía `resolveDispute(cantidad)`

### Freelancer

1. **Busca Jobs:**
   - Navega jobs abiertos en JobFactory
   - Ve detalles y especificación desde IPFS

2. **Acepta Job:**
   - Acepta job vía `acceptJob()`
   - Se crea escrow independiente

3. **Entrega Trabajo:**
   - Sube entregables a IPFS
   - Llama `markDelivered(ipfsHash)`

4. **Recibe Pago:**
   - Cliente aprueba → Recibe fondos
   - O período de challenge pasa → Auto-liberación
   - O disputa se resuelve a su favor

---

## 🔒 Seguridad

### Protecciones Implementadas

✅ **Reentrancy Protection:**
```solidity
modifier nonReentrant() { /* ... */ }
```

✅ **Access Control:**
- Modificadores `onlyClient`, `onlyFreelancer`, `onlyArbiter`

✅ **State Validation:**
- Transiciones de estado validadas con `inState()`

✅ **Deadline Protection:**
- Plazos en blockchain no pueden modificarse

✅ **IPFS Immutability:**
- Hash de entrega registrado on-chain = prueba

### Auditoría de Seguridad

Antes de mainnet:
```bash
# Análisis estático
npx slither .

# Verificación manual
# - Revisión de reentrancy
# - Validación de overflow/underflow (v0.8.30+)
# - Revisión de access controls
```

---

## 📈 Optimizaciones

### Gas - EIP-1167 Clones

**Beneficio:**
- Primer escrow: ~180k gas
- Siguientes escrows: ~45k gas (~75% reducción)

```solidity
// Minimal Proxy pattern assembly implementation
// Crea un proxy que delega a implementación
```

### Packing de Parámetros

```solidity
struct JobParams {
    uint256 amount;
    uint256 deadline;
    uint256 challengePeriod;
}
// Vs 3 parámetros sueltos → menos stack depth
```

---

## 🛠️ Troubleshooting

### "MetaMask no detectado"
- Instalar extensión MetaMask
- Asegurarse que esté conectada a red correcta

### "JobFactory no ha sido deployado"
- Ejecutar `npm run deploy` primero
- Verificar que `.env` tenga direcciones correctas

### "Transacción falla - Wrong Value"
- Verificar amount exacto (incluyendo decimales)
- Usar `ethers.parseEther()` para convertir

### "IPFS Upload falla"
- Verificar credenciales Pinata en `.env`
- Validar tamaño de archivo (<100MB)

---

## 📚 Referencias

- [Hardhat Docs](https://hardhat.org)
- [EIP-1167 Minimal Proxy](https://eips.ethereum.org/EIPS/eip-1167)
- [OpenZeppelin Clones](https://docs.openzeppelin.com/contracts/4.x/api/proxy#Clones)
- [IPFS Docs](https://docs.ipfs.io)
- [Ethers.js v6](https://docs.ethers.org/v6)

---

## 📄 Licencia

GPL-3.0

---

## 👨‍💼 Governanza

Ver `agents.md` para detalles sobre:
- Roles y responsabilidades (DevCore, Web3Integrator, IPFSManager, SecureOps, QA-Orchestrator)
- Workflows operacionales
- Políticas de seguridad
- Fuentes de verdad
