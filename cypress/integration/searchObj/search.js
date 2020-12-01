
const getIframeDocument = () => {
    return cy
        .get('iframe')
        // Cypress yields jQuery element, which has the real
        // DOM element under property "0".
        // From the real DOM iframe element we can get
        // the "document" element, it is stored in "contentDocument" property
        // Cypress "its" command can access deep properties using dot notation
        // https://on.cypress.io/its
        .its('0.contentDocument').should('exist')
}
const getIframeBody = () => {
    return getIframeDocument()
        .its('body').should('not.be.undefined')

        .then(cy.wrap)
}

function getSearch() {

    getIframeBody().find('#small-searchterms').should('have.class', 'search-box-text')
    getIframeBody().find('.search-box-button').should('have.value', 'Search')
}

function clickSearchButton() {
    getIframeBody().find('.search-box-button').click()
}

function searchTerm(sTerm) {

    getIframeBody().within(() => {
        cy.get('#small-searchterms').type(sTerm)

        cy.get('.search-box-button').click()
        cy.wait(2000)
    })

}

function navigateToAdvanceSearchInValidProductName(sTerm) {

      getIframeBody().within(() => {
        cy.get('[for="q"]').click()
    })

}


module.exports = {

    getSearch,
    clickSearchButton,
    searchTerm,
    navigateToAdvanceSearchInValidProductName
}
