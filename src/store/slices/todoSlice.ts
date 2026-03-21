import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// define the structure of todo app
interface Todo {
    id: string,
    text: string,
    completed: boolean
}
// define the structure of todo slice state
interface TodoState {
    todos: Todo[]
}
// loads todo from the localstorage 
// this function tries to read the saved data that were stored in the local storage 
// if there are no saved data then it return empty array 
const loadFromLocalStorage = (): Todo[] => {
    try{
        const todos = localStorage.getItem("todos");
        return todos ? JSON.parse(todos) : [];
    } catch (e) {
        console.log("Failed to load the todos", e)
        return [];
    }
}
//Saves the todo app in the localstorage
// it will save the data as a JSON string 
const saveToLocalStorage = (todos: Todo[]) => {
    try {
        localStorage.setItem("todos", JSON.stringify(todos));
    } catch (e) {
        console.error("Failed to save todos", e);
    }
};

//initial state of the app start 
// it loads todo from the localStorage so that the data persists across the page reloads 
const todoInitialState: TodoState = {
    todos: loadFromLocalStorage()
}
// create the slice 
const todoSlice = createSlice({
    name: "todo",
    initialState: todoInitialState,
    reducers: {
        // add the todo
        addTodo: (state, action: PayloadAction<{text: string}>) => {
            const newTodo: Todo = {
                id: Date.now().toString(),// generate the unique ID
                text: action.payload.text, // displays as text 
                completed: false
            }
            state.todos.push(newTodo);
            saveToLocalStorage(state.todos);
        },
        toggleTodo: (state, action: PayloadAction<{id: string}>) => {
            // finds teh todo app which mathed the ID
            const todo = state.todos.find(t => t.id === action.payload.id);
            if(todo){
                todo.completed = !todo.completed;
            }
            saveToLocalStorage(state.todos);
        },
        deleteTodo: (state, action: PayloadAction<{id: string}>) => {
            // filter out the todo app with the matching ID
            // keep all tht todo app wehre the ID is not matched 
            state.todos = state.todos.filter(t => t.id !== action.payload.id);
            saveToLocalStorage(state.todos);
        },
        editTodo: (state, action: PayloadAction<{id: string, text: string}>) => {
            const todo =  state.todos.find(t => t.id === action.payload.id);
            if (todo){
                todo.text = action.payload.text;
            }
            saveToLocalStorage(state.todos);

        }

    } 
});

export const { addTodo, toggleTodo, deleteTodo, editTodo} = todoSlice.actions;
export default todoSlice.reducer;