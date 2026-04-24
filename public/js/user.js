import axios from 'axios';
import {showAlert} from './showAlert';

export const updateUserProfile = async (payload) => {
  try {
    await axios.patch(
      'http://localhost:3001/api/v1/users/updateCurrentUser',
      payload
    );
  } catch (error) {
    console.error(error);
    showAlert('error', error.response.data.message);
  }
};

export const updatePassword = async (payload) => {
  try {
    await axios.patch(
      'http://localhost:3001/api/v1/users/updatePassword',
      payload
    );
  } catch (error) {
    console.error(error);
    showAlert('error', error.response.data.message);
  }
};
