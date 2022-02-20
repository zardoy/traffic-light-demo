/// <reference types="cypress" />

// TODO refactor with helpers

it('First visit redirects to red', () => {
    cy.visit('/')
    cy.location('hash').should('eq', '#/red')
    cy.get('[data-test=red]').should('not.have.class', 'disabled')
    // timeout in place
    cy.get('[data-test=red] span').contains(/^\d+$/)
})

it('Loads yellow light on explicit load', () => {
    cy.visit('/#yellow')
    // ensure doesn't change to /red
    cy.location('hash').should('eq', '#/yellow')
    cy.get('[data-test=yellow]').should('not.have.class', 'disabled')
})

it('Changing url also changes the light', () => {
    cy.visit('/')
    cy.visit('/#yellow')
    cy.get('[data-test=yellow]').should('not.have.class', 'disabled')
})

// TODO test combinations

it('Clicking light changes the light and url', () => {
    cy.visit('/#green')
    // ensure on green (eg yellow)
    cy.get('[data-test=green]').should('not.have.class', 'disabled')
    cy.get('[data-test=yellow]').click()
    cy.get('[data-test=yellow]').should('not.have.class', 'disabled')
    cy.location('hash').should('eq', '#/yellow')
})

describe('Restores state from memory', () => {
    it('From the same url', () => {
        cy.visit('/#yellow')
        cy.get('[data-test=yellow] span')
            .contains(/^\d+$/)
            .then($span => {
                const count = +$span.text()
                cy.wait(1100).then(() => {
                    cy.reload()
                    // localStorage.clear()
                    cy.get('[data-test=yellow] span')
                        .contains(/^\d+$/)
                        .then($span => {
                            expect(+$span.text()).to.equal(count - 1)
                        })
                })
            })
    })
    it('From the root url', () => {
        cy.visit('/#yellow')
        cy.get('[data-test=yellow] span')
            .contains(/^\d+$/)
            .then($span => {
                const count = +$span.text()
                cy.wait(1100).then(() => {
                    cy.visit('/')
                    cy.get('[data-test=yellow] span')
                        .contains(/^\d+$/)
                        .then($span => {
                            expect(+$span.text()).to.equal(count - 1)
                        })
                })
            })
    })
})

describe('Automatic light control', () => {
    it('Goes to green from yellow on cooldown', () => {
        localStorage.setItem('trafficLightMemory', JSON.stringify({ signalIndex: 1, currentCooldown: 1 }))
        cy.visit('/')
        cy.wait(1100)
        cy.get('[data-test=green]').should('not.have.class', 'disabled')
    })
})
