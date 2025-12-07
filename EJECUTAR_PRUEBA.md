# 🎬 CÓMO EJECUTAR LA PRUEBA DE FUNCIONAMIENTO

## 📌 Resumen Rápido

Necesitas **3 terminales** abiertas al mismo tiempo ejecutando en este orden:

```
Terminal 1 → Blockchain Local
Terminal 2 → Despliegue de Contratos  
Terminal 3 → Ejecución de Prueba Manual
```

---

## 🔥 PASO 1: Terminal 1 - Blockchain Local

**Abre una primera terminal y ejecuta:**

```bash
cd /Users/carlosfdezdeus/Documents/MUniCS/1\ MUniCS/BC\ -\ BlockChain/Laboratorio/Git\ -\ Lab\ 3/Practica3_JobFactory
npx hardhat node
```

**Deberías ver:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts:
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
(1) 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
```

⚠️ **NO CIERRES ESTA TERMINAL** - Déjala ejecutándose

---

## 🔧 PASO 2: Terminal 2 - Despliegue de Contratos

**Abre una segunda terminal y ejecuta:**

```bash
cd /Users/carlosfdezdeus/Documents/MUniCS/1\ MUniCS/BC\ -\ BlockChain/Laboratorio/Git\ -\ Lab\ 3/Practica3_JobFactory
npm run deploy
```

**Deberías ver:**
```
🚀 Deployment iniciado...
✅ FreelanceEscrow desplegado en: 0x5fbdb2315678afecb367f032d93f642f64180aa3
✅ JobFactory desplegado en: 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
```

✅ **Puedes cerrar esta terminal** - Ya está desplegado

---

## 🧪 PASO 3: Terminal 3 - Ejecutar Prueba Manual

**Abre una tercera terminal y ejecuta:**

```bash
cd /Users/carlosfdezdeus/Documents/MUniCS/1\ MUniCS/BC\ -\ BlockChain/Laboratorio/Git\ -\ Lab\ 3/Practica3_JobFactory
npx hardhat run test-manual.js --network localhost
```

**Ahora verás la prueba completa con mucho detalle:**

```
================================================================================
  🚀 PRUEBA DE FUNCIONAMIENTO - JobFactory Marketplace
================================================================================

================================================================================
  1️⃣  INICIALIZACIÓN Y SETUP
================================================================================

📌 Obteniendo cuentas de Hardhat...
✅ Cliente:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
✅ Freelancer:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
✅ Árbitro:     0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
✅ Otro:        0x90F79bf6EB2c4f870365E785982E1f101E93b906

📊 Verificando saldos iniciales...
   Cliente:     10000 ETH
   Freelancer:  10000 ETH

================================================================================
  2️⃣  CARGANDO CONTRATOS
================================================================================

📌 Obteniendo direcciones desplegadas...
✅ JobFactory cargado desde: 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
✅ FreelanceEscrow cargado desde: 0x5fbdb2315678afecb367f032d93f642f64180aa3
✅ Contratos cargados exitosamente!

================================================================================
  3️⃣  PUBLICANDO UN JOB
================================================================================

📌 Cliente está publicando un nuevo job...
   Título:           Desarrollo de Landing Page
   Descripción:      Crear una landing page responsiva y moderna...
   Cantidad:         1.5 ETH
   Plazo (días):     30
   Challenge (días): 7
   IPFS Hash:        QmExampleHash123456

📝 Enviando transacción...
   Tx Hash: 0xabc123...
   Esperando confirmación...
✅ Job publicado exitosamente!
   Bloque: 3
   Gas usado: 125000

... (continúa con más secciones)

================================================================================
✅ PRUEBA COMPLETADA EXITOSAMENTE
================================================================================

📋 RESUMEN DE OPERACIONES:
   ✅ Publicación de job
   ✅ Aceptación de job
   ✅ Despliegue de escrow (clone EIP-1167)
   ✅ Verificación de job
   ✅ Consulta de jobs por rol
   ✅ Envío de fondos
   ✅ Marca de entrega
   ✅ Aprobación y liberación de fondos

📊 ESTADÍSTICAS:
   Total de transacciones: 5
   Contratos interactuados: 2 (Factory + Clone)
   Jobs creados: 1
   Escrows desplegados: 1 (EIP-1167 Clone)

