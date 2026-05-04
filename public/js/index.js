import { login, logout } from './authentication';
import { renderMap } from './mapbox';
import { updatePassword, updateUserProfile } from './user';
import { reserveTour } from './reservation';

const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const userProfileForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

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

if (userProfileForm) {
  userProfileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);

    await updateUserProfile(form);
  });
}
if (userPasswordForm) {
  userProfileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);

    await updatePassword(form);
  });
}

const mapElement = document.getElementById('map');

if (mapElement) {
  const startLocation = JSON.parse(mapElement.dataset.startLocation);

  renderMap([startLocation]);
}

const reserveButton = document.getElementById('book-tour');

if (reserveButton) {
  reserveButton.addEventListener('click', async () => {
    const tourId = reserveButton.dataset.tourId;
    await reserveTour(tourId);
  });
}
