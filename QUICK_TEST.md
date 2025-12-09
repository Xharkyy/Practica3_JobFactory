# ⚡ Resumen Rápido de Prueba

## 1️⃣ Preparación (5 min)

```bash
# Terminal 1: Asegurar que Hardhat está corriendo
npx hardhat node

# Terminal 2: Desplegar contratos (si es necesario)
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Iniciar frontend
cd frontend
npm run dev
# Verifica: http://localhost:3000 carga correctamente
```

## 2️⃣ Abrir Navegador (1 min)

- URL: `http://localhost:3000`
- Abre MetaMask (extensión navegador)
- Verifica que está conectada a "Localhost 8545"

## 3️⃣ Flujo Principal (10 min)

### Paso A: Conectar Wallet ✅
1. Haz clic en "Conectar Wallet" (esquina superior derecha)
2. Confirma en MetaMask
3. ✅ Verifica: botón se vuelve verde con tu address

### Paso B: Publicar Trabajo (Cliente) 🎯
1. Haz clic en "+ Publicar trabajo"
2. Llena:
   - **Título**: "Crear backend API"
   - **Descripción**: "API REST con Node.js y MongoDB"
   - **Presupuesto**: `2.5` ETH
   - **Fecha**: Elige un día futuro
3. Haz clic en "🚀 Publicar trabajo"
4. Confirma en MetaMask
5. ✅ Verifica: el trabajo aparece en la lista con estado **⏳ Pendiente**

### Paso C: Ver Panel de Cliente 📊
1. Haz clic en "📊 Panel de cliente"
2. ✅ Verifica:
   - **Total publicados**: 1
   - **Pendientes**: 1
   - Tu trabajo en "Mis trabajos"

### Paso D: Cambiar a Freelancer 🔄
1. En MetaMask, crea una **nueva cuenta** (o cámbiate a otra)
2. Recarga la página (F5)
3. Deberías ver el trabajo que publicaste en la lista

### Paso E: Aceptar Trabajo ✅
1. Haz clic en "👨‍💼 Panel de Freelancer"
2. Busca tu trabajo en "Trabajos disponibles para aceptar"
3. Haz clic en el botón "Aceptar trabajo"
4. Confirma en MetaMask
5. ✅ Verifica: 
   - El trabajo ahora está en "Mis trabajos en progreso"
   - Estado cambió a **✅ Aceptado**

### Paso F: Verificar Filtros 🔍
1. Vuelve a la página principal
2. Prueba los filtros:
   - "Pendientes (⏳)" → Muestra solo pendientes
   - "Aceptados (✅)" → Muestra solo aceptados
   - "Todos (📋)" → Muestra todos

### Paso G: Validaciones ⚠️
1. Vuelve a publicar un trabajo
2. Intenta enviar formulario vacío → Deberías ver error
3. Llena solo título → Deberías ver error de descripción
4. Presupuesto 0 → Deberías ver error
5. Fecha en el pasado → Deberías ver error

## 4️⃣ Verificación Visual (3 min)

- [ ] Header azul con logo "JF" (sticky al scroll)
- [ ] Hero section con gradiente azul
- [ ] Cards de estadísticas con emojis y hover effects
- [ ] JobCards con colores según estado (amarillo/verde/rojo)
- [ ] Formulario con contador de caracteres
- [ ] Botones con transiciones suaves
- [ ] Mensajes de error en rojo

## 5️⃣ Pruebas Responsive (opcional)

```
F12 → Toggle device toolbar (Ctrl+Shift+M)
- iPhone 12: Todo debe verse bien
- iPad: Todo debe verse bien
- Desktop: Todo debe verse bien
```

## ✅ Success Criteria

| Prueba | Resultado Esperado | Status |
|--------|-------------------|--------|
| Conectar wallet | Botón verde con address | ✓ |
| Publicar trabajo | Trabajo aparece en lista | ✓ |
| Panel cliente | Muestra estad. correctas | ✓ |
| Cambiar a freelancer | Ve trabajos disponibles | ✓ |
| Aceptar trabajo | Trabajo en "mis trabajos" | ✓ |
| Filtros | Filtran correctamente | ✓ |
| Validaciones | Muestran errores | ✓ |
| Visual | Todo se ve profesional | ✓ |

## 🐛 Si algo falla

| Problema | Solución |
|----------|----------|
| "No puedo conectar" | Verifica Hardhat corriendo en 8545 |
| "Contratos no están desplegados" | Ejecuta `npx hardhat run scripts/deploy.js --network localhost` |
| "MetaMask en red incorrecta" | Configura Network: Localhost 8545, Chain ID: 31337 |
| "Datos no actualizan" | Recarga página (F5) y espera 2-3 segundos |
| "Botones no responden" | Abre DevTools (F12), verifica errores en Console |

---

**Tiempo total**: ~30 minutos  
**Dificultad**: Fácil  
**Requisitos**: MetaMask + Hardhat corriendo + Frontend iniciado
