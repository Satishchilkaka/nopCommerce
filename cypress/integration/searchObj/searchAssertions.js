

const getIframeDocument = () => {
    return cy
        .get('iframe')

        .its('0.contentDocument').should('exist')
}
const getIframeBody = () => {
    return getIframeDocument()
        .its('body').should('not.be.undefined')

        .then(cy.wrap)
}


function storesearchAssertions() {

    getIframeBody().within(() => {
        /* cy.get('h1').should('have.text', 'Search the store')

        cy.get('[for="q"]').should('have.text', 'Search item:')

        cy.get('.search-text').should('be.visible')

        cy.get('#adv').should('be.visible')
        cy.get('.search-box-button').should('contain', 'Search')
        cy.get('.search-results').should('have.text', 'display as "No results for <search_criteria>') */

        cy.get('h1').should('have.text', 'Search')

        cy.get('[for="q"]').should('have.text', 'Search keyword:')

        cy.get('.search-text').should('be.visible')

        cy.get('#adv').should('be.visible')
        cy.get('.search-box-button').should('contain', 'Search')
        cy.get('.search-results').should('have.text', 'No products were found that matched your criteria.')

    })
}


module.exports = {

    storesearchAssertions

}