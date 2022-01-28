import axios from "axios";

export async function sendMessage(text) {
  try {
    await axios.post("/send-message", text);
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
    // TODO: Kinda hard
    let result = await axios.get("/get-messages");
    console.log(result);
    return {
      messages: result.data.messages,
    };
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        "A problem occurred while getting this rooms messages. Please refresh."
    );
  }
}
