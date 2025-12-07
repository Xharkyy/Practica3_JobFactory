# 🎬 INSTRUCCIONES FINALES - Cómo Ejecutar la Prueba

## ⚠️ IMPORTANTE: Debes ejecutar 3 comandos en 3 terminales DIFERENTES

### PASO 1: Abre Terminal 1

```bash
cd /Users/carlosfdezdeus/Documents/MUniCS/1\ MUniCS/BC\ -\ BlockChain/Laboratorio/Git\ -\ Lab\ 3/Practica3_JobFactory
npx hardhat node
```

**Espera a ver:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

⚠️ **NO CIERRES ESTA TERMINAL - La necesitas abierta todo el tiempo**

---

### PASO 2: Abre Terminal 2

```bash
cd /Users/carlosfdezdeus/Documents/MUniCS/1\ MUniCS/BC\ -\ BlockChain/Laboratorio/Git\ -\ Lab\ 3/Practica3_JobFactory
npm run deploy
```

**Espera a ver:**
```
🚀 Deployment iniciado...
✅ FreelanceEscrow desplegado en: 0x...
✅ JobFactory desplegado en: 0x...
```

✅ Puedes cerrar esta terminal

---

### PASO 3: Abre Terminal 3

```bash
cd /Users/carlosfdezdeus/Documents/MUniCS/1\ MUniCS/BC\ -\ BlockChain/Laboratorio/Git\ -\ Lab\ 3/Practica3_JobFactory
npx hardhat run test-manual-simple.js --network localhost
```

**Verás la prueba completa con 9 secciones**

---

## 📌 ORDEN IMPORTANTE

1. ✅ Terminal 1: `npx hardhat node` (PRIMERA, MANTÉN ABIERTA)
2. ✅ Terminal 2: `npm run deploy` (SEGUNDA, luego ciérrala)
3. ✅ Terminal 3: `npx hardhat run test-manual-simple.js --network localhost` (TERCERA, verás todo)

**No ejecutes Terminal 3 sin que Terminal 1 esté corriendo**

---

## ✅ Qué Verás

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
...

================================================================================
  2️⃣  DESPLIEGUE DE CONTRATOS
================================================================================

📌 Desplegando FreelanceEscrow...
✅ FreelanceEscrow desplegado en: 0x5fbdb2315678afecb367f032d93f642f64180aa3

📌 Desplegando JobFactory...
✅ JobFactory desplegado en: 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512

================================================================================
  3️⃣  PUBLICANDO UN JOB
================================================================================

📌 Cliente está publicando un nuevo job...
   Título:     Desarrollo de Landing Page
   Cantidad:   1.5 ETH

📝 Enviando transacción...
✅ Job publicado exitosamente!

... (9 secciones en total) ...

================================================================================
✅ PRUEBA COMPLETADA EXITOSAMENTE
================================================================================

🎉 ¡TODAS LAS PRUEBAS COMPLETADAS CON ÉXITO!
```

---

## 🐛 Si Tienes Error "Cannot connect to the network localhost"

Significa que Terminal 1 (`npx hardhat node`) NO está corriendo.

**Solución:**
1. Verifica que Terminal 1 esté abierta y muestre: `Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/`
2. Si no está, ejecuta: `npx hardhat node` en Terminal 1
3. Luego ejecuta Terminal 3

---

**¡Ahora ejecuta los 3 pasos en orden y tendrás tu prueba funcionando!** ✅
