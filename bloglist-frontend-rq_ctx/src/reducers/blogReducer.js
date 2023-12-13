import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { notify } from './notificationReducer'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        like(state, action) {
            const id = action.payload
            const blogToLike = state.find(blog => blog.id === id)
            const updatedBlog = { ...blogToLike, likes: blogToLike.likes + 1 }
            return state.map(blog => blog.id !== id ? blog : updatedBlog).sort((a, b) => b.likes - a.likes)
        },
        addBlog(state, action) {
            state.push(action.payload)
        },
        setBlogs(state, action) {
            return action.payload
        },
        remove(state, action) {
            const id = action.payload
            return state.filter(blog => blog.id !== id).sort((a, b) => b.likes - a.likes)
        }
    }
})

export const { addBlog, setBlogs, like, remove } = blogSlice.actions

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
    }
}

export const createBlog = content => {
    return async dispatch => {
        try {
            const blog = await blogService.create(content)
            dispatch(addBlog(blog))
            dispatch(
                notify(
                    {
                        message: `a new blog ${blog.title} by ${blog.author} added`,
                        error: false,
                    },
                    3000
                )
            )
        } catch (error) {
            dispatch(
                notify({ message: error.response.data.error, error: true }, 3000)
            )
        }
    }
}

export const likeUp = (blog) => {
    return async dispatch => {
        const updatedBlog = await blogService.update(blog)
        dispatch(like(updatedBlog.id))
    }
}

export const removeBlog = id => {
    return async dispatch => {
        await blogService.remove(id)
        dispatch(remove(id))
    }
}



export default blogSlice.reducer