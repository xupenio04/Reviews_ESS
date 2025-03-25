import { BeforeAll, AfterAll,Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const BASE_URL = 'http://opinai.ddns.net';

// Variável para armazenar as notas atuais
let currentNotes = [];
const notes = [
  {
    title: " Um Sonho de Liberdade ",
    note: "muito emocionantes"
  },
  {
    title: "O Poderoso Chefão",
    note: "uma obra de primeira qualidade"
  },
  {
    title: "O Cavaleiro das Trevas",
    note: "um ótimo filme"
  }
]
BeforeAll(() => {
  cy.visit(`${BASE_URL}/notes`);
  notes.forEach((note) => {
    cy.get('input[placeholder="Digite o título"]').type(note.title);
    cy.get('input[placeholder="Digite a nota"]').type(note.note);
    cy.get('button[type="submit"]').click();

    cy.contains(note.title).should('exist');
    cy.contains(note.note).should('exist');
  });
});

AfterAll(() => {
  cy.visit(`${BASE_URL}/notes`);
  notes.forEach((note) => {
    cy.contains('.font-medium', note.title)
    .closest('.space-y-2') 
    .find('#dell') 
    .click();
  });
});

Given("as seguintes notas do usuario {string} existem:", (userEmail, dataTable) => {
  cy.visit(`${BASE_URL}/notes`);

  currentNotes = dataTable.hashes();
  currentNotes.forEach((note) => {
    cy.contains(note.title).should('exist');
    cy.contains(note.note).should('exist');
  });
});

When(
  "adiciono uma nova nota para o title {string}, com o seguinte texto {string} do usuario {string}",
  (title, noteText, userEmail) => {
    cy.get('input[placeholder="Digite o título"]').type(title);
    cy.get('input[placeholder="Digite a nota"]').type(noteText);
    cy.get('button[type="submit"]').click();

    currentNotes.push({ title, note: noteText });
  }
);

When(
  "edito a nota do title {string} para {string} do usuario {string}",
  (oldTitle, newNoteText, userEmail) => {

    cy.contains('.font-medium', oldTitle)
      .closest('.space-y-2') 
      .find('#edit') 
      .click();
 
    cy.get('input#newNota')
      .clear()
      .type(newNoteText);

    cy.get("#save").click();
  }
);

When("remover a nota do title {string} do usuario {string}", (titleToRemove, userEmail) => {
  cy.contains('.font-medium', titleToRemove)
    .closest('.space-y-2') 
    .find('#dell') 
    .click();
});

Then("as seguintes notas devem existir do usuario {string}:", (userEmail, dataTable) => {
  const expectedNotes = dataTable.hashes();

  expectedNotes.forEach((expectedNote) => {
    cy.contains(expectedNote.title).should("exist");
    cy.contains(expectedNote.note).should("exist");
  });
});