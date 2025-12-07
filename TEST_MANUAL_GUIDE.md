# 🧪 Guía de Prueba Manual - JobFactory

Esta guía te muestra cómo ejecutar una prueba de funcionamiento completa y detallada del proyecto JobFactory.

## 📋 Pre-requisitos

- Node.js >= 18
- npm >= 9
- Dependencias instaladas (`npm install`)
- Contratos compilados (`npm run compile`)

## 🚀 Ejecución en 4 Pasos

### Paso 1: Abrir Terminal 1 - Iniciar Blockchain Local

```bash
cd Practica3_JobFactory
npx hardhat node
```

**Esperado (no cierres esta terminal):**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts:
(0) 0x1234...
(1) 0x5678...
...
```

### Paso 2: Abrir Terminal 2 - Desplegar Contratos

```bash
cd Practica3_JobFactory
npm run deploy
```

**Esperado:**
```
🚀 Deployment iniciado...
✅ FreelanceEscrow desplegado en: 0x...
✅ JobFactory desplegado en: 0x...
```

### Paso 3: Abrir Terminal 3 - Ejecutar Prueba Manual

```bash
cd Practica3_JobFactory
npx hardhat run test-manual.js --network localhost
```

## 📊 Qué Verás en la Ejecución

### Sección 1: Inicialización
- Se muestran las 4 cuentas de prueba
- Se verifica el balance inicial (ETH disponible)

### Sección 2: Carga de Contratos
- JobFactory cargado
- FreelanceEscrow cargado

### Sección 3: Publicación de Job
- Se muestra toda la información del job
- Se envía la transacción y se espera confirmación

### Sección 4: Verificación de Job
- Se consulta y muestra el estado del job publicado

### Sección 5: Aceptación de Job
- Freelancer acepta el job
- Se despliega automáticamente un escrow clone (EIP-1167)

### Sección 6: Verificación de Aceptación
- Se muestra la información actualizada del job
- Se muestra la dirección del escrow desplegado

### Sección 7: Consulta de Jobs
- Se listan todos los jobs del cliente
- Se listan todos los jobs del freelancer

### Sección 8: Prueba de Escrow (Flujo Completo)
- Cliente envía 1.5 ETH al escrow
- Freelancer marca el trabajo como entregado
- Cliente aprueba y libera los fondos
- Se verifica el balance final del freelancer

### Sección 9: Resumen Final
- Estadísticas de todas las operaciones realizadas

## 🎯 Flujo Completo de Datos

```
1. PUBLICACIÓN
   Cliente → JobFactory.postJob() → Se crea Job #0

2. ACEPTACIÓN
   Freelancer → JobFactory.acceptJob() → Se despliega Escrow Clone

3. FONDEO
   Cliente → Escrow.fund() → Escrow recibe 1.5 ETH

4. ENTREGA
   Freelancer → Escrow.markDelivered() → Se marca entrega

5. LIBERACIÓN
   Cliente → Escrow.approveRelease() → Fondos van al Freelancer
```

## 📈 Información que se Muestra

### Por cada transacción:
- Hash de transacción
- Bloque en que fue incluida
- Gas utilizado
- Confirmación de éxito

### Por cada estado:
- Direcciones de participantes
- Cantidades en ETH
- Estado actual
- IPFS hashes

### Estadísticas finales:
- Total de transacciones
- Contratos interactuados
- Jobs creados
- Escrows desplegados

## ⚠️ Posibles Errores y Soluciones

### Error: "Port 8545 in use"
**Solución:** Ya hay un nodo corriendo. Mata el proceso:
```bash
lsof -ti:8545 | xargs kill -9
```

### Error: "Contract not deployed"
**Solución:** Asegúrate de que ejecutaste `npm run deploy` en Terminal 2

### Error: "Escrow address not found"
**Solución:** El script intentará hacer deploy automático. Espera a que termine.

## 🎓 Qué Aprendes

✅ Cómo funcionan los smart contracts en una red local
✅ Cómo se despliegan contratos dinámicamente
✅ Cómo se comunican múltiples contratos
✅ Cómo se transfieren fondos en blockchain
✅ Cómo funcionan los eventos (logs)
✅ Cómo se interactúa con un escrow
✅ Cómo se optimiza gas con clones (EIP-1167)

## 💾 Archivos Generados

Durante la ejecución se puede generar:
- `deployments.json` - Direcciones de contratos desplegados

## 📞 Troubleshooting

**Si quieres ver más detalles de la blockchain:**
```bash
npx hardhat test --verbose
```

**Si quieres resetear todo:**
```bash
rm -rf artifacts cache
npm run compile
```

**Si quieres ver las transacciones directamente:**
```bash
npx hardhat node
# En otra terminal
curl http://127.0.0.1:8545 -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

**¡Ahora estás listo para hacer la prueba!** 🚀

Ejecuta los 3 pasos en orden y observa cómo funciona todo el sistema.
