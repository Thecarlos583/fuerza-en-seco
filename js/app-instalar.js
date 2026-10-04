// Botón "Instalar app" (Chrome en Android): guarda el evento y lo lanza al tocar el botón.
let evento = null;

const yaInstalada = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

export const instalable = () => !!evento && !yaInstalada();

export async function instalar() {
  if (!evento) return;
  evento.prompt();
  try { await evento.userChoice; } catch { }
  evento = null;
  dispatchEvent(new Event('fs:refrescar'));
}

addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  evento = e;
  dispatchEvent(new Event('fs:refrescar'));
});
addEventListener('appinstalled', () => {
  evento = null;
  dispatchEvent(new Event('fs:refrescar'));
});
