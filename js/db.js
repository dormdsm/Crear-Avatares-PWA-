const db = new Dexie('crear_avatares_db');
db.version(1).stores({
  avatars: '++id, nombre, createdAt',
  variations: '++id, avatarId, nombre, estado, createdAt',
  scenes: '++id, nombre, estado, createdAt',
  counter: '++id, fecha, hora, descripcion'
});
export async function addAvatar(d){ d.createdAt=new Date().toISOString(); return db.avatars.add(d); }
export async function listAvatars(){ return db.avatars.toArray(); }
export async function deleteAvatar(id){ await db.variations.where('avatarId').equals(id).delete(); return db.avatars.delete(id); }
export async function addVariation(v){ v.createdAt=new Date().toISOString(); return db.variations.add(v); }
export async function listVariations(){ return db.variations.toArray(); }
export async function addScene(s){ s.createdAt=new Date().toISOString(); return db.scenes.add(s); }
export async function listScenes(){ return db.scenes.toArray(); }
export async function addCounterRow(r){ return db.counter.add(r); }
export async function listCounterToday(){
  const today = new Date().toISOString().slice(0,10);
  const all = await db.counter.toArray();
  return all.filter(x => (x.fecha || '').startsWith(today));
}
export async function resetCounterToday(){
  const today = new Date().toISOString().slice(0,10);
  const rows = await db.counter.toArray();
  const ids = rows.filter(x => (x.fecha || '').startsWith(today)).map(x=>x.id);
  return db.counter.bulkDelete(ids);
}
export async function exportAll(){
  const data = {
    avatars: await db.avatars.toArray(),
    variations: await db.variations.toArray(),
    scenes: await db.scenes.toArray(),
    counter: await db.counter.toArray()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'crear_avatares_backup.json'; a.click();
  URL.revokeObjectURL(url);
}
export async function importAll(file){
  const txt = await file.text();
  const data = JSON.parse(txt);
  await db.transaction('rw', db.avatars, db.variations, db.scenes, db.counter, async()=>{
    await db.avatars.clear(); await db.variations.clear();
    await db.scenes.clear(); await db.counter.clear();
    if(data.avatars) await db.avatars.bulkAdd(data.avatars);
    if(data.variations) await db.variations.bulkAdd(data.variations);
    if(data.scenes) await db.scenes.bulkAdd(data.scenes);
    if(data.counter) await db.counter.bulkAdd(data.counter);
  });
}
