# 🧪 Guía de Prueba Manual - JobFactory Frontend

## 📋 Requisitos Previos

- [ ] **Hardhat local**: Debe estar corriendo en `http://localhost:8545`
- [ ] **Smart Contracts desplegados**: JobFactory y FreelanceEscrow deben estar en la blockchain local
- [ ] **MetaMask instalada**: Extensión de navegador configurada
- [ ] **Cuenta de prueba**: Al menos 2 accounts en MetaMask con fondos locales
- [ ] **Frontend**: Servidor Next.js corriendo en `http://localhost:3000`

---

## 🚀 Paso 1: Verificar que todo está corriendo

### 1.1 Verificar Hardhat
```bash
# En otra terminal, verifica que Hardhat esté corriendo
curl http://localhost:8545

# Deberías ver respuesta JSON (error es normal si no es solicitud JSON válida)
```

### 1.2 Verificar Frontend
```bash
# En la carpeta frontend
cd frontend
npm run dev

# Deberías ver:
# ✓ Ready in 2.5s
# - Local: http://localhost:3000
```

### 1.3 Verificar Contrato Desplegado
```bash
# En otra terminal, checa los logs de Hardhat
# Busca direcciones como: JobFactory deployed to: 0x...

# O verifica en: /frontend/.env.local
# Deberías ver: NEXT_PUBLIC_JOB_FACTORY_ADDRESS=0x...
```

---

## 🔌 Paso 2: Conectar MetaMask

### 2.1 Abrir la aplicación
1. Abre navegador en `http://localhost:3000`
2. Deberías ver la página de inicio con hero section azul

### 2.2 Conectar wallet
1. Busca el botón "Conectar Wallet" o "Conectar MetaMask" en la esquina superior derecha
2. Haz clic
3. MetaMask se abrirá pidiendo permisos
4. Haz clic en "Siguiente" → "Conectar"
5. **Resultado esperado**:
   - El botón cambia a verde mostrando tu address truncada (primeros 6 + últimos 4 caracteres)
   - Hay un punto verde pulsante indicando conexión activa
   - Aparece botón "Desconectar"

### 2.3 Verificar estado
- [ ] La página muestra "Conectado: 0x5f73...d7c7" (o similar)
- [ ] El botón está en verde
- [ ] Hay un punto pulsante

---

## 📝 Paso 3: Publicar un Trabajo (Rol: Cliente)

### 3.1 Ir a publicar
1. En la página principal, haz clic en botón **"+ Publicar trabajo"**
2. Se abrirá un formulario con campos:
   - Título (máx 100 caracteres)
   - Descripción (máx 500 caracteres)
   - Presupuesto en ETH
   - Fecha de entrega

### 3.2 Llenar el formulario
```
Título: "Desarrollar API REST en Node.js"
Descripción: "Necesito una API REST con autenticación JWT, conectada a MongoDB"
Presupuesto: 2.5 (ETH)
Fecha: [Selecciona una fecha futura]
```

### 3.3 Enviar
1. Haz clic en **"🚀 Publicar trabajo"**
2. **Resultado esperado**:
   - Botón muestra "⏳ Publicando..."
   - MetaMask pide confirmación (firma de transacción)
   - Confirma en MetaMask
   - Tras 2-3 segundos, formulario se cierra
   - El nuevo trabajo aparece en la lista "Trabajos disponibles"

### 3.4 Verificar trabajo publicado
- [ ] El trabajo aparece en "Trabajos disponibles"
- [ ] Tiene estado **⏳ Pendiente** (header amarillo)
- [ ] Muestra presupuesto: "Ξ 2.5 ETH"
- [ ] Muestra fecha de entrega
- [ ] Muestra dirección del cliente (tu wallet)

---

## 🎯 Paso 4: Ver Panel de Cliente

### 4.1 Acceder al panel
1. Desde la página principal, haz clic en **"📊 Panel de cliente"**
2. O accede directamente a `http://localhost:3000/client`

