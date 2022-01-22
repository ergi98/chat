import axios from "axios";

export async function create(roomId) {
  try {
    let result = await axios.post("/create-user", { roomId });
    localStorage.setItem("jwt", JSON.stringify(result.data.token));
    axios.interceptors.request.use((config) => {
      config.headers.authorization = `Bearer ${result.data.token}`;
      return config;
    });
    return {
      user: result.data.user,
    };
  } catch (err) {
    throw new Error(
      err.message ??
        "A problem occurred while creating your room. Please refresh."
    );
  }
}

export async function getUser() {
  try {
    let result = await axios.get("/get-user");
    return {
      user: result.data.user,
    };
  } catch (err) {
    throw new Error(
      err.message ??
        "A problem occurred while getting your user. Please refresh."
    );
  }
}

export async function checkIfUserBelongsToRoom(roomId) {
  try {
    let result = await axios.post("/check-if-belongs-to-room", { roomId });
    return {
      belongs: result.data.belongs,
    };
  } catch (err) {
    throw new Error(
      err.message ??
        "A problem occurred while validating your user. Please refresh."
    );
  }
}
