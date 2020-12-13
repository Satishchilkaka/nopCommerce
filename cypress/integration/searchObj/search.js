
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

function getSearch() {

    getIframeBody().find('#small-searchterms').should('have.class', 'search-box-text')
    getIframeBody().find('.search-box-button').should('have.value', 'Search')
}

function clickSearchButton() {
    getIframeBody().find('.search-box-button').click()
}

function search(sTerm) {

    getIframeBody().within(() => {
        cy.get('#small-searchterms').type(sTerm)

        cy.get('.search-box-button').click()
        cy.wait(1000)
    })

}

function navigateToAdvanceSearchInValidProductName(sTerm) {
    getIframeBody().within(() => {
        cy.get('#small-searchterms').type(sTerm)

        cy.get('.search-box-button').click()
        cy.wait(1000)
    })

    getIframeBody().within(() => {
        cy.get('#adv').click({ force: true })
    })
    getIframeBody().within(() => {
        cy.get('#q').clear()
        cy.wait(1000)

    })


}

function sortBy() {
    getIframeBody().within(() => {
        cy.get('.product-sorting').should('contain', 'Sort by')
        cy.get('#products-orderby option').then(($options) => {
            expect($options).to.have.length(6)

            expect($options[0]).to.contain(['Position'])
            expect($options[1]).to.contain(['Name: A to Z'])
            expect($options[2]).to.contain(['Name: Z to A'])
            expect($options[3]).to.contain(['Price: Low to High'])
            expect($options[4]).to.contain(['Price: High to Low'])
            expect($options[5]).to.contain(['Created on'])

        })


    })

}


function ResultsForPage() {

    getIframeBody().within(() => {
        cy.get('.product-page-size').should('contain', 'Show results for page')

        cy.get('#products-pagesize option').then(($options) => {
            expect($options).to.have.length(4)

            expect($options[0]).to.contain(['10'])
            expect($options[1]).to.contain(['20'])
            expect($options[2]).to.contain(['50'])
            expect($options[3]).to.contain(['60'])


        })


    })

}

function GridViewLayout() {
    getIframeBody().within(() => {

        cy.get('.product-viewmode').should('have.class', 'active')


    })
}

function clickByPImage() {

    getIframeBody().within(() => {
        cy.get('[alt="Picture of Apple MacBook Pro 13-inch"]').eq(0).click()
        waitforLoad()
    })
}

function clickByPName(pName) {

    getIframeBody().within(() => {
        cy.contains(pName).click()
        waitforLoad()
    })
}

function navigateToNewpage(pName) {

    getIframeBody().within(() => {

        cy.get('.product-name').then(($productMatch) => {
            expect($productMatch).to.have.text(pName)
        })


    })

}

/* cy.waitUntil(() => cy.get("input[type=hidden]#recaptchatoken").then($el => $el.val()))
    // ... then, check that it's valid string asserting about it
    .then(token => expect(token).to.be.a("string").to.have.length.within(1, 1000));
 */
function fillRegForm() {

    getIframeBody().within(() => {

        cy.get('.ico-register').should('have.attr', 'href')
        cy.get('.ico-register').click()
        cy.server();
        cy.route('GET', 'register?returnUrl=%2F').as('get');

    })


    getIframeBody().within(() => {
        cy.wait('@get').then(() => {
            getIframeBody().find('.page-title', { timeout: 10000 }).should('be.visible');
            getIframeBody().find('.page-title').should('have.text', 'Register')

        })
    })
    /* cy.waitUntil(() => cy.get('.page-title').then(($el) => {
        expect($el).to.contain('Register')
    })) */





}



module.exports = {

    getSearch,
    clickSearchButton,
    search,
    navigateToAdvanceSearchInValidProductName,
    sortBy,
    ResultsForPage,
    GridViewLayout,
    clickByPImage,
    clickByPName,
    navigateToNewpage,
    fillRegForm
}
