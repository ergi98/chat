export async function create() {
  try {
  } catch (err) {
    throw new Error(
      err.message ??
        "A problem occurred while creating your room. Please refresh"
    );
  }
}
