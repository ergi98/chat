import axios from "axios";

export async function create(user) {
  try {
    let result = await axios.post("/create-room", {
      user_id: user._id,
    })
  } catch (err) {
    throw new Error(
      err.message ??
        "A problem occurred while creating your room. Please refresh"
    );
  }
}
