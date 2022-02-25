// Axios
import { clearAxiosInstance } from '../../axios_config/axios-config';

// Mongo
import { removeUserFromRoom } from '../mongo/room';

export async function handleUserLeave() {
  try {
    await removeUserFromRoom();
    clearAxiosInstance();
    localStorage.clear();
    window.location.href = '/';
  } catch (err) {
    console.log(err);
  }
}
