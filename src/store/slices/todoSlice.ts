import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Todo {
    id: string,
    text: string,
    completed: boolean
}

interface TodoState {
    todos: Todo[]
}

const loadFromLocalStorage = (): Todo[] => {
    try{
        const todos = localStorage.getItem("todos");
        return todos ? JSON.parse(todos) : [];

    } catch (e) {
        console.log("Failed to load the todos", e)
        return [];
    }
}

const saveToLocalStorage = (todos: Todo[]) => {
    try {
        localStorage.setItem("todos", JSON.stringify(todos));
    } catch (e) {
        console.error("Failed to save todos", e);
    }
};

const todoInitialState: TodoState = {
    todos: loadFromLocalStorage()
}

const todoSlice = createSlice({
    name: "todo",
    initialState: todoInitialState,
    reducers: {
        addTodo: (state, action: PayloadAction<{text: string}>) => {
            const newTodo: Todo = {
                id: Date.now().toString(),
                text: action.payload.text,
                completed: false
            }
            state.todos.push(newTodo);
            saveToLocalStorage(state.todos);
        },
        toggleTodo: (state, action: PayloadAction<{id: string}>) => {
            const todo = state.todos.find(t => t.id === action.payload.id);
            if(todo){
                todo.completed = !todo.completed;
            }
            saveToLocalStorage(state.todos);
        },
        deleteTodo: (state, action: PayloadAction<{id: string}>) => {
            state.todos = state.todos.filter(t => t.id !== action.payload.id);
            saveToLocalStorage(state.todos);
        }

    } 
});

export const { addTodo, toggleTodo, deleteTodo} = todoSlice.actions;
export default todoSlice.reducer;