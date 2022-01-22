import axios from "axios";

export async function create() {
  try {
    let result = await axios.post("/create-room");

    localStorage.setItem("room", JSON.stringify(result.data.room));
    return {
      room: result.data.room,
    };
  } catch (err) {
    throw new Error(
      err.message ??
        "A problem occurred while creating your room. Please refresh"
    );
  }
}

export async function checkIfRoomExists(roomId) {
  try {
    let result = await axios.get("/check-if-room-exists", {
      params: { roomId },
    });
    return {
      room: result.data.roomData,
    };
  } catch (err) {
    throw new Error(
      err.message ?? "A problem occurred while checking if room exists!"
    );
  }
}

export async function assignUserToRoom() {
  try {
    await axios.post("/assign-to-room");
  } catch (err) {
    throw new Error(
      err.message ??
        "A problem occurred while assigning you to the room. Please refresh"
    );
  }
}
