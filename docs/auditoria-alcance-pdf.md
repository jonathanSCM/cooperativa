# Auditoría del alcance del PDF contra la demo

Generada automáticamente con `tests/auditoria-alcance.js` (Playwright) sobre la app funcionando. Cada fila es una comprobación real, incluidos los flujos A–D con cifras antes/después.

**Resultado: 115 de 115 comprobaciones aprobadas.**


### §2 Pantallas

- ✅ Existe «Tablero general»
- ✅ Existe «Caja y movimientos»
- ✅ Existe «Ventas de mineral»
- ✅ Existe «Compras y gastos»
- ✅ Existe «Cuotas de accionistas»
- ✅ Existe «Accionistas y terceros»
- ✅ Existe «Reportes y resúmenes»

### §2 Tablero

- ✅ Ingresos
- ✅ Egresos
- ✅ Saldo por caja
- ✅ Comparación Cortada vs Nivel 0
- ✅ Filtro por periodo (fecha)
- ✅ Filtro por unidad
- ✅ Filtro por moneda

### §5 Regla

- ✅ Tablero diferencia ventas, cobros y saldo de caja
- ✅ Resultado de caja (no «utilidad»)
- ✅ Soles y dólares separados (bloques distintos)
- ✅ Consolidar requiere tipo de cambio (aviso visible)

### §2 Caja

- ✅ Columna/dato «Fecha»
- ✅ Columna/dato «Unidad»
- ✅ Columna/dato «Concepto»
- ✅ Columna/dato «Tercero»
- ✅ Columna/dato «Documento»
- ✅ Columna/dato «Monto»
- ✅ Categoría visible

### §3 Campos (mov)

- ✅ Fecha
- ✅ Tipo de operación
- ✅ Unidad operativa
- ✅ Categoría
- ✅ Moneda
- ✅ Caja
- ✅ Monto
- ✅ Tipo de documento
- ✅ Número de documento
- ✅ Observaciones
- ✅ Concepto (distinto de categoría)
- ✅ Tercero (accionista, proveedor o comprador)
- ✅ Razón social
- ✅ Acceso a documento de ejemplo
- ✅ Moneda soles o dólares

### §2/§3 Ventas

- ✅ Fecha
- ✅ Unidad operativa
- ✅ Accionista
- ✅ Razón social
- ✅ Planta compradora
- ✅ Documento base
- ✅ liquidación
- ✅ carga
- ✅ Moneda
- ✅ Monto
- ✅ Observaciones

### §2 Ventas

- ✅ Liquidación o propuesta de compra

### §3 Campos (venta)

- ✅ Tipo de operación visible
- ✅ Acceso a documento de ejemplo

### §4B Flujo

- ✅ Cobro inmediato desde el mismo formulario

### §2 Compras

- ✅ Categoría de ejemplo «Contratistas»
- ✅ Categoría de ejemplo «Ferretería»
- ✅ Categoría de ejemplo «Alimentación»
- ✅ Categoría de ejemplo «Combustible»
- ✅ Categoría de ejemplo «Madera»
- ✅ Categoría de ejemplo «Explosivos»
- ✅ Categoría de ejemplo «Planillas»

### §2 Compras (form)

- ✅ Proveedor
- ✅ Concepto (
- ✅ Categoría
- ✅ Unidad operativa
- ✅ Monto
- ✅ Tipo de documento

### §2 Cuotas

- ✅ Cuota asignada
- ✅ Abonos recibidos
- ✅ Saldo pendiente
- ✅ Registrar un abono

### §2 Terceros

- ✅ Accionistas con iniciales/alias
- ✅ Razones sociales vinculadas
- ✅ Terceros diferenciados: Proveedores
- ✅ Terceros diferenciados: Plantas compradoras

### §2 Reportes

- ✅ Ingresos y egresos por unidad
- ✅ Ventas por accionista
- ✅ Gastos por categoría
- ✅ Movimientos de caja
- ✅ Cuotas pendientes

### §7 Datos de ejemplo

- ✅ Movimientos de cortada en PEN — 13 filas
- ✅ Movimientos de nivel0 en PEN — 12 filas
- ✅ Movimientos de cortada en USD — 3 filas
- ✅ Movimientos de nivel0 en USD — 4 filas
- ✅ Ventas de Cortada en Soles — 1 filas
- ✅ Ventas de Cortada en Dólares — 2 filas
- ✅ Ventas de Nivel 0 en Soles — 1 filas
- ✅ Ventas de Nivel 0 en Dólares — 2 filas
- ✅ Cuotas de Cortada en Soles — 2 filas
- ✅ Cuotas de Cortada en Dólares — 1 filas
- ✅ Cuotas de Nivel 0 en Soles — 2 filas
- ✅ Cuotas de Nivel 0 en Dólares — 1 filas

### §7 Totales con detalle

- ✅ KPIs clicables en vm_tablero — 14/14 KPIs, 54 importes subrayados
- ✅ KPIs clicables en vm_caja — 4/4 KPIs, 0 importes subrayados
- ✅ KPIs clicables en vm_ventas — 6/6 KPIs, 7 importes subrayados
- ✅ KPIs clicables en vm_compras — 2/2 KPIs, 0 importes subrayados
- ✅ KPIs clicables en vm_cuotas — 6/6 KPIs, 0 importes subrayados
- ✅ KPIs clicables en vm_reportes — 0/0 KPIs, 86 importes subrayados

### §4A Flujo

- ✅ Disminuye el saldo de caja — Saldo por cajaCajas compartidasCaja efectivo S/S/ 21,479.50Banco solesS/ 236,200
- ✅ Aumenta el gasto de la unidad y categoría — 3950 → 4950

### §4B Flujo

- ✅ La venta NO aumenta la caja
- ✅ La venta aparece en el resumen de ventas — 168000 → 178000
- ✅ Aparece en Reportes → ventas por accionista (R.P.V.)
- ✅ El cobro sí aumenta la caja — Saldo por cajaCajas compartidasCaja efectivo S/S/ 21,479.50B → Saldo por cajaCajas compartidasCaja efectivo S/S/ 31,479.50B

### §4C Flujo

- ✅ Abrir un accionista con saldo → registrar abono (desde su ficha) — Cuota de aporte del trimestre · vence 30 nov 2026 Cuota asignadaS/ 8,000.00 Abonos recibid → Cuota de aporte del trimestre · vence 30 nov 2026 Cuota asignadaS/ 8,000.00 Abonos recibid

### §4D Flujo

- ✅ Filtrar un mes
- ✅ Comparar Cortada y Nivel 0
- ✅ Abrir un total y ver los movimientos que lo componen

### §6 Alcance

- ✅ Los cambios se guardan durante la demo (localStorage)
- ✅ Persisten tras recargar
- ✅ Restablecer datos iniciales
- ✅ Datos ficticios identificados

### Encabezado

- ✅ Cliente, RUC y responsable de la propuesta (ProShop)

### Consola

- ✅ Sin errores de JavaScript

## Fuera de lo que mide el script (revisión manual)

- El PDF indica que acreedores, intereses y cotización del oro **no se incorporan** sin validar. Siguen en el menú, plegados bajo «Sistema anterior · fuera del alcance». Se pueden ocultar por completo para la presentación.
- Se agregó, más allá del PDF y por pedido de las notas de la reunión: Documentos (fotos/PDF), buscador, recorrido guiado, inteligencia comercial y punto de partida de tesorería.
