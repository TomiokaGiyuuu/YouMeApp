import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from "../../axios";


export const fetchComments = createAsyncThunk('posts/fetchComments', async () => {
    const {data} = await axios.get('/comments')
    return data
})

const initialState = {
    comments: {
        items: [],
        status: 'loading',
    }
}

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchComments.pending]: (state) => {
            state.tags.items = []
            state.tags.status = 'loading'
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.tags.items = action.payload
            state.tags.status = 'loaded'
        },
        [fetchComments.rejected]: (state) => {
            state.tags.items = []
            state.tags.status = 'error'
        },
    }
})

export const commentReducer = commentSlice.reducer
