# 🚀 GUÍA RÁPIDA DE PRUEBA - JobFactory Frontend

## 📌 RESUMEN EJECUTIVO

Tienes **4 opciones** para probar tu aplicación:

### Opción 1: Script Visual Interactivo ⭐ (RECOMENDADO)
```bash
bash prueba_visual.sh
# Te guía paso a paso con instrucciones visuales
# Tiempo: ~30 minutos
```

### Opción 2: Checklist Rápido
```
Abre: CHECKLIST_PRUEBA.txt
Sigue los pasos marcando ✓
Tiempo: ~25 minutos
```

### Opción 3: Guía Detallada
```
Abre: PRUEBA_MANUAL.md
Lectura completa con explicaciones
Tiempo: ~45 minutos
```

### Opción 4: Resumen Ultra-Rápido
```
Abre: QUICK_TEST.md
Solo lo esencial
Tiempo: ~20 minutos
```

---

## 🎯 FLUJO GENERAL EN 5 PASOS

```
1. Conectar Wallet 👛
   └─ Botón "Conectar Wallet" → Confirma en MetaMask

2. Publicar Trabajo 📝
   └─ "+ Publicar trabajo" → Llena formulario → Publica

3. Ver como Cliente 📊
   └─ "Panel de cliente" → Verifica tu trabajo publicado

4. Cambiar a Freelancer 🔄
   └─ Otra cuenta en MetaMask → Recarga página

5. Aceptar Trabajo ✅
   └─ "Panel freelancer" → "Aceptar trabajo"
```

---

## 📊 VERIFICACIONES CLAVE

### ✅ Debe Funcionar
- [ ] Conectar/desconectar wallet
- [ ] Publicar nuevo trabajo
- [ ] Aceptar trabajo como freelancer
- [ ] Filtros (Todos, Pendientes, Aceptados)
- [ ] Panel de cliente
- [ ] Panel de freelancer
- [ ] Validaciones del formulario
- [ ] Acceso restringido sin wallet

### 🎨 Debe Verse Bien
- [ ] Header sticky con logo azul
- [ ] Hero section con gradiente
- [ ] Cards con hover effects
- [ ] Colores según estado (amarillo/verde/rojo)
- [ ] Botones con transiciones suaves
- [ ] Responsive en mobile/tablet/desktop

---

## ⚡ CONFIGURACIÓN PREVIA (5 min)

```bash
# Terminal 1: Hardhat
npx hardhat node

# Terminal 2: Frontend
cd frontend
npm run dev

# Verificar en navegador
http://localhost:3000
```

---

## 🎬 ESCENARIO DE PRUEBA RECOMENDADO

### Usuario A (Cliente)
1. Conecta wallet
2. Publica 2 trabajos diferentes
3. Ve panel de cliente
4. Ve estadísticas actualizadas

### Usuario B (Freelancer)
1. Cambia cuenta en MetaMask
2. Ve "Trabajos disponibles"
3. Acepta 1 trabajo
4. Ve en "Mis trabajos en progreso"

### Verificación Global
1. Vuelve a usuario A
2. Ve que el trabajo fue "Aceptado"
3. Filtra por "Aceptados"
4. Verifica que muestra 1 trabajo

---

## 🔍 PUNTOS DE VALIDACIÓN

| # | Paso | Esperado | Verificar |
|---|------|----------|-----------|
| 1 | Conectar wallet | Botón verde | ✓ Dirección truncada visible |
| 2 | Publicar | Trabajo en lista | ✓ Estado ⏳ (amarillo) |
| 3 | Panel cliente | Stats correctas | ✓ Total: 1, Pendientes: 1 |
| 4 | Cambiar cuenta | Nueva dirección | ✓ Address diferente en header |
| 5 | Panel freelancer | Trabajo disponible | ✓ Aparece en lista disponible |
| 6 | Aceptar trabajo | Estado cambia | ✓ ✅ (verde) en mis trabajos |
| 7 | Filtrar | Cuenta correcta | ✓ "Aceptados (✅)" = 1 |
| 8 | Validar form | Error messages | ✓ Rojo, claros y útiles |
| 9 | Visual | UI profesional | ✓ Gradientes, sombras, iconos |
| 10 | Desconectar | Botón azul | ✓ Acceso restringido en /client |

---

## 📱 RESPONSIVE CHECK (OPCIONAL)

```
F12 → Device Toolbar (Ctrl+Shift+M)

iPhone 12 (375px):
- [ ] Menu responsivo
- [ ] Cards en 1 columna
- [ ] Botones ampios para tap
- [ ] Texto legible

iPad (768px):
- [ ] Cards en 2 columnas
- [ ] Layout adaptado
- [ ] Todo clickeable

Desktop (1280px):
- [ ] Cards en 3+ columnas
- [ ] Layout completo
- [ ] Espaciado generoso
```

---

## 🐛 SOLUCIÓN RÁPIDA DE PROBLEMAS

```
❌ "No puedo conectar"
→ MetaMask en Localhost 8545, Chain ID: 31337

❌ "Contrato no encontrado"
→ Ejecuta: npx hardhat run scripts/deploy.js --network localhost

❌ "Transacción falla"
→ Verifica: Account tiene fondos en Hardhat

❌ "Datos no actualizan"
→ Recarga: F5 y espera 2-3 segundos

❌ "Error en consola"
→ F12 → Console → Copiar error y reportar
```

---

## 📁 ARCHIVOS DE REFERENCIA

```
CHECKLIST_PRUEBA.txt    ← Más rápido
QUICK_TEST.md           ← Resumen con tabla
PRUEBA_MANUAL.md        ← Más detallado
UI_IMPROVEMENTS.md      ← Detalles de diseño
prueba_visual.sh        ← Script interactivo
```

---

## ✨ CRITERIOS DE ÉXITO

✅ **COMPLETADO**
- Si todos los pasos funcionan
- Si la UI se ve profesional
- Si no hay errores en consola
- Si los datos se actualizan

---

## 🎓 PRÓXIMOS PASOS (después de prueba)

1. **JobDetail.js**: Expandir para ver detalles completos
2. **EscrowActions.js**: Implementar escrow (fund, release, etc)
3. **Dynamic Routes**: Fijar ruta `/job/[id]`
4. **Testing**: Pruebas más complejas con múltiples cuentas
5. **Dark Mode**: Agregar soporte para tema oscuro

---

## 💡 TIPS ÚTILES

- **F5**: Recarga rápida (resetea estado React)
- **F12**: Abre DevTools (Console para errores)
- **Ctrl+Shift+M**: Toggle device toolbar (responsive)
- **MetaMask**: Siempre verifica que estés en Localhost 8585
- **Hardhat**: Los logs muestran transacciones en real-time

---

## 📞 CONTACTO RÁPIDO

Si algo no funciona:
1. Verifica Hardhat está corriendo
2. Verifica Frontend está corriendo
3. Verifica MetaMask está en Localhost 8545
4. Abre DevTools (F12) y checa Console
5. Recarga página (F5)

---

**Tiempo estimado: 25-30 minutos**
**Dificultad: Fácil**
**Requisitos: MetaMask + Hardhat corriendo**

¡Listo para probar! 🚀
