import axios from 'axios';
import {showAlert} from './showAlert';

export const updateUserProfile = async (payload) => {
  try {
    const response = await axios.patch(
      'http://localhost:3001/api/v1/users/updateCurrentUser',
      payload
    );
    const updatedUser = response.data.user;

    console.log(updatedUser);
  } catch (error) {
    console.error(error);
    showAlert('error', error.response.data.message);
  }
};
