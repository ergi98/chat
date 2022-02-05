export function getDeviceTheme() {
  let prefersDarkMode = window.matchMedia('(prefers-color-scheme:dark)');
  return prefersDarkMode.matches ? 'dark' : 'light';
}

export function getSelectedTheme() {
  return JSON.parse(localStorage.getItem('theme'));
}

export function setAppTheme(theme) {
  if (!['dark', 'light', 'device'].includes(theme)) return;
  localStorage.setItem('theme', JSON.stringify(theme));
  let dataTheme = theme === 'device' ? getDeviceTheme() : theme;
  document.documentElement.setAttribute('data-theme', dataTheme);
}
