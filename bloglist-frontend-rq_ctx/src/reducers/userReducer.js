import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import auth from '../services/auth'
import { notify } from './notificationReducer'

const initialState = null

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action) {
            return action.payload
        },
        logout(state, action) {
            return null
        }
    }
})

export const { login, logout } = userSlice.actions

export const singIn = (accessData) => {
    return async dispatch => {
        try {
            const loggedUser = await auth.login(accessData)
            dispatch(login(loggedUser))
            blogService.setToken(loggedUser.token)
            window.localStorage.setItem('loggedBloglistAppUser', JSON.stringify(loggedUser))
        } catch (error) {
            dispatch(
                notify({ message: error.response.data.error, error: true }, 3000)
            )
        }
    }
}


export default userSlice.reducer