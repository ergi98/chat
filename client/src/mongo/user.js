import { AxiosInstance, setTokenInterceptor } from '../../axios_config/axios-config';

// export async function create(roomId) {
//   try {
//     let result = await AxiosInstance.post('/create-user', { roomId });
//     localStorage.setItem('jwt', JSON.stringify(result.data.token));
//     setTokenInterceptor(result.data.token, result.data.refreshToken);
//     return {
//       user: result.data.user
//     };
//   } catch (err) {
//     console.log(err);
//     throw new Error(
//       err.response?.data?.message ?? 'A problem occurred while creating your room. Please refresh.'
//     );
//   }
// }

export async function getUser() {
  try {
    let result = await AxiosInstance.get('/get-user');
    return {
      user: result.data.user
    };
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ?? 'A problem occurred while getting your user. Please refresh.'
    );
  }
}

export async function checkIfUserBelongsToRoom() {
  try {
    let result = await AxiosInstance.post('/check-if-belongs-to-room');
    return {
      belongs: result.data.belongs
    };
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        'A problem occurred while validating your user. Please refresh.'
    );
  }
}

export async function createUserAndAssignToRoom(roomId) {
  try {
    let result = await AxiosInstance.post('/create-user-and-assign', { roomId });

    localStorage.setItem('jwt', JSON.stringify(result.data.token));
    localStorage.setItem('refresh', JSON.stringify(result.data.refreshToken));

    setTokenInterceptor(result.data.token, result.data.refreshToken);

    return result.data;
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        'A problem occurred while connecting you to this room. Please refresh.'
    );
  }
}

export async function createUserAndRoom() {
  try {
    let result = await AxiosInstance.post('/create-user-and-room');

    localStorage.setItem('jwt', JSON.stringify(result.data.token));
    localStorage.setItem('refresh', JSON.stringify(result.data.refreshToken));

    setTokenInterceptor(result.data.token, result.data.refreshToken);
    
    return result.data;
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        'A problem occurred while we were setting things up. Please refresh.'
    );
  }
}
