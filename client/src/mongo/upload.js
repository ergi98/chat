import { AxiosInstance } from '../../axios_config/axios-config';

export async function uploadImage(image) {
  try {
    let formDate = new FormData();
    formDate.append('image', image);
    let result = await AxiosInstance.post('/upload-image', formDate);
    return result;
  } catch (err) {
    throw new Error(err);
  }
}
