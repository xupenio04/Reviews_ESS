import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
//Feature: Realizar Cadastro
Given('que o indivíduo está na página de cadastro e que o email {string} já está cadastrado no banco de dados', (email) => {
    cy.visit("http://localhost:3000/pages/cadastro");
  
    cy.request({
      method: 'GET',
      url: `http://localhost:5001/users/find_email/${email}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
  
  Given('que o indivíduo está na página de cadastro', () => {
    cy.visit("http://localhost:3000/pages/cadastro");
  });
  
  When('o indivíduo preenche o campo {string} com {string}', (campo, input) => {
    cy.get(`#${campo}`).type(`${input}`);
  });
  
  When('o indivíduo clica no botão {string}', (botao) => {
    cy.get(`#${botao}`).click();
  });
  
  Then('a borda do input {string} fica vermelha, aparece um ícone de erro no input {string} e aparece a seguinte mensagem na tela: {string}', (input1, input2, message) => {
    cy.get(`#${input1}`)
    .should('have.css', 'border-color', 'rgb(253, 8, 8)');
    cy.get(`#${input2}-incorrect`).should('be.visible');
    cy.get('#message')
      .should('be.visible')
      .and('contain', message);
  });
  
  Then('aparece a seguinte mensagem na cor verde na tela: {string}', (message) => {
    cy.get(`#message`)
    .should('have.css', 'color', 'rgb(0, 128, 0)');
    cy.get('#message')
      .should('be.visible')
      .and('contain', message);
  });
  
  Then('o usuário é redirecionado para a tela inicial', () => {
    cy.url().should("include", "/pages/initial_page");
    cy.window().its('localStorage.userToken').should('exist');
  });
  