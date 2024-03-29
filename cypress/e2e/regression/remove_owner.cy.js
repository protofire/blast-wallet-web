import * as constants from '../../support/constants'
import * as main from '../../e2e/pages/main.page'
import * as owner from '../pages/owners.pages'

describe('Remove Owners tests', () => {
  beforeEach(() => {
    cy.visit(constants.setupUrl + constants.SEPOLIA_TEST_SAFE_3)
    main.waitForHistoryCallToComplete()
    cy.clearLocalStorage()
    main.acceptCookies()
    owner.waitForConnectionStatus()
    cy.contains(owner.safeAccountNonceStr, { timeout: 10000 })
  })

  it('Verify that "Remove" icon is visible', () => {
    owner.verifyRemoveBtnIsEnabled().should('have.length', 2)
  })

  it('Verify Tooltip displays correct message for Non-Owner', () => {
    cy.visit(constants.setupUrl + constants.SEPOLIA_TEST_SAFE_4)
    main.waitForHistoryCallToComplete()
    owner.waitForConnectionStatus()
    owner.verifyRemoveBtnIsDisabled()
  })

  it('Verify Tooltip displays correct message for disconnected user', () => {
    owner.clickOnWalletExpandMoreIcon()
    owner.clickOnDisconnectBtn()
    owner.verifyRemoveBtnIsDisabled()
  })

  it('Verify owner removal form can be opened', () => {
    owner.openRemoveOwnerWindow(1)
  })

  it('Verify threshold input displays the upper limit as the current safe number of owners minus one', () => {
    owner.openRemoveOwnerWindow(1)
    owner.verifyThresholdLimit(1, 1)
    owner.getThresholdOptions().should('have.length', 1)
  })
})
