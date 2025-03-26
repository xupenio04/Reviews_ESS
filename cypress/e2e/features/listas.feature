Feature: Listas de Assistidos e Abandonados

Scenario: Filtrar somente uma das listas
    Given que o usuário com email "polita@email" e senha "12345678" está conectado no sistema
    Given que o user com username "polita" está logado no sistema
    When o usuário clica no botão Abandonados para selecionar somente os filmes abandonados
    Then o usuário deve ver uma lista completa dos filmes abandonados do user "polita"
    
Scenario: Adicionar um filme na listas de assistidos 
    Given que o user com email "polita@email" e senha "12345678" está logado no sistema
    Given que o usuário cadastrado com username "polita" está logado no sistema
    When o usuário clica no botão Adicionar
    When preenche com os espaços com "Inception" e "muito bom"
    When seleciona a opção Assistidos
    When clica em concluir
    Then um filme é adicionado na lista de assistidos do user "polita"

Scenario: Adicionar um filme na listas de abandonados
    Given que o membro com email "polita@email" e senha "12345678" está logado no sistema
    Given que o user "polita" está logado no sistema
    When o usuário seleciona o botão Adicionar
    When preenche os espaços com "Interestelar" e "incrível"
    When seleciona a opção Abandonados
    When clica na opção concluir
    Then um filme é adicionado na lista de abandonados do user "polita"


Scenario: Remover um filme na listas de assistidos
    Given que o usuário de username "xupenio" está no sistema
    When o usuário clica no botão Remover
    And preenche com campos com "Inception"
    And seleciona a opção Assistidos
    And clica em concluir
    Then um filme é removido na lista de assistidos

Scenario: Adicionar um filme que já está na lista de abandonados
    Given que o usuário com username "xupenio" está logado no sistema
    When o usuário clica no botão Adicionar
    And preenche com campos com "Inception" e "muito bom"
    And seleciona a opção Abandonados
    And clica em concluir
    Then um aparece uma mensagem de erro afirmando que já está adicionado na lista

Scenario: Remover um filme que não está na lista de assistidos
    Given o indivíduo com username "xupenio" está logado no sistema
    When o usuário clica no botão Remover
    And preenche com campos com "Inception"
    And seleciona a opção Assistidos
    And clica em concluir
    Then um aparece uma mensagem de erro afirmando que já está adicionado na lista

