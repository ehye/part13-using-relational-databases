Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username,
    password,
  }).then((response) => {
    localStorage.setItem('loggedBlogAppUser', JSON.stringify(response.body))
    cy.visit('http://localhost:5173')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: 'http://localhost:3001/api/blogs',
    method: 'POST',
    body: {
      title,
      author,
      url,
    },
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedBlogAppUser')).token}`,
    },
  })

  cy.visit('http://localhost:5173')
})
