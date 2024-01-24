import React from 'react'
import AppStateProvider from './state-provider'

describe('<AppStateProvider />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AppStateProvider />)
  })
})