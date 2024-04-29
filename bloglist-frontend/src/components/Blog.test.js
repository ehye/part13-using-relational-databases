import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test("renders the blog's title and author", () => {
  const blog = {
    title: 'TITLE',
    author: 'AUTHOR',
  }
  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('TITLE')
  expect(div).toHaveTextContent('AUTHOR')
  expect(div).not.toHaveTextContent('URL')
  expect(div).not.toHaveTextContent('LIKES')
})

test('URL and likes are shown when button has been clicked', async () => {
  const blog = {
    title: 'TITLE',
    author: 'AUTHOR',
    url: 'URL',
    likes: '1',
  }
  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = container.querySelector('#btn-show')
  await user.click(button)

  const div = container.querySelector('.togglableContent')
  expect(div).not.toHaveStyle('display: none')
})

test('the like button is clicked twice, the event handler is called twice', async () => {
  const blog = {
    title: 'TITLE',
    author: 'AUTHOR',
    url: 'URL',
    likes: '1',
  }
  const updateLikes = jest.fn()
  const { container } = render(<Blog blog={blog} updateLikes={updateLikes} />)

  const user = userEvent.setup()
  const button = container.querySelector('#btn-likes')
  await user.click(button)
  await user.click(button)

  expect(updateLikes.mock.calls).toHaveLength(2)
})
