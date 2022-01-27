import axios from "axios";

export async function create() {
  try {
    let result = await axios.post("/create-room");
    return {
      room: result.data.room,
    };
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        "A problem occurred while creating your room. Please refresh"
    );
  }
}

export async function getRoom() {
  try {
    let result = await axios.get("/get-room");
    return {
      room: result.data.roomData,
    };
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        "A problem occurred while getting your room!"
    );
  }
}

export async function assignUserToRoom() {
  try {
    let result = await axios.post("/assign-to-room");
    return {
      room: result.data.room,
    };
  } catch (err) {
    console.log(err);
    throw new Error(
      err.response?.data?.message ??
        "A problem occurred while assigning you to the room. Please refresh"
    );
  }
}