🎉 ¡TODAS LAS PRUEBAS COMPLETADAS CON ÉXITO!
```

---

## 📊 Lo Que Verás en Detalle

### 9 Secciones Principales:

| # | Sección | Qué Hace |
|---|---------|----------|
| 1️⃣ | Inicialización | Muestra cuentas y saldos |
| 2️⃣ | Carga de Contratos | Carga los contratos |
| 3️⃣ | Publicación de Job | Cliente publica un job |
| 4️⃣ | Verificación de Job | Verifica que se creó |
| 5️⃣ | Aceptación de Job | Freelancer acepta |
| 6️⃣ | Verificación de Aceptación | Verifica la aceptación |
| 7️⃣ | Consulta de Jobs | Listar jobs por rol |
| 8️⃣ | Flujo Completo del Escrow | Fondeo, entrega, pago |
| 9️⃣ | Resumen Final | Estadísticas totales |

---

## 🎯 Flujo Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                         TERMINAL 1                              │
│                    Blockchain Local                             │
│              npx hardhat node (DÉJALA CORRIENDO)               │
│                                                                 │
│  Started HTTP and WebSocket JSON-RPC server at                │
│  http://127.0.0.1:8545/                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         TERMINAL 2                              │
│                 Despliegue de Contratos                         │
│                      npm run deploy                             │
│                                                                 │
│  ✅ FreelanceEscrow desplegado en: 0x5fbd...                  │
│  ✅ JobFactory desplegado en: 0xe7f1...                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         TERMINAL 3                              │
│              Ejecución de Prueba Manual                         │
│        npx hardhat run test-manual.js --network localhost      │
│                                                                 │
│  🚀 PRUEBA DE FUNCIONAMIENTO - JobFactory Marketplace          │
│  ✅ Inicialización                                             │
│  ✅ Carga de Contratos                                         │
│  ✅ Publicación de Job                                         │
│  ✅ Aceptación de Job                                          │
│  ✅ Despliegue de Escrow Clone                                 │
│  ✅ Flujo Completo de Fondeo y Pago                            │
│  ✅ PRUEBA COMPLETADA CON ÉXITO                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Verificación Paso a Paso

Para asegurar que todo funciona:

1. **Terminal 1 - Blockchain:**
   - ✅ HTTP server corriendo en 127.0.0.1:8545
   - ✅ 20 cuentas disponibles
   - ✅ Cada una con 10,000 ETH

2. **Terminal 2 - Deploy:**
   - ✅ FreelanceEscrow desplegado
   - ✅ JobFactory desplegado
   - ✅ Ambas direcciones mostradas

3. **Terminal 3 - Prueba:**
   - ✅ Todas las secciones ejecutadas sin error
   - ✅ Transacciones confirmadas
   - ✅ Mensaje final: "TODAS LAS PRUEBAS COMPLETADAS CON ÉXITO"

---

## 🐛 Troubleshooting

### ¿Qué pasa si veo "Port 8545 already in use"?

```bash
# Mata el proceso que está usando el puerto
lsof -ti:8545 | xargs kill -9

# Ahora intenta de nuevo
npx hardhat node
```

### ¿Qué pasa si dice "Contract not deployed"?

Asegúrate de ejecutar en este orden:
1. Terminal 1: `npx hardhat node` 
2. Terminal 2: `npm run deploy`
3. Terminal 3: `npx hardhat run test-manual.js --network localhost`

### ¿Qué pasa si hay error "ECONNREFUSED"?

Significa que el blockchain en Terminal 1 no está corriendo.
- Verifica que Terminal 1 esté activa
- Debe mostrar: "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"

---

## 📈 Información que Verás

**Por cada sección:**
- ✅ Título colorido
- ✅ Descripción de qué está pasando
- ✅ Datos específicos (direcciones, cantidades, etc.)
- ✅ Hash de transacciones
- ✅ Gas utilizado
- ✅ Confirmación de éxito

**Al final:**
- ✅ Resumen de todas las operaciones
- ✅ Estadísticas totales
- ✅ Confirmación de éxito completo

---

## 🎓 Qué Demostramos

✅ **Publicación de Jobs** - Cliente crea trabajo
✅ **Aceptación de Jobs** - Freelancer acepta
✅ **Despliegue Dinámico** - Escrow se crea automáticamente
✅ **EIP-1167 Clones** - Clonación de contratos para ahorrar gas
✅ **Transferencia de Fondos** - ETH se transfiere en la blockchain
✅ **Escrow Completo** - Flujo completo de pago
✅ **Consultas Complejas** - Búsqueda de jobs por rol

---

## 💾 Archivos Utilizados

- `test-manual.js` - Script de prueba con mucho detalle
- `contracts/JobFactory.sol` - Contrato factory
- `contracts/FreelanceEscrow.sol` - Contrato escrow
- `hardhat.config.js` - Configuración de Hardhat

---

**¡Ahora estás listo para hacer la prueba completa!**

Los 3 pasos en orden → Verás todo funcionando en vivo ✅

