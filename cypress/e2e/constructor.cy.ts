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

    cy.fixture('user.json').then((user) => {
      cy.intercept('GET', '**/auth/user', {
        statusCode: 200,
        body: user
      }).as('getUser');
    });

    cy.fixture('order.json').then((order) => {
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: order
      }).as('createOrder');
    });

    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'test-access-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('adds bun and filling to constructor', () => {
    cy.get('[data-cy="ingredient-card-bun-bun-1"]').within(() => {
      cy.contains('Добавить').click();
    });

    cy.get('[data-cy="ingredient-card-main-main-1"]').within(() => {
      cy.contains('Добавить').click();
    });

    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');

    cy.get('[data-cy="constructor-filling"]').within(() => {
      cy.contains('Биокотлета').should('exist');
    });
  });

  it('opens ingredient modal and shows clicked ingredient data', () => {
    cy.get('[data-cy="ingredient-link-sauce-1"]').click();

    cy.get('[data-cy="modal"]')
      .should('exist')
      .within(() => {
        cy.contains('Детали ингредиента').should('exist');
        cy.contains('Соус Spicy-X').should('exist');
      });
  });

  it('closes ingredient modal by close button', () => {
    cy.get('[data-cy="ingredient-link-sauce-1"]').click();

    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal-close"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('closes ingredient modal by overlay', () => {
    cy.get('[data-cy="ingredient-link-sauce-1"]').click();

    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('creates order and clears constructor', () => {
    cy.get('[data-cy="ingredient-card-bun-bun-1"]').within(() => {
      cy.contains('Добавить').click();
    });

    cy.get('[data-cy="ingredient-card-main-main-1"]').within(() => {
      cy.contains('Добавить').click();
    });

    cy.get('[data-cy="ingredient-card-sauce-sauce-1"]').within(() => {
      cy.contains('Добавить').click();
    });

    cy.get('[data-cy="order-button"]').click();
    cy.wait('@createOrder');

    cy.get('[data-cy="modal"]').within(() => {
      cy.contains('12345').should('exist');
    });

    cy.get('[data-cy="modal-close"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.contains('Выберите булки').should('exist');
    cy.get('[data-cy="constructor-filling"]').within(() => {
      cy.contains('Выберите начинку').should('exist');
    });

    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });
});
