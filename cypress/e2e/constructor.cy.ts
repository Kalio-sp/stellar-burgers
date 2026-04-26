/// <reference types="cypress" />

describe('constructor page', () => {
  beforeEach(() => {
    cy.fixture('ingredients.json').then((ingredients) => {
      cy.intercept('GET', '**/ingredients', {
        statusCode: 200,
        body: {
          success: true,
          data: ingredients
        }
      }).as('getIngredients');
    });

    cy.intercept('GET', '**/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@test.com',
          name: 'Андрей'
        }
      }
    }).as('getUser');

    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Space флюоресцентный бургер',
        order: {
          _id: 'order-1',
          status: 'done',
          name: 'Space флюоресцентный бургер',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          number: 12345
        }
      }
    }).as('createOrder');

    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'test-access-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('adds bun and filling to constructor', () => {
    cy.get('[data-cy="ingredient-card-bun-bun-1"]')
      .contains('Добавить')
      .click();
    cy.get('[data-cy="ingredient-card-main-main-1"]')
      .contains('Добавить')
      .click();

    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
    cy.get('[data-cy="constructor-filling"]').should(
      'contain.text',
      'Биокотлета'
    );
  });

  it('opens and closes ingredient modal', () => {
    cy.get('[data-cy="ingredient-link-sauce-1"]').click();

    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal-close"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('creates order', () => {
    cy.get('[data-cy="ingredient-card-bun-bun-1"]')
      .contains('Добавить')
      .click();
    cy.get('[data-cy="ingredient-card-main-main-1"]')
      .contains('Добавить')
      .click();
    cy.get('[data-cy="ingredient-card-sauce-sauce-1"]')
      .contains('Добавить')
      .click();

    cy.get('[data-cy="order-button"]').click();
    cy.wait('@createOrder');

    cy.contains('12345').should('exist');
    cy.get('[data-cy="modal-close"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
