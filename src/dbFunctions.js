import {
  doc,
  updateDoc,
  deleteDoc,
  getFirestore,
  addDoc,
  collection,
} from "firebase/firestore";

const db = getFirestore();

/**
 * Updates a specific todo's completed status in Firestore.
 * @param {string} title - The title of the todo.
 * @param {string} description - A description of the todo.
 * @param {boolean} completed - The completion status of the todo (default: false).
 * @param {string} userId - The ID of the user who owns the todo.
 * @param {string} todoId - The unique ID of the todo to update.
 * @param {boolean} isCompleted - The new completion status of the todo.
 * @returns {Promise} - A promise that resolves with the added document's ID or rejects with an error.

 */

const updateTodoStatus = async (userId, todoId, isCompleted) => {
  try {
    // Reference to the specific todo document in Firestore
    const todoDocRef = doc(db, "todos", todoId);

    // Update the 'completed' field of the todo document
    await updateDoc(todoDocRef, {
      completed: isCompleted,
    });

    console.log(`Todo ${todoId} completion status updated to ${isCompleted}`);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

const deleteTodo = async (todoId) => {
  try {
    // Reference to the specific todo document in Firestore
    const todoDocRef = doc(db, "todos", todoId);

    // Delete the todo document
    await deleteDoc(todoDocRef);

    console.log(`Todo ${todoId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

const addTodo = async (title, description, completed = false, userId) => {
  try {
    // Reference to the todos collection in Firestore
    const todosCollectionRef = collection(db, "todos");

    // Add the new todo document to the todos collection
    const docRef = await addDoc(todosCollectionRef, {
      title,
      description,
      completed,
      userId,
    });

    console.log("Todo added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
};

export { updateTodoStatus, deleteTodo, addTodo };
