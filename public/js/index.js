import {login, logout} from './authentication';
import {renderMap} from './mapbox';
import {updateUserProfile} from './user';

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
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').value;

    await updateUserProfile({ name, email, photo });
  });
}
/*if (userPasswordForm) {
  userProfileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;

    await updatePassword({ password, newPassword, newPasswordConfirm });
  });
}*/

const mapElement = document.getElementById('map');

if (mapElement) {
  const startLocation = JSON.parse(mapElement.dataset.startLocation);

  renderMap([startLocation]);
}
