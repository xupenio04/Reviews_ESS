import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que o usuário com email {string} e senha {string} está logado no sistema", (email, senha) => {
  cy.visit("http://localhost:3000/pages/cadastro");
  cy.get('[data-testid="login-button"]').click();
  cy.get('#content.move-to-left').should('be.visible');
  cy.get("#e-mail").type(`${email}`);
  cy.get("#password").type(`${senha}`);
  
  cy.get("#ent").click();
  
});
Given('que o usuário {string} está na página da review {string}', (email, reviewId) => {
  cy.visit(`http://localhost:3000/pages/review_detail/${reviewId}`);
  console.log(`http://localhost:3000/pages/review_detail/${reviewId}`);
  cy.get('[data-testid="comment-button"]').should('be.visible');
});

When("seleciona para comentar", () => {
  cy.get('[data-testid="comment-button"]').click();
  cy.get('[data-testid="comment-textarea"]').should('be.visible');
});
When("insere o comentário {string} no campo de comentários", (comentario) => {
  cy.get('[data-testid="comment-textarea"]').type(`${comentario}`); 
});

When("confirma o envio", () => {
  cy.get('[data-testid="confirm"]').click(); 
});
Then('a mensagem {string} deve aparecer na página', (message) => {
  
  cy.on('window:alert', (alertText) => {
    expect(alertText).to.equal(message);
  });
  
  
});

Given('que o indivíduo está na página de cadastro e que o username {string} já está cadastrado no banco de dados', (username) => {
  cy.visit("http://localhost:3000/pages/cadastro");

  cy.request({
    method: 'GET',
    url: `http://localhost:5001/users/find/${username}`,
    failOnStatusCode: false, // Não falhará se o usuário não for encontrado
  }).then((response) => {
    expect(response.status).to.eq(200); // Verifica se o usuário está cadastrado
  });
});



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

Given("que o usuário com email {string} e senha {string} está conectado no sistema", (email, senha) => {
    cy.visit("http://localhost:3000/pages/cadastro");
    cy.get('[data-testid="login-button"]').click();
    cy.get("#e-mail").type(`${email}`);
    cy.get("#password").type(`${senha}`);
    
    cy.get("#ent").click();
    
  });
  
  Given("que o user com username {string} está logado no sistema", (username) => {
    cy.visit("http://localhost:3000/pages/Filmes_Assistidos");
  
    cy.request({
      method: "GET",
      url: `http://localhost:5001/users/${username}/abandoned`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  
    cy.wait(1000); 
  });
  
  
  When('o usuário clica no botão Abandonados para selecionar somente os filmes abandonados', () => {
    cy.get('#abandonedButton').click();
  });
  
  Then("o usuário deve ver uma lista completa dos filmes abandonados do user {string}", (username) => {
    cy.visit("http://localhost:3000/pages/Filmes_Assistidos");
  
    cy.request({
      method: "GET",
      url: `http://localhost:5001/users/${username}/abandoned`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  
    cy.wait(1000); 
  });
  
  
  Given("que o user com email {string} e senha {string} está logado no sistema", (email, senha) => {
    cy.visit("http://localhost:3000/pages/cadastro");
    cy.get('[data-testid="login-button"]').click();
    cy.get("#e-mail").type(`${email}`);
    cy.get("#password").type(`${senha}`);
    
    cy.get("#ent").click();
    
  });
  
  Given("que o usuário cadastrado com username {string} está logado no sistema", (username) => {
    cy.visit("http://localhost:3000/pages/Filmes_Assistidos");
  
    cy.request({
      method: "GET",
      url: `http://localhost:5001/users/${username}/abandoned`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  
    cy.wait(1000); 
  });
  
  
  When('o usuário clica no botão Adicionar', () => {
    cy.get('#addButton').click();
  });
  
  When('preenche com campos com {string} e {string}', (title,useravaliation) => {
    cy.get(`#Title`).type(`${title}`);
    cy.get(`#Avaliation`).type(`${useravaliation}`);
  });
  
  When('seleciona a opção Assistidos', () => {
    cy.get('#watched').click();
  });
  
  When('clica em concluir', () => {
    cy.get('#finishButton').click();
  });
  
  Then("um filme é adicionado na lista de assistidos do user {string}", (username) => {
    // Visita a página onde os filmes assistidos são listados
    cy.visit("http://localhost:3000/pages/Filmes_Assistidos");
  
    // Faz uma requisição GET para verificar se o filme foi adicionado à lista de assistidos
    cy.request({
      method: "GET",
      url: `http://localhost:5001/users/${username}/watched`,
      failOnStatusCode: false, // Não falhará se a resposta for 404 ou algo similar
    }).then((response) => {
      // Verifica se a resposta tem status 200 (ok)
      expect(response.status).to.eq(200);
      
      // Verifica se o filme foi realmente adicionado à lista de assistidos
      // A primeira abordagem poderia ser verificar se o número de filmes aumentou, por exemplo
      expect(response.body.length).to.be.greaterThan(0); // Exemplo de asserção
    });
  
    // Espera para garantir que a interface tenha tempo de atualizar (ajuste o tempo conforme necessário)
    cy.wait(1000);
  });
  
  Given("que o membro com email {string} e senha {string} está logado no sistema", (email, senha) => {
    cy.visit("http://localhost:3000/pages/cadastro");
    cy.get('[data-testid="login-button"]').click();
    cy.get("#e-mail").type(`${email}`);
    cy.get("#password").type(`${senha}`);
    
    cy.get("#ent").click();
    
  });
  
  Given("que o user {string} está logado no sistema", (username) => {
    cy.visit("http://localhost:3000/pages/Filmes_Assistidos");
  
    cy.request({
      method: "GET",
      url: `http://localhost:5001/users/${username}/abandoned`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  
    cy.wait(1000); 
  });
  
  
  When('o usuário seleciona o botão Adicionar', () => {
    cy.get('#addButton').click();
  });
  
  When('preenche os espaços com {string} e {string}', (title,useravaliation) => {
    cy.get(`#Title`).type(`${title}`);
    cy.get(`#Avaliation`).type(`${useravaliation}`);
  });
  
  When('seleciona a opção Abandonados', () => {
    cy.get('#Abandoned').click();
  });
  
  When('clica na opção concluir', () => {
    cy.get('#finishButton').click();
  });
  
  Then("um filme é adicionado na lista de abandonados do user {string}", (username) => {
    // Visita a página onde os filmes assistidos são listados
    cy.visit("http://localhost:3000/pages/Filmes_Assistidos");
  
    // Faz uma requisição GET para verificar se o filme foi adicionado à lista de assistidos
    cy.request({
      method: "GET",
      url: `http://localhost:5001/users/${username}/watched`,
      failOnStatusCode: false, // Não falhará se a resposta for 404 ou algo similar
    }).then((response) => {
      // Verifica se a resposta tem status 200 (ok)
      expect(response.status).to.eq(200);
      
      // Verifica se o filme foi realmente adicionado à lista de assistidos
      // A primeira abordagem poderia ser verificar se o número de filmes aumentou, por exemplo
      expect(response.body.length).to.be.greaterThan(0); // Exemplo de asserção
    });
  
    // Espera para garantir que a interface tenha tempo de atualizar (ajuste o tempo conforme necessário)
    cy.wait(1000);
  });