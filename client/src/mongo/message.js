import { AxiosInstance } from '../../axios_config/axios-config';
import { uploadImage } from './upload';

export async function sendMessage({ text, image }) {
  try {
    let imageResult,
      message = { text };
    image && (imageResult = await uploadImage(image));
    imageResult && (message.image = imageResult.data.file.path);
    let result = await AxiosInstance.post('/send-message', { message });
    return {
      message: result.data.message
    };
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        'A problem occurred while sending your message. Please try again.'
    );
  }
}

export async function getMessagesByChunks(lastFetchDate) {
  try {
    let result = await AxiosInstance.get('/get-messages', {
      params: { lastFetchDate }
    });
    console.log(result);
    return {
      messages: result.data.messages,
      date: result.data.date
    };
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        'A problem occurred while getting this rooms messages. Please refresh.'
    );
  }
}
