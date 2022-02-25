// Axios
import { clearAxiosInstance } from '../../axios_config/axios-config';

// Mongo
import { removeUserFromRoom } from '../mongo/room';

export async function handleUserLeave(socketInstance, roomId) {
  try {
    await removeUserFromRoom();
    socketInstance.emit('left-chat', { roomId });
    socketInstance.disconnect();
    clearAxiosInstance();
    localStorage.clear();
    window.location.href = '/';
  } catch (err) {
    console.log(err);
  }
}
