// Auditoría automática del alcance del PDF (Playwright). Uso: DEMO_URL=https://tu-dominio/ NODE_PATH=$(npm root -g) node tests/auditoria-alcance.js
const { chromium } = require('playwright');
const R=[]; const ok=(sec,req,c,extra)=>{R.push([c?'OK ':'FALLA',sec,req,extra||'']);};
(async()=>{
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1440,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto((process.env.DEMO_URL||'http://localhost:8099/index.html')); await p.waitForTimeout(700);
  const T=async s=>((await p.textContent(s))||'').replace(/\s+/g,' ').trim();
  const num=s=>parseFloat(String(s).replace(/[^0-9.\-−]/g,'').replace('−','-'));
  const go=async v=>{await p.click(`[data-view=${v}]`); await p.waitForTimeout(250);};
  const txt=async sel=>(await p.$$eval(sel,e=>e.map(x=>x.textContent.replace(/\s+/g,' ').trim()))).join(' | ');
  // ---- §2 pantallas
  const nav=await p.$$eval('.side-item[data-view^=vm_]',e=>e.map(x=>x.textContent.trim()));
  for(const n of ['Tablero general','Caja y movimientos','Ventas de mineral','Compras y gastos','Cuotas de accionistas','Accionistas y terceros','Reportes y resúmenes']) ok('§2 Pantallas','Existe «'+n+'»',nav.includes(n));
  // Tablero
  await go('vm_tablero'); await p.click('#vmGlobalFilters >> text=Ambas'); await p.waitForTimeout(250);
  const tb=await txt('#view-vm_tablero');
  ok('§2 Tablero','Ingresos',/Ingresos/.test(tb)); ok('§2 Tablero','Egresos',/Egresos/.test(tb)); ok('§2 Tablero','Saldo por caja',/Saldo por caja/.test(tb));
  ok('§2 Tablero','Comparación Cortada vs Nivel 0',/Cortada vs\. Nivel 0/.test(tb)&&/Cortada/.test(tb)&&/Nivel 0/.test(tb));
  const fb=await T('#vmGlobalFilters');
  ok('§2 Tablero','Filtro por periodo (fecha)',/Fecha/.test(fb)&&await p.$$eval('#vmGlobalFilters input[type=date]',e=>e.length)===2);
  ok('§2 Tablero','Filtro por unidad',/Unidad operativa/.test(fb)&&/Cortada/.test(fb)&&/Nivel 0/.test(fb)); ok('§2 Tablero','Filtro por moneda',/Moneda/.test(fb)&&/Soles/.test(fb)&&/Dólares/.test(fb));
  ok('§5 Regla','Tablero diferencia ventas, cobros y saldo de caja',/Ventas registradas/.test(tb)&&/Cobros recibidos/.test(tb)&&/Saldo de caja/.test(tb));
  ok('§5 Regla','Resultado de caja (no «utilidad»)',/Resultado de caja/.test(tb)&&!/utilidad(?! contable)/i.test(tb.replace(/no es utilidad contable/g,'')));
  ok('§5 Regla','Soles y dólares separados (bloques distintos)',(await p.$$eval('#view-vm_tablero .cur-tag',e=>e.length))===2);
  ok('§5 Regla','Consolidar requiere tipo de cambio (aviso visible)',/tipo de cambio/i.test(await T('#vmGlobalFilters')+tb));
  // Caja
  await go('vm_caja'); const cj=await txt('#view-vm_caja thead');
  for(const c of ['Fecha','Unidad','Concepto','Tercero','Documento','Monto']) ok('§2 Caja','Columna/dato «'+c+'»',cj.includes(c));
  ok('§2 Caja','Categoría visible',/Categoría/.test(cj+await txt('#view-vm_caja .tour-main .who-name'))||(await p.$$eval('#view-vm_caja tbody .who-name',e=>e.length))>0);
  await p.click('#view-vm_caja >> text=Registrar egreso'); const f1=await txt('#vmFormBody label');
  for(const c of ['Fecha','Tipo de operación','Unidad operativa','Categoría','Moneda','Caja','Monto','Tipo de documento','Número de documento','Observaciones']) ok('§3 Campos (mov)',c,f1.includes(c));
  ok('§3 Campos (mov)','Concepto (distinto de categoría)',/Concepto \(/.test(f1)); ok('§3 Campos (mov)','Tercero (accionista, proveedor o comprador)',/Accionista, proveedor o comprador/.test(f1)); ok('§3 Campos (mov)','Razón social',/Razón social/.test(f1));
  ok('§3 Campos (mov)','Acceso a documento de ejemplo',await p.$('#vmFormBody >> text=Ver documento de ejemplo')!==null);
  ok('§3 Campos (mov)','Moneda soles o dólares',(await p.$$eval('#vmf-mon option',e=>e.map(x=>x.value))).join()==='PEN,USD');
  await p.click('#vm-form >> text=Cancelar');
  // Ventas
  await go('vm_ventas'); await p.click('#view-vm_ventas >> text=Registrar venta >> nth=-1'); const f2=await txt('#vmFormBody label');
  for(const c of ['Fecha','Unidad operativa','Accionista','Razón social','Planta compradora','Documento base','liquidación','carga','Moneda','Monto','Observaciones']) ok('§2/§3 Ventas',c,f2.toLowerCase().includes(c.toLowerCase()));
  ok('§2 Ventas','Liquidación o propuesta de compra',(await p.$$eval('#vmf-doct option',e=>e.map(x=>x.textContent))).join('|')==='Liquidación|Propuesta de compra');
  ok('§3 Campos (venta)','Tipo de operación visible',/Tipo de operación/.test(f2)); ok('§3 Campos (venta)','Acceso a documento de ejemplo',await p.$('#vmFormBody >> text=Ver documento de ejemplo')!==null);
  ok('§4B Flujo','Cobro inmediato desde el mismo formulario',await p.$('#vmf-inm')!==null); await p.click('#vm-form >> text=Cancelar');
  // Compras
  await go('vm_compras'); const cp=await txt('#view-vm_compras'); for(const c of ['Contratistas','Ferretería','Alimentación','Combustible','Madera','Explosivos','Planillas']) ok('§2 Compras','Categoría de ejemplo «'+c+'»',cp.includes(c));
  await p.click('#view-vm_compras >> text=Registrar compra o gasto >> nth=-1'); const f3=await txt('#vmFormBody label');
  for(const c of ['Proveedor','Concepto (','Categoría','Unidad operativa','Monto','Tipo de documento']) ok('§2 Compras (form)',c,f3.includes(c)); await p.click('#vm-form >> text=Cancelar');
  // Cuotas
  await go('vm_cuotas'); const cu=await txt('#view-vm_cuotas');
  for(const c of ['Cuota asignada','Abonos recibidos','Saldo pendiente']) ok('§2 Cuotas',c,cu.includes(c)); ok('§2 Cuotas','Registrar un abono',await p.$('#view-vm_cuotas >> text=Registrar abono')!==null);
  // Terceros
  await go('vm_terceros'); const te=await txt('#view-vm_terceros');
  ok('§2 Terceros','Accionistas con iniciales/alias',/J\.M\.R\./.test(te)); ok('§2 Terceros','Razones sociales vinculadas',/S\.A\.C\.|S\.R\.L\./.test(te));
  for(const t of ['Proveedores','Plantas compradoras']){ await p.click(`#view-vm_terceros .subtoggle >> text=${t}`); ok('§2 Terceros','Terceros diferenciados: '+t,(await p.$$eval('#view-vm_terceros tbody tr',e=>e.length))>=2); }
  // Reportes
  await go('vm_reportes'); const rp=await txt('#view-vm_reportes h2');
  for(const c of ['Ingresos y egresos por unidad','Ventas por accionista','Gastos por categoría','Movimientos de caja','Cuotas pendientes']) ok('§2 Reportes',c,rp.includes(c));
  // ---- §7 datos de ejemplo ambas unidades y monedas
  const st=await p.evaluate(()=>{const k='virgen-copacabana-demo-v3'; return JSON.parse(localStorage.getItem(k)||'null');});
  // el estado se guarda solo tras operar; leer desde la UI en su lugar
  for(const m of ['PEN','USD']) for(const u of ['cortada','nivel0']){ await go('vm_caja'); await p.click(`#vmGlobalFilters >> text=${u==='cortada'?'Cortada':'Nivel 0'}`); await p.click(`#vmGlobalFilters .vf-g:nth-child(3) >> text=${m==='PEN'?'Soles':'Dólares'}`); await p.waitForTimeout(200);
    const n=await p.$$eval('#view-vm_caja tbody tr',e=>e.filter(x=>x.querySelector('.utag')).length); ok('§7 Datos de ejemplo','Movimientos de '+u+' en '+m,n>0,n+' filas'); }
  for(const u of ['Cortada','Nivel 0']) for(const m of ['Soles','Dólares']){ await go('vm_ventas'); await p.click(`#vmGlobalFilters >> text=${u}`); await p.click(`#vmGlobalFilters .vf-g:nth-child(3) >> text=${m}`); await p.waitForTimeout(200); const n=await p.$$eval('#view-vm_ventas .tour-main tbody tr',e=>e.filter(x=>x.querySelector('.utag')).length); ok('§7 Datos de ejemplo','Ventas de '+u+' en '+m,n>0,n+' filas'); }
  for(const u of ['Cortada','Nivel 0']) for(const m of ['Soles','Dólares']){ await go('vm_cuotas'); await p.click(`#vmGlobalFilters >> text=${u}`); await p.click(`#vmGlobalFilters .vf-g:nth-child(3) >> text=${m}`); await p.waitForTimeout(200); const n=await p.$$eval('#view-vm_cuotas .tour-main tbody tr',e=>e.filter(x=>x.querySelector('.utag')).length); ok('§7 Datos de ejemplo','Cuotas de '+u+' en '+m,n>0,n+' filas'); }
  await p.click('#vmGlobalFilters >> text=Limpiar filtros');
  // ---- §7 cada total se abre
  const sinDetalle=[];
  for(const v of ['vm_tablero','vm_caja','vm_ventas','vm_compras','vm_cuotas','vm_reportes']){ await go(v); await p.click('#vmGlobalFilters >> text=Ambas');
    const n=await p.evaluate(()=>{const root=document.querySelector('.view.active'); return {kpis:[...root.querySelectorAll('.kpi-row .kpi')].length, kpiClick:[...root.querySelectorAll('.kpi-row .kpi.click')].length, lnk:root.querySelectorAll('.lnk').length};});
    ok('§7 Totales con detalle','KPIs clicables en '+v,n.kpis===n.kpiClick,n.kpiClick+'/'+n.kpis+' KPIs, '+n.lnk+' importes subrayados'); }
  // ---- flujos A-D con verificación numérica
  await go('vm_tablero'); await p.click('#vmGlobalFilters >> text=Limpiar filtros'); await p.click('#vmGlobalFilters >> text=Cortada'); await p.waitForTimeout(250);
  const saldoAntes=num(await T('#view-vm_tablero .tour-saldos .cat-item >> nth=0 >> .amount')), gastoComb0=num(await T('#view-vm_tablero .bar-row:has-text("Combustible") .amount'));
  await p.click('#view-vm_tablero .qa >> nth=0'); await p.selectOption('#vmf-unidad','cortada'); await p.selectOption('#vmf-cat','Combustible'); await p.selectOption('#vmf-ter','p2'); await p.fill('#vmf-concepto','Diésel auditoría').catch(()=>{}); await p.selectOption('#vmf-caja','c1'); await p.fill('#vmf-monto','1000'); await p.click('#vm-form .btn-primary'); await p.waitForTimeout(400);
  const saldoDesp=num(await T('#view-vm_tablero .tour-saldos .cat-item >> nth=0 >> .amount')); const g1=num(await T('#view-vm_tablero .bar-row:has-text("Combustible") .amount'));
  const cajaTxt=await T('#view-vm_tablero .tour-saldos'); 
  ok('§4A Flujo','Disminuye el saldo de caja',/22,479\.50/.test(cajaTxt)===false&&/21,479\.50/.test(cajaTxt),cajaTxt.slice(0,80)); ok('§4A Flujo','Aumenta el gasto de la unidad y categoría',g1===gastoComb0+1000,gastoComb0+' → '+g1);
  // B
  await p.click('#vmGlobalFilters >> text=Nivel 0'); const cajaB0=await T('#view-vm_tablero .tour-saldos'); const ventasB0=num(await T('#view-vm_tablero .tour-kpi .kpi:nth-child(1) .kpi-num'));
  await p.click('#view-vm_tablero .qa >> nth=1'); await p.selectOption('#vmf-unidad','nivel0'); await p.selectOption('#vmf-acc','a4'); await p.selectOption('#vmf-rs','r6').catch(()=>{}); await p.selectOption('#vmf-mon','PEN'); await p.fill('#vmf-monto','10000'); await p.fill('#vmf-docn','LIQ-AUD'); await p.fill('#vmf-carga','CG-AUD'); await p.click('#vm-form .btn-primary'); await p.waitForTimeout(400);
  const cajaB1=await T('#view-vm_tablero .tour-saldos'); const ventasB1=num(await T('#view-vm_tablero .tour-kpi .kpi:nth-child(1) .kpi-num'));
  ok('§4B Flujo','La venta NO aumenta la caja',cajaB0===cajaB1); ok('§4B Flujo','La venta aparece en el resumen de ventas',ventasB1===ventasB0+10000,ventasB0+' → '+ventasB1);
  await go('vm_reportes'); ok('§4B Flujo','Aparece en Reportes → ventas por accionista (R.P.V.)',/R\.P\.V\./.test(await txt('#view-vm_reportes .tour-main')));
  await go('vm_tablero'); await p.click('#view-vm_tablero .qa >> nth=2'); const ov=await p.$$eval('#vmf-ref option',e=>e.find(x=>x.textContent.includes('LIQ-AUD')).value); await p.selectOption('#vmf-ref',ov); await p.click('#vm-form .btn-primary'); await p.waitForTimeout(400);
  const cajaB2=await T('#view-vm_tablero .tour-saldos'); ok('§4B Flujo','El cobro sí aumenta la caja',cajaB2!==cajaB1,cajaB1.slice(0,60)+' → '+cajaB2.slice(0,60));
  // C
  await go('vm_cuotas'); await p.click('#view-vm_cuotas tbody tr:has-text("R.P.V.")'); await p.waitForTimeout(300); const antes=await T('#drawer .loan-card'); await p.click('#drawer >> text=Registrar abono'); await p.fill('#vmf-monto','1000'); await p.click('#vm-form .btn-primary'); await p.waitForTimeout(400); const desp=await T('#drawer .loan-card');
  ok('§4C Flujo','Abrir un accionista con saldo → registrar abono (desde su ficha)',antes!==desp,antes.slice(0,90)+' → '+desp.slice(0,90)); await p.click('#drawer .drawer-close');
  // D
  await go('vm_tablero'); await p.click('#vmGlobalFilters >> text=Limpiar filtros'); const mes=await p.$$eval('#vmGlobalFilters select option',e=>e.map(x=>x.value).filter(v=>/^\d{4}-\d{2}$/.test(v))); await p.selectOption('#vmGlobalFilters select',mes[mes.length-1]||mes[0]); await p.waitForTimeout(250);
  ok('§4D Flujo','Filtrar un mes',/ – /.test(await T('.vf-sum'))); ok('§4D Flujo','Comparar Cortada y Nivel 0',await p.$$eval('#view-vm_tablero .unit-card',e=>e.length)>=2);
  await p.click('#view-vm_tablero .tour-kpi .kpi.click >> nth=0'); await p.waitForTimeout(300); ok('§4D Flujo','Abrir un total y ver los movimientos que lo componen',/registros? componen este total/.test(await T('#vmDetBody .det-total'))); await p.keyboard.press('Escape');
  // §6
  const before=await p.evaluate(()=>localStorage.getItem('virgen-copacabana-demo-v3')?1:0); ok('§6 Alcance','Los cambios se guardan durante la demo (localStorage)',before===1);
  await p.reload(); await p.waitForTimeout(600); await go('vm_ventas'); ok('§6 Alcance','Persisten tras recargar',/LIQ-AUD/.test(await txt('#view-vm_ventas')));
  p.once('dialog',d=>d.accept()); await p.click('#view-vm_ventas .tour-reset'); await p.waitForTimeout(400); ok('§6 Alcance','Restablecer datos iniciales',!/LIQ-AUD/.test(await txt('#view-vm_ventas')));
  ok('§6 Alcance','Datos ficticios identificados',/ficticios/.test(await T('#demoBanner')));
  ok('Encabezado','Cliente, RUC y responsable de la propuesta (ProShop)',/Virgen de Copacabana S\.A\./.test(await T('#demoBanner'))&&/20455717427/.test(await T('#demoBanner'))&&/ProShop/.test(await T('#demoBanner')));
  ok('Consola','Sin errores de JavaScript',errs.length===0,errs.join(';'));
  for(const r of R) console.log(r.join(' | '));
  console.log('\nTOTAL',R.length,'| OK',R.filter(r=>r[0]==='OK ').length,'| FALLAN',R.filter(r=>r[0]==='FALLA').length);
  await b.close();
})();
