# 🎯 PASO A PASO - PRUEBA RÁPIDA (20 MIN)

## 🚀 Opción Más Rápida

### Paso 0: Preparación (2 min)
```bash
# Terminal 1
npx hardhat node

# Terminal 2
cd frontend && npm run dev

# Navegador: http://localhost:3000
```

### Paso 1: Conectar Wallet ✅ (2 min)
```
1. Click en "Conectar Wallet" (esquina superior derecha)
2. MetaMask aparece → Confirma
3. ✓ Botón se vuelve VERDE con tu address
```

### Paso 2: Publicar Trabajo 📝 (3 min)
```
1. Click "+ Publicar trabajo"
2. Llena:
   - Título: "API REST Node.js"
   - Descripción: "Crear API con autenticación"
   - Presupuesto: 2.5
   - Fecha: Mañana
3. Click "🚀 Publicar trabajo"
4. Confirma en MetaMask
5. ✓ El trabajo aparece con ⏳ amarillo
```

### Paso 3: Ver Panel de Cliente 📊 (1 min)
```
1. Click "📊 Panel de cliente"
2. ✓ Total: 1, Pendientes: 1
```

### Paso 4: Cambiar a Freelancer 🔄 (2 min)
```
1. MetaMask: Crea/selecciona OTRA cuenta
2. Recarga página (F5)
3. ✓ Dirección es diferente
```

### Paso 5: Aceptar Trabajo ✅ (3 min)
```
1. Click "👨‍💼 Panel de freelancer"
2. Click "Aceptar trabajo" del trabajo disponible
3. Confirma en MetaMask
4. Recarga (F5)
5. ✓ Trabajo ahora está en "Mis trabajos en progreso"
6. ✓ Estado es ✅ VERDE
```

### Paso 6: Verificar Filtros 🔍 (2 min)
```
1. Vuelve al inicio
2. Prueba filtros:
   - "Todos": 1 trabajo
   - "Pendientes": 0
   - "Aceptados": 1
   - "Cancelados": 0
```

### Paso 7: Validaciones ⚠️ (2 min)
```
1. Click "+ Publicar trabajo"
2. Envía sin llenar → ❌ Error "Título requerido"
3. Presupuesto = 0 → ❌ Error "Mayor a 0"
4. Fecha pasada → ❌ Error "Fecha futura"
```

### Paso 8: Visual 🎨 (1 min)
```
✓ Header azul con logo "JF" sticky
✓ Cards con emojis y hover effects
✓ Colores: amarillo (⏳), verde (✅), rojo (❌)
✓ Todo se ve profesional
```

---

## ✅ RESULTADO ESPERADO

Si TODOS los pasos funcionan:
```
✅ Conectar wallet
✅ Publicar trabajo
✅ Panel cliente
✅ Cambiar a freelancer
✅ Aceptar trabajo
✅ Filtros funcionan
✅ Validaciones funcionan
✅ UI se ve bien

→ ¡APLICACIÓN LISTA! 🎉
```

---

## 🐛 Si algo falla

```
1. Abre DevTools (F12)
2. Checa "Console" por errores
3. Verifica:
   - [ ] Hardhat corriendo
   - [ ] Frontend corriendo
   - [ ] MetaMask en Localhost 8545
   - [ ] Chain ID: 31337
4. Recarga página (F5)
5. Intenta de nuevo
```

---

## 📚 SI QUIERES MÁS DETALLES

```bash
# Opción 1: Script interactivo
bash prueba_visual.sh

# Opción 2: Lectura rápida
cat COMO_PROBAR.txt

# Opción 3: Checklist
cat CHECKLIST_PRUEBA.txt

# Opción 4: Guía completa
cat PRUEBA_MANUAL.md
```

---

**Tiempo Total**: ~20 minutos  
**Dificultad**: Fácil  
**Requisitos**: MetaMask + Hardhat corriendo

¡Éxito! 🚀
