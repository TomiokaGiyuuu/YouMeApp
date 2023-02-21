import {configureStore} from '@reduxjs/toolkit'
import {postReducer} from "./slices/posts";
import {authReducer} from "./slices/auth";
import {commentReducer} from "./slices/comments";

const store = configureStore({
    reducer: {
        posts: postReducer,
        auth: authReducer,
        comments: commentReducer,
    }
})

export default store
