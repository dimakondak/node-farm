import { login, logout } from './authentication';
import { renderMap } from './mapbox';

const loginForm = document.querySelector('.form');
const logoutButton = document.querySelector('.nav__el--logout');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await login(email, password);
  });
}
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

const mapElement = document.getElementById('map');

if (mapElement) {
  const startLocation = JSON.parse(mapElement.dataset.startLocation);

  renderMap([startLocation]);
}