### 4.2 Verificar estadísticas
Deberías ver:
- **Total publicados**: 1 (el trabajo que acabas de crear)
- **Pendientes**: 1
- **Aceptados**: 0
- **Cancelados**: 0

### 4.3 Verificar lista
- Tu trabajo publicado aparece en "Mis trabajos"
- Con estado "⏳ Pendiente"

---

## 🔄 Paso 5: Cambiar a Rol de Freelancer

### 5.1 Crear nueva cuenta
1. En MetaMask, crea una nueva cuenta (o usa otra existente)
2. Copia su address (necesitarás para comparar)
3. Vuelve a la primera cuenta (que tiene el trabajo publicado)
4. Recarga la página (F5)

### 5.2 Ir a Panel de Freelancer
1. Haz clic en **"👨‍💼 Panel de Freelancer"**
2. O accede a `http://localhost:3000/freelancer`

### 5.3 Verificar estadísticas
Deberías ver:
- **Trabajos aceptados**: 0
- **Disponibles**: 1 (el trabajo que creaste con la otra cuenta)
- **Ingresos potenciales**: 0

### 5.4 Verificar lista de disponibles
- Tu trabajo aparece en "Trabajos disponibles para aceptar"
- Con estado "⏳ Pendiente"
- Se puede ver el botón "Aceptar trabajo" (si está implementado)

---

## 🎭 Paso 6: Aceptar un Trabajo (Rol: Freelancer)

### 6.1 Cambiar a Freelancer
1. En MetaMask, cámbiate a una cuenta diferente a la que creó el trabajo
2. Recarga la página

### 6.2 Aceptar el trabajo
1. En "Trabajos disponibles", busca el trabajo publicado
2. Haz clic en **"Aceptar trabajo"** (si el botón está visible)
3. **Resultado esperado**:
   - MetaMask pide confirmación
   - Confirma la transacción
   - El botón cambia a "✅ Aceptado"
   - Aparece info del freelancer que lo aceptó

### 6.3 Verificar en Panel de Freelancer
1. Recarga la página
2. En "Mis trabajos en progreso" deberías ver el trabajo
3. Con estado **✅ Aceptado**

---

## 🧐 Paso 7: Verificar Filtros

### 7.1 En página principal
1. Haz clic en filtro **"Pendientes (⏳)"**
   - Deberías ver solo trabajos con estado pendiente
2. Haz clic en filtro **"Aceptados (✅)"**
   - Deberías ver solo trabajos aceptados
3. Haz clic en filtro **"Todos (📋)"**
   - Deberías ver todos los trabajos

### 7.2 Verificar contadores
- Cada filtro muestra un badge con el número de trabajos en esa categoría

---

## 📊 Paso 8: Verificar Datos en Consola

### 8.1 Abrir Developer Tools
1. Abre la consola del navegador (F12)
2. Ve a pestaña "Console"

### 8.2 Verificar conexión Web3
```javascript
// En la consola, verifica que Wagmi está conectado
// Deberías ver datos del account
```

### 8.3 Verificar Network
1. Ve a pestaña "Network"
2. Recarga la página
3. Verifica que las solicitudes se cargan correctamente
4. No deberías ver errores de CORS

---

## 🔍 Paso 9: Pruebas de Validación del Formulario

### 9.1 Probar validaciones
1. Vuelve a publicar un trabajo
2. **Prueba 1**: Intenta enviar sin llenar nada
   - Deberías ver: "El título es requerido"

3. **Prueba 2**: Llenar solo título
   - Deberías ver: "La descripción es requerida"

4. **Prueba 3**: Presupuesto = 0
   - Deberías ver: "El presupuesto debe ser mayor a 0"

5. **Prueba 4**: Fecha en el pasado
   - Deberías ver: "La fecha de entrega debe ser en el futuro"

### 9.2 Contador de caracteres
1. Escribe en "Título"
2. Deberías ver contador: "15/100"
3. Escribe en "Descripción"
4. Deberías ver contador: "45/500"

