import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> the event handler received props with the right details when submit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const inputTitle = container.querySelector('#input-title')
  const inputAuthor = container.querySelector('#input-author')
  const inputUrl = container.querySelector('#input-url')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'a title')
  await user.type(inputAuthor, 'a author')
  await user.type(inputUrl, 'a url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('a title')
  expect(createBlog.mock.calls[0][0].author).toBe('a author')
  expect(createBlog.mock.calls[0][0].url).toBe('a url')
})
