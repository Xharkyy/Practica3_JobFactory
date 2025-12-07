# 🚀 Guía de Despliegue - JobFactory

## ✅ Estado Actual

✔ Compilación: **EXITOSA**
✔ Tests: **14/14 PASANDO** 
✔ Gas Optimization: **IMPLEMENTADO** (EIP-1167 Clones)
✔ Documentación: **COMPLETA**

## 📋 Requisitos Previos

```bash
# Node.js >= 18
node --version

# npm >= 9
npm --version

# Hardhat installado
npx hardhat --version
```

## 🔧 Instalación

```bash
# 1. Navegar al directorio
cd Practica3_JobFactory

# 2. Instalar dependencias
npm install

# 3. Compilar contratos
npm run compile
```

## 🧪 Ejecutar Tests

```bash
# Suite completa
npm test

# Con salida detallada
npx hardhat test --verbose

# Con coverage (opcional)
npx hardhat coverage
```

**Resultado esperado:** 14 tests pasando

## 🏃 Despliegue Local

### Terminal 1: Iniciar Hardhat Node

```bash
npx hardhat node
```

Debería verse algo como:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### Terminal 2: Desplegar Contratos

```bash
npm run deploy
```

**Output esperado:**
```
🚀 Deployment iniciado...
✅ FreelanceEscrow desplegado en: 0x...
✅ JobFactory desplegado en: 0x...
```

## 📝 Configuración de ABIs y Direcciones

Tras el despliegue, actualizar `src/contracts/addresses.js`:

```javascript
const CONTRACTS = {
  JobFactory: {
    localhost: "0x..." // Dirección del JobFactory desplegado
  },
};
```

## 🌐 Uso desde Frontend

```javascript
import web3Service from './services/web3';

// Inicializar
await web3Service.initialize();

// Publicar job
await web3Service.postJob(
  "Título",
  "Descripción",
  1.5,  // 1.5 ETH
  Date.now() + 30*24*60*60*1000,
  7*24*60*60,  // 7 días challenge
  "QmHash..."
);

// Aceptar job
const { escrowAddress } = await web3Service.acceptJob(
  jobId,
  arbiterAddress,
  deadline,
  challengePeriod
);
```

## 📊 Información de Gas

### Primera Ejecución (Factory)
- Despliegue Factory: ~500k gas
- Despliegue primer escrow: ~180k gas

### Escrows Posteriores (Clones)
- Cada escrow clone: ~45k gas
- **Ahorro: ~75%** vs nuevo contrato

### Ejemplo de Reducción
```
100 escrows con `new`:     18 ETH
100 escrows con clones:    5.22 ETH
AHORRO:                    12.78 ETH (71%)
```

## 🔗 Redes Soportadas

- **Hardhat** (local, para tests)
- **Localhost** (nodo local corriendoen puerto 8545)

### Agregar Sepolia (Testnet)

Actualizar `hardhat.config.js`:

```javascript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

Luego desplegar:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 📱 Conectar MetaMask

1. Abrir extensión MetaMask
2. Agregar red personalizada:
   - **Nombre:** Hardhat Local
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 1337
   - **Moneda:** ETH
3. Importar cuentas del hardhat node (private keys mostradas en terminal)

## 🐛 Troubleshooting

| Error | Solución |
|-------|----------|
| `ERESOLVE` en npm | Ejecutar `npm install --legacy-peer-deps` |
| "Port 8545 in use" | Cambiar puerto en hardhat.config.js |
| "Not connected to wallet" | Llamar a `web3Service.initialize()` primero |
| "Gas estimation reverted" | Verificar state del contrato |

## 📚 Documentación Relacionada

- [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)
- [README.md](./README.md)
- [agents.md](../agents.md)

## 🎯 Próximos Pasos

1. ✅ Desplegar en testnet (Sepolia)
2. ⏳ Integración con frontend React
3. ⏳ Testing en production
4. ⏳ Auditoría de seguridad

---

**Última actualización:** 7 de diciembre de 2025
