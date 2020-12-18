
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

    let randomSearch = faker.random.alphaNumeric(5)
    beforeEach(() => {
        cy.visit('')
    })

    describe('Home Search button', function () {


        it('Search input field', function () {

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
                        expect(this.windowAlert).to.be.calledWith('Search term minimum length is one character')
                        //expect(this.windowAlert).to.be.calledWith('Please enter some search keyword')
                    })
            })
        })

        it('Search a random term', () => {

            search.getSearch()

            getIframeBody().find('#small-searchterms').type(randomSearch)

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

            searchAsserations.getResults()

            getIframeBody().within(() => {
                cy.get('.search-text').clear()
                cy.get('.product-grid').should('not.be.visible');
            })

        })


        it('Search multiple words in the search filed', () => {
            let Searchterm = faker.commerce.productName()

            search.search(Searchterm)

            searchAsserations.storesearchAssertions()

        })

        it('Search product First word last and Last word first', () => {
            let term = 'Book Apple'
            search.search(term)
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
            search.search(searchWord)
            getIframeBody().within(() => {
                cy.get('.product-title').then(($pName) => {
                    expect($pName).to.have.text(searchWord)
                })

            })

        })

        it('Search any one-word match with product name', () => {
            let searchWord = 'MacBook'
            search.search(searchWord)
            getIframeBody().within(() => {
                cy.get('.product-title').then(($pName) => {

                    expect($pName).to.contain(searchWord)
                })

            })

        })

        it('Search upper and lower case combination', () => {

            let searchWord = 'MACBook'
            search.search(searchWord)
            getIframeBody().within(() => {
                cy.get('.product-grid').should('be.visible');

            })

        })

    })

    describe.skip('Verify advance search', () => {

        let productName = 'Book';


        it('Click on advance search', () => {

            search.search(randomSearch)
            searchAsserations.storesearchAssertions()

            search.navigateToAdvanceSearchInValidProductName(randomSearch)

            searchAsserations.advancedSearchAssertions()

        })

        it('Search with the empty  search term in advance search', () => {

            search.navigateToAdvanceSearchInValidProductName(randomSearch)

            getIframeBody().within(() => {
                cy.get('.search-button').click()
                cy.wait(2000)

            })
            searchAsserations.getadvancedSearchWarning()
        })

        it('advance search input field with placeholder text', () => {

            search.navigateToAdvanceSearchInValidProductName(randomSearch)

            getIframeBody().find('#q').should('have.attr', 'placeholder', 'Enter your search item here')

        })

        it('Search one word in advance search', () => {

            let existingProductName = 'Apple MacBook Pro 13-inch'

            search.navigateToAdvanceSearchInValidProductName(randomSearch)

            getIframeBody().within(() => {
                cy.get('#q').type(existingProductName)
            })

            getIframeBody().within(() => {
                cy.get('.search-button').click()
                cy.wait(2000)

            })

            searchAsserations.getResults()

        })

        it('Un check the advance search check box', () => {

            search.navigateToAdvanceSearchInValidProductName(randomSearch)

            searchAsserations.advancedSearchAssertions()

            getIframeBody().within(() => {
                cy.get('#adv').click({ force: true })
            })

            searchAsserations.uncheckAdvancedSearchAssertion()

        })

        it('Verify all category values', () => {

            search.navigateToAdvanceSearchInValidProductName(randomSearch)

            searchAsserations.getCategoryValues()

        })
        it('Verify manufacture values', () => {

            search.navigateToAdvanceSearchInValidProductName(randomSearch)
            searchAsserations.getManufactureValues()

        })

        it('Verify Catergory with Manufature values', () => {
            let productNames = 'Cam'

            search.navigateToAdvanceSearchInValidProductName(randomSearch)

            searchAsserations.getCatergoryWithManufatureValues(productNames)

            searchAsserations.getResults()
            getIframeBody().within(() => {
                cy.get('.product-title').then(($pName) => {

                    expect($pName).to.contain(productName)
                })

            })

        })

        it('Search based on Price range', () => {

            search.navigateToAdvanceSearchInValidProductName(randomSearch)

            searchAsserations.beforePriceRange(productName)
            searchAsserations.afterPriceRange()

        })

        it('Choose strings as price', () => {


            search.navigateToAdvanceSearchInValidProductName(randomSearch)

            searchAsserations.priceAsStrings(productName)
            searchAsserations.resultsNotVisible()

        })

        it('Apply Search In product descriptions', () => {

            search.navigateToAdvanceSearchInValidProductName(randomSearch)
            searchAsserations.productDescriptions()
        })

    })

    describe.skip('Filters and results', () => {
        let productName = 'Book';
        const pName = 'Apple MacBook Pro 13-inch'

        it('Apply sort filter', () => {

            search.search(productName)
            search.sortBy()

        })

        it('Results for page', () => {

            search.search(productName)
            search.ResultsForPage()

        })

        it('Grid view layout icon', () => {

            search.search(productName)
            search.GridViewLayout()

        })

        it('Search results', () => {

            search.search(productName)
            searchAsserations.getResults()

            getIframeBody().within(() => {

                cy.get('.item-box').then(($el) => {
                    expect($el).to.have.length(4)

                })

            })

        })

        it('Navigate to the product page using image', () => {


            search.search(pName)
            search.clickByPImage()
            search.navigateToNewpage(pName)



        })

        it('Navigate to the product page using name', () => {


            search.search(pName)
            search.clickByPName(pName)
            search.navigateToNewpage(pName)


        })

    })

})
