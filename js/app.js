import { addAvatar, listAvatars, deleteAvatar, addVariation, listVariations, addScene, listScenes, addCounterRow, listCounterToday, resetCounterToday, exportAll, importAll } from './db.js';

/* Tabs */
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  });
});

/* Avatares */
const formAvatar = document.getElementById('form-avatar');
const listaAvatares = document.getElementById('lista-avatares');

formAvatar.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(formAvatar);
  const data = {
    nombre: fd.get('nombre')?.toString().trim(),
    descripcion: fd.get('descripcion')?.toString().trim(),
    url: fd.get('url')?.toString().trim()
  };
  await addAvatar(data);
  formAvatar.reset();
  await renderAvatares();
  await fillAvataresSelect();
});

async function renderAvatares(){
  const items = await listAvatars();
  listaAvatares.innerHTML = '';
  items.forEach(a=>{
    const card = document.createElement('div');
    card.className = 'card-item';
    const img = document.createElement('img');
    img.src = a.url || 'icons/icon-192.png';
    img.alt = a.nombre;
    const title = document.createElement('h3'); title.textContent = a.nombre;
    const desc = document.createElement('p'); desc.className='muted'; desc.textContent = a.descripcion || '';
    const row = document.createElement('div'); row.className='row';
    const del = document.createElement('button'); del.className='outline danger'; del.textContent='Eliminar';
    del.onclick = async()=>{ await deleteAvatar(a.id); await renderAvatares(); await fillAvataresSelect(); };
    row.appendChild(del);
    card.append(img, title, desc, row);
    listaAvatares.appendChild(card);
  });
}

/* Variaciones */
const formVariacion = document.getElementById('form-variacion');
const selectVariacionAvatar = document.getElementById('variacion-avatar');
const listaVariaciones = document.getElementById('lista-variaciones');

async function fillAvataresSelect(){
  const avs = await listAvatars();
  selectVariacionAvatar.innerHTML = avs.map(a=>`<option value="${a.id}">${a.nombre}</option>`).join('');
}

formVariacion.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(formVariacion);
  const v = {
    avatarId: Number(selectVariacionAvatar.value),
    nombre: fd.get('nombre')?.toString().trim(),
    descripcion: fd.get('descripcion')?.toString().trim(),
    estado: fd.get('estado')?.toString(),
    url: fd.get('url')?.toString().trim()
  };
  await addVariation(v);
  formVariacion.reset();
  await renderVariaciones();
});

async function renderVariaciones(){
  const vs = await listVariations();
  const avs = await listAvatars();
  listaVariaciones.innerHTML='';
  vs.forEach(v=>{
    const avatar = avs.find(a=>a.id===v.avatarId);
    const card = document.createElement('div');
    card.className='card-item';
    const img = document.createElement('img');
    img.src = v.url || 'icons/icon-192.png';
    const title = document.createElement('h3');
    title.textContent = `${avatar?.nombre || 'Sin avatar'} · ${v.nombre}`;
    const state = document.createElement('span');
    const s = v.estado || 'Pendiente';
    state.className = 'badge ' + (s==='Completado'?'ok':(s==='En curso'?'progress':'pending'));
    state.textContent = s;
    const p = document.createElement('p'); p.className='muted'; p.textContent = v.descripcion || '';
    card.append(img, title, state, p);
    listaVariaciones.appendChild(card);
  });
}

/* Escenarios */
const formEscenario = document.getElementById('form-escenario');
const listaEscenarios = document.getElementById('lista-escenarios');

formEscenario.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(formEscenario);
  await addScene({
    nombre: fd.get('nombre')?.toString().trim(),
    direccion: fd.get('direccion')?.toString().trim(),
    estado: fd.get('estado')?.toString(),
    url: fd.get('url')?.toString().trim()
  });
  formEscenario.reset();
  await renderEscenarios();
});

async function renderEscenarios(){
  const sc = await listScenes();
  listaEscenarios.innerHTML='';
  sc.forEach(s=>{
    const card = document.createElement('div'); card.className='card-item';
    const img = document.createElement('img'); img.src = s.url || 'icons/icon-192.png';
    const title = document.createElement('h3'); title.textContent = s.nombre;
    const state = document.createElement('span');
    const st = s.estado || 'Pendiente';
    state.className = 'badge ' + (st==='Completado'?'ok':(st==='En curso'?'progress':'pending'));
    state.textContent = st;
    const p = document.createElement('p'); p.className='muted'; p.textContent = s.direccion || '';
    card.append(img, title, state, p);
    listaEscenarios.appendChild(card);
  });
}

/* Contador */
const formContador = document.getElementById('form-contador');
const tablaContador = document.getElementById('tabla-contador');
const btnResetDia = document.getElementById('btn-reset-dia');

formContador.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(formContador);
  const fecha = fd.get('fecha') || new Date().toISOString().slice(0,10);
  const hora = fd.get('hora') || new Date().toTimeString().slice(0,5);
  await addCounterRow({ fecha, hora, descripcion: fd.get('descripcion')?.toString().trim() });
  formContador.reset();
  await renderContador();
});

btnResetDia.addEventListener('click', async ()=>{
  if(confirm('¿Resetear el contador de HOY?')){
    await resetCounterToday();
    await renderContador();
  }
});

async function renderContador(){
  const rows = await listCounterToday();
  let html = '<tr><th>#</th><th>Fecha</th><th>Hora</th><th>Descripción</th></tr>';
  rows.forEach((r,i)=> html += `<tr><td>${i+1}</td><td>${r.fecha}</td><td>${r.hora}</td><td>${r.descripcion}</td></tr>`);
  tablaContador.innerHTML = html;
}

/* Export / Import */
document.getElementById('exportar').addEventListener('click', exportAll);
document.getElementById('backup-export').addEventListener('click', exportAll);
document.getElementById('importar').addEventListener('change', async (e)=>{
  if(e.target.files?.length) await importAll(e.target.files[0]); 
  await renderAll();
});
document.getElementById('backup-import').addEventListener('change', async (e)=>{
  if(e.target.files?.length) await importAll(e.target.files[0]);
  await renderAll();
});

async function renderAll(){
  await renderAvatares();
  await renderVariaciones();
  await renderEscenarios();
  await renderContador();
  await fillAvataresSelect();
}
renderAll();
