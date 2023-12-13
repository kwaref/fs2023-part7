describe('Bloglist app', function() {
  beforeEach(function() {
    cy.request('POST',  `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Karel Rodríguez Varona',
      username: 'karel',
      password: '123456789'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#input-username').type('karel')
      cy.get('#input-password').type('123456789')
      cy.get('#button-login').click()

      cy.contains('Karel Rodríguez Varona logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#input-username').type('karel')
      cy.get('#input-password').type('1234567')
      cy.get('#button-login').click()

      cy.contains('invalid username or password')
      cy.contains('Log in to application')
      cy.get('#notification-message').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({
        username: 'karel', password: '123456789'
      })
    })

    it('a blog can be created', function() {
      cy.createBlog({
        title: 'a blog created by cypress',
        author: 'Fernando Pessoa',
        url: 'https://a.blog.by.cypress',
        likes: 0
      })
      cy.contains('a blog created by cypress')
    })

    describe('when a blog is created...', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'a blog created by cypress',
          author: 'Fernando Pessoa',
          url: 'https://a.blog.by.cypress',
          likes: 0
        })
      })

      it('can be liked', function () {
        cy.contains('a blog created by cypress').parent().as('wrapper')
        cy.get('@wrapper').contains('view').click()
        cy.get('@wrapper').find('.like-button').click()
        cy.get('@wrapper').find('#likes-holder').should('contain', '1')
      })

      it('can be removed by its creator', function () {
        cy.contains('a blog created by cypress').parent().as('wrapper')
        cy.get('@wrapper').contains('view').click()
        cy.get('@wrapper').find('.remove-button').click()
        cy.get('html').should('not.contain', 'a blog created by cypress')
      })

      it('a user that did not created a blog can not see its delete button', function () {
        cy.get('.logout-button').click()
        const user = {
          name: 'Intruder Inc',
          username: 'intruder',
          password: 'intruder'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.login({ username: 'intruder', password: 'intruder' })
        cy.contains('a blog created by cypress').parent().as('wrapper')
        cy.get('@wrapper').contains('view').click()
        cy.get('@wrapper').find('.remove-button').should('not.exist')
      })
    })

    describe('when several blogs are present...', function () {
      beforeEach(function () {
        cy.createBlog({
          'title': 'El código DaVinci',
          'author': 'Dan Brown',
          'url': '_davincis_code.com',
          'likes': 15
        })
        cy.createBlog({
          'title': 'Veronica decide morir',
          'author': 'Paulo Coelho',
          'url': 'http://_veronica_decide_morir.br',
          'likes': 12
        })
        cy.createBlog({
          'title': '100 años de soledad',
          'author': 'Gabriel García Márquez',
          'url': 'http://_100_annos.de.soledad.co',
          'likes': 25
        })
      })

      it('blogs should be in decreasing-likes order', function () {
        cy.get('.blog').then(blogs => {
          cy.get(blogs).eq(0).should('contain', '100 años de soledad')
          cy.get(blogs).eq(1).should('contain', 'El código DaVinci')
          cy.get(blogs).eq(2).should('contain', 'Veronica decide morir')
        })
      })
    })
  })
})