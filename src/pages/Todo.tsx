import {fetchTodo, createTodo, updateTodo, deleteTodo } from "../store/slices/todoSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useState, useEffect } from "react";
import "./Todo.css";

const Todo = () => {
  const todos = useAppSelector((state) => state.todo.todos);
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  
  useEffect(() => {
    dispatch(fetchTodo());
  }, [dispatch]);

  const handleAdd = () => {
    if (!text.trim()) return;
    dispatch(createTodo({
      text,
      completed: false
    }));
    setText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;  
    if (filter === "completed") return todo.completed;
    return true;
  })
  return (
    <div className="todo-wrapper">
      <div className="todo-card">
        <h2>Your todo list</h2>
        <div className="todo-row">
          <input
            type="text"
            placeholder="Add new task"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleAdd}>Add</button>
        </div>
        <div className="todo-filters">
          <button
            className={`filter ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}>All</button>
          <button className={`filter ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}>Active</button>
           <button className={`filter ${filter === "completed" ? "completed" : ""}`}
          onClick={() => setFilter("completed")}>Completed</button>
        </div>
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo._id} className="todo-item">
              <div className="todo-left">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => dispatch(updateTodo({...todo, completed: !todo.completed}))}
                />

                {editingId === todo._id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-input"
                    />
                  </>
                ) : (
                  <>
                    <span
                      className={`todo-text ${todo.completed ? "completed" : ""}`}
                    >
                      {todo.text}
                    </span>
                  </>
                )}
              </div>

              <div className="todo-actions">
                {editingId === todo._id ? (
                  <>
                  <button className="todo-btn" onClick={() => {
                    if (editText.trim()){
                      dispatch(updateTodo({ ...todo, text: editText }));
                    }
                    
                    setEditingId(null);
                  }}>Save</button>

                  <button className="todo-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                  <button className="todo-btn" onClick={() => {
                    setEditingId(todo._id);
                    setEditText(todo.text);
                  }}>Edit</button> 

                  <button className="todo-btn" onClick={() => dispatch(deleteTodo(todo._id))}>X</button>

                  </>
                )
                }
              </div>
            </li>
          ))}
        </ul>
        <div className="todo-remaining">
          Your todo remaining: {todos.filter((t) => !t.completed).length}
        </div>
      </div>
    </div>
  );
};

export default Todo;
