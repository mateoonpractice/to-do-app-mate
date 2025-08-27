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
    <div className="container" style={{ maxWidth: "500px", marginTop: "50px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h1 className="card-title text-center mb-4">To-Do: Lista de Tareas</h1>
          <form className="d-flex mb-3" onSubmit={addTodo}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Escribe una nueva tarea..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Agregar</button>
          </form>
          <ul className="list-group">
            {todos.map(todo => (
              <li key={todo.id} className="list-group-item d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={todo.done || false}
                    onChange={() => toggleDone(todo.id, todo.done)}
                  />
                  <span
                    style={{ textDecoration: todo.done ? "line-through" : "none" }}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="btn btn-danger btn-sm"
                  title="Eliminar"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
