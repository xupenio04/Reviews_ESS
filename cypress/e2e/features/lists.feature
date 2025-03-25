Feature: Listas de Assistidos e Abandonados

Scenario: Filtrar somente uma das listas
    Given que o usuário com email "xupe@123" e senha "12345678" está logado no sistema
    When o usuário clica no botão Assistidos para selecionar somente os filmes assistidos
    Then o usuário deve ver uma lista completa dos filmes assistidos
    
Scenario: Adicionar um filme na listas de assistidos 
    Given que o usuário com email "xupe@123" e senha "12345678" está logado no sistema
    When o usuário clica no botão Adicionar
    And preenche com campos com "Inception" e "muito bom"
    And seleciona a opção Assistidos
    And clica em concluir
    Then um filme é adicionado na lista de assistidos

Scenario: Adicionar um filme na listas de abandonados
    Given que o usuário com email "xupe@123" e senha "12345678" está logado no sistema
    When o usuário clica no botão Adicionar
    And preenche com campos com "Interestelar" e "incrível"
    And seleciona a opção Abandonados
    And clica em concluir
    Then um filme é adicionado na lista de abandonados


Scenario: Remover um filme na listas de assistidos
    Given que o usuário com email "xupe@123" e senha "12345678" está logado no sistema
    When o usuário clica no botão Remover
    And preenche com campos com "Inception"
    And seleciona a opção Assistidos
    And clica em concluir
    Then um filme é removido na lista de assistidos

Scenario: Adicionar um filme que já está na lista de abandonados
    Given que o usuário com email "xupe@123" e senha "12345678" está logado no sistema
    When o usuário clica no botão Adicionar
    And preenche com campos com "Inception" e "muito bom"
    And seleciona a opção Abandonados
    And clica em concluir
    Then um aparece uma mensagem de erro afirmando que já está adicionado na lista

Scenario: Remover um filme que não está na lista de assistidos
    Given que o usuário com email "xupe@123" e senha "12345678" está logado no sistema
    When o usuário clica no botão Remover
    And preenche com campos com "Inception"
    And seleciona a opção Assistidos
    And clica em concluir
    Then um aparece uma mensagem de erro afirmando que já está adicionado na lista

