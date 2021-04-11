describe('Note App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')

    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'Miguel',
      username: 'midudev',
      password: 'lamidupassword'
    }

    cy.request('POST', 'http://localhost:3001/api/users', user)
  })

  it('frontpage can be opened', () => {
    cy.contains('Notes')
  })

  it('login form can be opened', () => {
    cy.contains('Show Login').click()
  })

  it('user can login', () => {
    cy.contains('Show Login').click()
    cy.get('[placeholder="Username"]').type('midudev')
    cy.get('[placeholder="Password"]').last().type('lamidupassword')
    cy.get('#form-login-button').click()
    cy.contains('Create a new note')
  })

  it('login fails with wrong password', () => {
    cy.contains('Show Login').click()
    cy.get('[placeholder="Username"]').type('midudev')
    cy.get('[placeholder="Password"]').last().type('password-incorrecta')
    cy.get('#form-login-button').click()

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .should('have.css', 'color', 'rgb(255, 0, 0)')
      .should('have.css', 'border-style', 'solid')
  })

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'midudev', password: 'lamidupassword' })
    })

    it('a new note can be created', () => {
      const noteContent = 'a note created by cypress'
      cy.contains('Show Create Note').click()
      cy.get('input').type(noteContent)
      cy.contains('save').click()
      cy.contains(noteContent)
    })

    describe('and a note exists', () => {
      beforeEach(() => {
        cy.createNote({
          content: 'This is the first note',
          important: false
        })

        cy.createNote({
          content: 'This is the second note',
          important: false
        })

        cy.createNote({
          content: 'This is the third note',
          important: false
        })
      })

      it.only('it can be made important', () => {
        cy.contains('This is the second note').as('theNote')

        cy.get('@theNote')
          .contains('make important')
          .click()

        cy.debug()

        cy.get('@theNote')
          .contains('make not important')
      })
    })
  })
})