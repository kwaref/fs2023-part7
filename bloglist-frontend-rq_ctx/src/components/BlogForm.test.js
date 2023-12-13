/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('BlogForm calls the correct handler to create a new blog', () => {
  const create = jest.fn()

  const component = render(<BlogForm handleCreate={create} />)

  const form = component.container.querySelector('form')
  const title = component.container.querySelector('#titleInput')
  const author = component.container.querySelector('#authorInput')
  const url = component.container.querySelector('#urlInput')

  fireEvent.change(title, { target: { value: 'A new title' } })
  fireEvent.change(author, { target: { value: 'Author Name' } })
  fireEvent.change(url, { target: { value: 'url.for.blog' } })
  fireEvent.submit(form)

  expect(create.mock.calls).toHaveLength(1)
  expect(create.mock.calls[0][0].title).toBe('A new title' )
  expect(create.mock.calls[0][0].author).toBe('Author Name' )
  expect(create.mock.calls[0][0].url).toBe('url.for.blog' )
})