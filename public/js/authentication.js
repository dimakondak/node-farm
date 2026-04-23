import axios from 'axios';
import {showAlert} from './showAlert';

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      'http://localhost:3001/api/v1/users/login',
      {
        email: email,
        password: password,
      }
    );
    const token = response.data.token;
    if (!token) {
      throw new Error('Token not found');
    }
    location.assign('/');
  } catch (error) {
    console.error(error);
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    await axios.post('http://localhost:3001/api/v1/users/logout');

    location.reload();
  } catch (error) {
    console.error(error);
    showAlert('error', error.response.data.message);
  }
};
