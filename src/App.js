import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  /*getDocs,*/
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Escuchar tareas en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      setTodos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Agregar nueva tarea
  const addTodo = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const docRef = await addDoc(collection(db, "todos"), {
      text: input,
      done: false,
    });
    setTodos([...todos, { id: docRef.id, text: input, done: false }]);
    setInput("");
  };

  // Eliminar tarea
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Nueva función para marcar como hecho/no hecho
  const toggleDone = async (id, currentDone) => {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, {
      done: !currentDone,
    });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h1>📝 To-Do List</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Nueva tarea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "8px", width: "70%" }}
        />
        <button type="submit" style={{ padding: "8px" }}>Agregar</button>
      </form>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: "10px" }}>
            <input
              type="checkbox"
              checked={todo.done || false}
              onChange={() => toggleDone(todo.id, todo.done)}
            />
            <span
              style={{
                textDecoration: todo.done ? "line-through" : "none",
                marginLeft: "8px"
              }}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                marginLeft: "10px",
                background: "red",
                color: "white",
                border: "none",
                padding: "5px"
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