---

## 🏠 Paso 10: Navegación General

### 10.1 Probar navegación
1. Desde página principal → click en "Panel de cliente" → deberías estar en `/client`
2. Desde `/client` → click en "← Volver al inicio" → deberías estar en `/`
3. Desde página principal → click en "Panel de freelancer" → deberías estar en `/freelancer`
4. Verificar que Header y ConnectButton se ven en todas las páginas

### 10.2 Probar responsive (si quieres)
1. Abre DevTools (F12)
2. Click en "Toggle device toolbar" (Ctrl+Shift+M)
3. Selecciona "iPhone 12" o "iPad"
4. Verifica que el layout se adapta correctamente
5. Botones deben ser clickeables
6. Texto debe ser legible

---

## 🚨 Paso 11: Probar Desconexión

### 11.1 Desconectar wallet
1. Haz clic en el botón de wallet (verde, con tu address)
2. Deberías ver opción "Desconectar"
3. Haz clic
4. **Resultado esperado**:
   - Botón vuelve a ser azul
   - Muestra "Conectar MetaMask"
   - Ya no hay punto pulsante
   - Desaparece la dirección

### 11.2 Intentar acceder a panel
1. Intenta acceder a `/client` directamente en URL
2. O click en "Panel de cliente"
3. **Resultado esperado**:
   - Ves pantalla de "Acceso restringido" 🔒
   - Dice "Por favor conecta tu wallet para acceder"

---

## 📱 Paso 12: Checklist de Verificación Final

### Visual
- [ ] Header tiene logo "JF" con gradiente azul
- [ ] Header es sticky (se queda arriba al scroll)
- [ ] Hero section tiene fondo azul degradado
- [ ] Estadísticas tienen cards con emojis
- [ ] JobCards tienen color según estado (amarillo/verde/rojo)
- [ ] Botones tienen hover effects (sombra aumenta)
- [ ] Formulario tiene contador de caracteres
- [ ] Filtros se ven bonitos y responden bien

### Funcional
- [ ] Conectar/desconectar wallet funciona
- [ ] Publicar trabajo funciona
- [ ] Aceptar trabajo funciona
- [ ] Filtros filtran correctamente
- [ ] Navegación entre páginas funciona
- [ ] Validaciones del formulario funcionan
- [ ] Acceso restringido sin wallet funciona

### Responsive
- [ ] Mobile (375px): Todo legible y clickeable
- [ ] Tablet (768px): Layout se adapta bien
- [ ] Desktop (1280px): Todo se ve profesional

---

## 🐛 Paso 13: Si algo no funciona

### Error: "No se puede conectar al contrato"
- Verifica que JobFactory está desplegado en Hardhat
- Verifica que la dirección en `.env.local` es correcta
- Reinicia Hardhat: `npx hardhat node`

### Error: "MetaMask dice que estoy en red incorrecta"
- Verifica que MetaMask está configurado en localhost:8545 (Hardhat)
- Chainid debe ser 31337

### Error: "La transacción falla"
- Verifica que tu account tiene suficientes fondos
- Verifica que el contrato tiene suficiente gas
- Revisa los logs de Hardhat

### Error: "Las estadísticas no actualizan"
- Recarga la página (F5)
- Espera 2-3 segundos después de confirmar transacción
- Verifica en la consola que useJobFactory está obteniendo datos

---

## 🎉 ¡Listo!

Si todo funciona correctamente, tu aplicación está lista para:
- ✅ Conectar wallets
- ✅ Publicar trabajos
- ✅ Aceptar trabajos
- ✅ Ver estadísticas en tiempo real
- ✅ Filtrar por estado
- ✅ Navegación entre paneles

**Próximo paso**: Implementar `JobDetail.js` y `EscrowActions.js` para funcionalidad completa de escrow.

---

**Última actualización**: 9 de diciembre de 2024
