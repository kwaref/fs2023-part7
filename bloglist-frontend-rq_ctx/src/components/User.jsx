import React from 'react'
import { useUserValue } from '../Context'

export const User = ({ user }) => {
  const loggedUser = useUserValue()
  return !loggedUser || !user ? null : (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}
