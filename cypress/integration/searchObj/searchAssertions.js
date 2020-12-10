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

function waitforLoad() {
    let loadPage = cy.wait(2000);
    return loadPage
}

function storesearchAssertions() {

    getIframeBody().within(() => {
        cy.get('h1').should('have.text', 'Search the store')

        cy.get('[for="q"]').should('have.text', 'Search item:')

        cy.get('.search-text').should('be.visible')

        cy.get('#adv').should('be.visible')
        cy.get('.search-box-button').should('contain', 'Search')
        cy.get('.search-results').should('have.text', 'display as "No results for <search_criteria>')

        /*    cy.get('h1').should('have.text', 'Search')
    
            cy.get('[for="q"]').should('have.text', 'Search keyword:')
    
            cy.get('.search-text').should('be.visible')
    
            cy.get('#adv').should('be.visible')
            cy.get('.search-box-button').should('contain', 'Search')
            cy.get('.search-results').should('have.text', 'No products were found that matched your criteria.')
            cy.wait(2000) */

    })
}


function advancedSearchAssertions() {

    getIframeBody().within(() => {
        cy.get('[for="cid"]').should('have.text', 'Category:')
        cy.get('#cid').should(($input) => {
            expect($input).to.have.value('0')
        })

        cy.get('[for="mid"]').should('have.text', 'Manufacturer:')
        cy.get('#mid').should(($input) => {
            expect($input).to.have.value('0')
        })

        cy.get('[for="price-range"]').should('have.text', 'Price range:')

        cy.get('[for="sid"]').should('have.text', 'Search In product descriptions')

        cy.get('#sid').should('be.visible')

    })

}

function getadvancedSearchWarning() {

    getIframeBody().within(() => {

        cy.get('.warning').should('have.text', 'Search term minimum length is 3 characters')
        //  cy.get('.warning').should('have.text', 'Search term minimum length is  one character.')


    })

}

function getResults() {
    getIframeBody().within(() => {
        cy.get('.product-grid').should('be.visible');

    })
}

function uncheckAdvancedSearchAssertion() {

    getIframeBody().within(() => {

        cy.get('[for="cid"]').should('not.be.visible');
        cy.get('[for="mid"]').should('not.be.visible');
        cy.get('[for="price-range"]').should('not.be.visible');
    })
}

function getCategoryValues() {

    getIframeBody().within(() => {

        cy.get('#cid option').then(($options) => {
            //expect($options[0]).to.contain(['All'])
            //expect($options[1]).to.contain(['Computers'])
            expect($options).to.have.length(17)
            expect($options[0]).to.contain(['All'])
            expect($options[1]).to.contain(['Apparel'])
            expect($options[2]).to.contain(['Apparel >> Shoes'])
            expect($options[3]).to.contain(['Apparel >> Clothing'])
            expect($options[4]).to.contain(['Apparel >> Accessories'])
            expect($options[5]).to.contain(['Books'])
            expect($options[6]).to.contain(['Computers'])
            expect($options[7]).to.contain(['Computers >> Desktops'])
            expect($options[8]).to.contain(['Computers >> Notebooks'])
            expect($options[9]).to.contain(['Computers >> Software'])
            expect($options[10]).to.contain(['Electronics'])
            expect($options[11]).to.contain(['Electronics >> Camera & photo'])
            expect($options[12]).to.contain(['Cell phones'])
            expect($options[13]).to.contain(['Electronics >> Others'])
            expect($options[14]).to.contain(['Digital downloads'])
            expect($options[15]).to.contain(['Gift Cards'])
            expect($options[16]).to.contain(['Jewelry'])
        })

    })
}

function getManufactureValues() {
    getIframeBody().within(() => {
        cy.get('#mid option').then(($options) => {
            expect($options).to.have.length(4)
            expect($options[0]).to.contain(['Apple'])
            expect($options[1]).to.contain(['Lenovo'])
            expect($options[2]).to.contain(['Nokia'])
            expect($options[3]).to.contain(['Our brand'])
        })
    })
}

function getCatergoryWithManufatureValues(productName) {

    getIframeBody().within(() => {

        cy.get('#q').type(productName)
        cy.get('#cid').select('Electronics >> Camera & photo')
        cy.get('#mid').select('Apple')

        cy.get('.search-button').click()
        waitforLoad()

    })

}
function beforePriceRange(productName) {
    getIframeBody().within(() => {
        cy.get('#q').type(productName)
        cy.get('.search-button').click()
        waitforLoad()

    })

    getIframeBody().within(() => {

        cy.get('.item-box').then(($el) => {
            expect($el).to.have.length(4)

        })

    })

}

function afterPriceRange() {

    getIframeBody().within(() => {
        let minPrice = 1400
        let maxPrice = 1800
        //cy.get('#q').type(productName)
        cy.get('#pf').type(minPrice)
        cy.get('#pt').type(maxPrice)
        cy.get('.search-button').click()
        waitforLoad()

    })

    getIframeBody().within(() => {

        cy.get('.item-box').then(($el) => {
            expect($el).to.have.length(3)

        })

    })

}
function resultsNotVisible() {

    getIframeBody().within(() => {
        cy.get('.product-grid').should('not.be.visible');

    })

}

function priceAsStrings(productName) {

    getIframeBody().within(() => {
        let minPrice = 'Test'
        let maxPrice = 'Test'
        cy.get('#q').type(productName)
        cy.get('#pf').type(minPrice)
        cy.get('#pt').type(maxPrice)
        cy.get('.search-button').click()
        waitforLoad()

    })

}

function productDescriptions() {
    let pDescription = 'A groundbreaking Retina display. A new force-sensing trackpad';
    let productMatch = 'Apple MacBook Pro 13-inch'

    getIframeBody().within(() => {

        cy.get('#q').type(pDescription)

        cy.get('#sid').click()
        cy.get('.search-button').click()
        waitforLoad()

    })
    getIframeBody().within(() => {

        cy.get('.item-box').then(($el) => {
            expect($el).to.have.length(1)

        })

    })

    getIframeBody().within(() => {
        cy.get('.product-title').then(($pName) => {
            expect($pName).to.have.text(productMatch)
        })

    })

}

module.exports = {

    storesearchAssertions,
    advancedSearchAssertions,
    getadvancedSearchWarning,
    getResults,
    uncheckAdvancedSearchAssertion,
    getCategoryValues,
    getManufactureValues,
    getCatergoryWithManufatureValues,
    beforePriceRange,
    afterPriceRange,
    priceAsStrings,
    resultsNotVisible,
    productDescriptions

}
