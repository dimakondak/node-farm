export const showAlert = (type, message, hideAfterDelay = true) => {
  const markup = `<div class="alert alert-${type}">${message}</div>`;

  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  if (hideAfterDelay) {
    setTimeout(hideAlert, 4000);
  }
};

const hideAlert = () => {
  const alert = document.querySelector('.alert');

  if (alert) {
    alert.parentElement.removeChild(alert);
  }
};
