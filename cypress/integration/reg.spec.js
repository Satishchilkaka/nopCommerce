

var faker = require('faker')
import search from './searchObj/search.js'

import searchAsserations from './searchObj/searchAssertions.js'

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

describe('it should Verify search and advance search', () => {

    let randomSearch = faker.random.alphaNumeric(5)
    beforeEach(() => {
        cy.visit('')
    })

    it('It should navigate to registraton form', () => {

        search.fillRegForm()


        /*     getIframeBody().within(() => {
                cy.get('.title').eq(0).and.then(($el) => {
                    except($el).to.have.text('Register')
                })
            }) */

    })

})
