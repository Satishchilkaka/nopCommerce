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
describe('Verify search and advance search', () => {
    beforeEach(() => {
        cy.visit('')
    })


    describe.skip('Home Search buttn', function () {


        it('navigate', function () {

            search.getSearch()


        })

        it('Search input field with placeholder text', () => {

            search.getSearch()

            getIframeBody().find('#small-searchterms').should('have.attr', 'placeholder', 'Search item')

        })

        it('Search with an empty term', () => {

            cy.visit('')

            getIframeBody().find('#small-searchterms').clear()

            cy.get('iframe').then(($iframe) => {
                const $body = $iframe.contents().find('body')
                const $win = $iframe[0].contentWindow

                cy.stub($win, 'alert').as('windowAlert')

                cy.wrap($body)
                    .find('.search-box-button').click().should(function () {
                        expect(this.windowAlert).to.be.calledWith('Search term minimum length is  one character')
                        //expect(this.windowAlert).to.be.calledWith('Please enter some search keyword')
                    })
            })


        })

        it('Search a random term', () => {

            search.getSearch()

            getIframeBody().find('#small-searchterms').type(faker.random.alphaNumeric(3))

            search.clickSearchButton()
            cy.wait(2000)

            searchAsserations.storesearchAssertions()

        })

        it('Search same random term twice', () => {
            search.getSearch()
            const randomSearchTerm = faker.random.alphaNumeric(3)

            getIframeBody().within(() => {
                cy.get('#small-searchterms').type(randomSearchTerm)

            });
            search.clickSearchButton()
            cy.wait(2000)
            getIframeBody().within(() => {
                cy.get('#small-searchterms').clear()
                cy.get('#small-searchterms').type(randomSearchTerm)
            })
            search.clickSearchButton()
            searchAsserations.storesearchAssertions()
        })

        it('Search twice with updated random search term', () => {
            search.getSearch()

            getIframeBody().within(() => {
                cy.get('#small-searchterms').type(faker.random.alphaNumeric(3))

            })
            search.clickSearchButton()
            cy.wait(2000)
            getIframeBody().within(() => {
                cy.get('#small-searchterms').clear()
                cy.get('#small-searchterms').type(faker.random.alphaNumeric(3))
            })
            search.clickSearchButton()
            searchAsserations.storesearchAssertions()

        })

        it('Search with 1 character', () => {

            search.getSearch()

            getIframeBody().within(() => {
                cy.get('#small-searchterms').type(faker.random.alphaNumeric(1))

            })
            search.clickSearchButton()
            cy.wait(2000)
            searchAsserations.storesearchAssertions()

        })

        it('Search with one word', () => {
            search.getSearch()

            getIframeBody().within(() => {
                cy.get('#small-searchterms').type(faker.random.word())

            })
            search.clickSearchButton()
            cy.wait(2000)
            searchAsserations.storesearchAssertions()

        })

        it('Clear search results', () => {

            search.getSearch()

            getIframeBody().within(() => {
                cy.get('#small-searchterms').type('Book')
                cy.wait(2000)
                cy.get('.search-box-button').click()
                cy.wait(2000)


            })

            getIframeBody().within(() => {
                cy.get('.product-grid').should('be.visible');

            })

            getIframeBody().within(() => {
                cy.get('.search-text').clear()
                cy.get('.product-grid').should('not.be.visible');
            })

        })

        it('Search multiple words in the search filed', () => {
            let Searchterm = faker.commerce.productName()

            search.searchTerm(Searchterm)

            searchAsserations.storesearchAssertions()

        })

        it('Search product First word last and Last word first', () => {
            let term = 'Book Apple'
            search.searchTerm(term)
            searchAsserations.storesearchAssertions()
        })

        it('verify Search suggestions while typing', () => {

            search.getSearch()

            getIframeBody().within(() => {

                cy.get('#small-searchterms').type('Book ')


            })

            getIframeBody().find('#ui-id-1').find('li').should(($el) => {
                expect($el).to.have.length(4);
                expect($el).to.have.length > 1;

            })

        })

        it('More relevant products for the search term', () => {

            let searchWord = 'Apple MacBook Pro 13-inch'
            search.searchTerm(searchWord)
            getIframeBody().within(() => {
                cy.get('.product-title').then(($pName) => {
                    expect($pName).to.have.text(searchWord)
                })

            })

        })

        it('Search any one-word match with product name', () => {
            let searchWord = 'MacBook'
            search.searchTerm(searchWord)
            getIframeBody().within(() => {
                cy.get('.product-title').then(($pName) => {

                    expect($pName).to.contain(searchWord)
                })

            })

        })

        it('Search upper and lower case combination', () => {

            let searchWord = 'MACBook'
            search.searchTerm(searchWord)
            getIframeBody().within(() => {
                cy.get('.product-grid').should('be.visible');

            })

        })

    })

    describe('Verify advance search', () => {

        it('Click on advance search', () => {

            searchAsserations.storesearchAssertions()

            search.navigateToAdvanceSearchInValidProductName(faker.random.alphaNumeric(3))
        })
    })

})