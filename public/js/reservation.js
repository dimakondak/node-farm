import axios from 'axios';

export const reserveTour = async (tourId) => {
  const response = await axios(
    `http://localhost:3001/api/v1/reservations/checkout-session/${tourId}`
  );
  const { url } = response.data.session;

  window.location.href = url;
};
