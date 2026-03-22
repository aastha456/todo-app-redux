import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import type { Todo } from "../../components/types"
import { create, fetchAll, deleteById, update } from "../../api/todo"

interface TodoState {
    todos: Todo[];
    loading: boolean;
}

const initialState: TodoState = {
    todos: [],
    loading: false
}


export const fetchTodo = createAsyncThunk("todos/fetchTodos",
    async () => {
        const { data } = await fetchAll();
        return data;
    }
)

export const createTodo = createAsyncThunk("todos/createTodo",
    async (data: Omit<Todo, "_id">) => {
        const { data: createTodo} = await create(data);
        return createTodo;
    }
)

export const deleteTodo = createAsyncThunk("todos/deleteTodo", 
    async (id: string) => {
        const response = await deleteById(id);
        return response;
    }
)

export const updateTodo = createAsyncThunk("todos/updateTodo",
    async (todo: Todo) => {
        const {_id, ...data} = todo;
        const { data: updatedTodo} = await update(_id, data);
        return updatedTodo;
    }
)

const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTodo.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(fetchTodo.fulfilled, (state, action) => {
            state.loading = false;
            state.todos = action.payload;
        });

        builder.addCase(fetchTodo.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(createTodo.fulfilled, (state, action) => {
            state.todos.push(action.payload);
        });

        builder.addCase(deleteTodo.fulfilled, (state, action) => {
            state.todos = state.todos.filter((todo) => todo._id !== action.meta.arg)
        });

        builder.addCase(updateTodo.fulfilled, (state, action) => {
            const index = state.todos.findIndex(todo => todo._id === action.payload._id)

            if(index !== -1){
                state.todos[index] = action.payload;

            }
        })
    }
})

export default todoSlice.reducer;


