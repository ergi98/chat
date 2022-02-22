import { AxiosInstance } from '../../axios_config/axios-config';

export async function create() {
  try {
    let result = await AxiosInstance.post('/create-room');
    return {
      room: result.data.room
    };
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ?? 'A problem occurred while creating your room. Please refresh'
    );
  }
}

export async function getRoom() {
  try {
    let result = await AxiosInstance.get('/get-room');
    console.log(result);
    return {
      room: result.data.roomData
    };
  } catch (err) {
    console.log(err);
    throw new Error(err.response?.data?.message ?? 'A problem occurred while getting your room!');
  }
}

export async function assignUserToRoom() {
  try {
    let result = await AxiosInstance.post('/assign-to-room');
    return {
      room: result.data.room
    };
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        'A problem occurred while assigning you to the room. Please refresh'
    );
  }
}

export async function removeUserFromRoom() {
  try {
    let result = await AxiosInstance.post('/remove-from-room');
    return result.data;
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        'A problem occurred while removing you from the room. Please refresh'
    );
  }
}
