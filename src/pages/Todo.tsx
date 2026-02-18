import { addTodo, toggleTodo, deleteTodo } from "../store/slices/todoSlice"
import {useAppDispatch, useAppSelector} from "../hooks/hooks"
import { useState, useEffect } from "react"
import './Todo.css'

const Todo = () => {
  const todos = useAppSelector((state) => state.todo.todos);
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const handleAdd = () => {
    if (!text.trim()) return;
    dispatch(addTodo({text}));
    setText("");
  }
  return (
    <div className="todo-wrapper">
      <div className="todo-card">
        <h2>Your todo list</h2>
        <div className="todo-row">
          <input type="text" placeholder="Add new task" value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={handleAdd}>Add</button>

        </div>
        <ul className="todo-list">
           {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <div className="todo-left">
                <input type="checkbox" checked={todo.completed} onChange={() =>dispatch(toggleTodo({id: todo.id}))}/>
                  <span className={`todo-text ${todo.completed ? "completed": ""}`}>{todo.text}</span>    
                  <button className="todo-btn" onClick={() => dispatch(deleteTodo({id: todo.id}))}>x</button>  
              </div>
                
            </li>
            ))}
        </ul>
        <div className="todo-remaining">
          Your todo remaining: {todos.filter(t => !t.completed).length}
        </div>

      </div>
        
      
    </div>
  )
}

export default Todo
