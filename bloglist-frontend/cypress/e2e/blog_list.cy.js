describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users', {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    })
    cy.request('POST', 'http://localhost:3001/api/users', {
      username: 'root',
      name: 'admin',
      password: 'root',
    })
    cy.visit('http://localhost:5173')
  })

  it('front page can be opened', function () {
    cy.contains('blogs')
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('input:first').type('123')
      cy.get('input:last').type('123')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe.only('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function () {
      cy.createBlog({ title: 'title', author: 'author', url: 'url' })

      cy.get('.blog').within(() => {
        cy.contains('title')
        cy.contains('view')
      })
    })

    it('Users can like a blog', function () {
      cy.createBlog({ title: 'title', author: 'author', url: 'url' })

      cy.get('.blog').within(() => {
        cy.get('#btn-show').click()
        cy.get('#btn-likes').click()
        cy.contains('likes 1')
      })
    })

    it('User who created a blog can delete it', function () {
      cy.createBlog({ title: 'title', author: 'author', url: 'url' })
      cy.get('.blog').within(() => {
        cy.get('#btn-show').click()
      })
      cy.get('#button-remove').click()
      cy.get('.blog').should('not.exist')
    })

    it('Only the creator can see the delete button', function () {
      cy.createBlog({ title: 'title', author: 'author', url: 'url' })
      cy.get('#button-logout').click()
      cy.login({ username: 'root', password: 'root' })
      cy.get('.blog').within(() => {
        cy.get('#btn-show').click()
        cy.get('#button-remove').should('not.exist')
      })
    })

    it('Blogs are ordered with the most likes being first', function () {
      cy.createBlog({ title: 'The title with the most likes', author: 'author0', url: 'url0' })
      cy.get('.blog').within(() => {
        cy.get('#btn-show').click()
        cy.get('#btn-likes').click()
      })
      cy.createBlog({ title: 'The title with the second most likes', author: 'author1', url: 'url1' })

      cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
      cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
    })
  })
})
