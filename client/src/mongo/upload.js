import { AxiosInstance } from '../../axios_config/axios-config';

export async function uploadImage(image) {
  try {
    let formData = new FormData();
    formData.append('image', image);
    let result = await AxiosInstance.post('/upload-image', formData);
    return result;
  } catch (err) {
    throw new Error(err);
  }
}

export async function uploadAudio(audio) {
  try {
    let formData = new FormData();
    formData.append('audio', audio);
    let result = await AxiosInstance.post('/upload-audio', formData);
    return result;
  } catch (err) {
    throw new Error(err);
  }
}
