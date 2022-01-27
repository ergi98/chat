import axios from "axios";

export async function sendMessage() {
  try {
    // TODO:
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        "A problem occurred while sending your message. Please try again."
    );
  }
}

export async function getMessages() {
  try {
    // TODO:
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        "A problem occurred while getting this rooms messages. Please refresh."
    );
  }
}
