/* eslint-disable no-undef */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Blog from './Blog'

describe('Blog component', () => {

  let component

  beforeEach(() => {
    const blog = {
      id: 1,
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 10,
      user: {
        username: 'testuser',
        name: 'Test User',
      },
    }

    const user = {
      username: 'testuser',
    }

    const mockLikeHandler = jest.fn()
    const mockRemoveHandler = jest.fn()

    component = render(<Blog blog={blog} user={user} like={mockLikeHandler} remove={mockRemoveHandler} />)
  })

  test('renders title and author, but not URL or likes by default', () => {

    const div = component.container.querySelector('.blog-details')

    expect(screen.getByText('Test Blog Test Author')).toBeInTheDocument()

    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the view button, the blog details are visible', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.blog-details')
    expect(div).toHaveStyle('display: block')
  })

  test('clicking the like button twice will call the handler function twice', () => {

    const blog = {
      id: 1,
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 10,
      user: {
        username: 'testuser',
        name: 'Test User',
      },
    }

    const user = {
      username: 'testuser',
    }

    const mockLikeHandler = jest.fn()
    const mockRemoveHandler = jest.fn()

    component = render(<Blog blog={blog} user={user} like={mockLikeHandler} remove={mockRemoveHandler} />)

    const button = component.container.querySelector('.like-button')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})