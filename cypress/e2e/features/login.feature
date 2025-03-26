Feature: Realizar Login

Scenario: Tentativa de login com o email incorreto
    Given que o indivíduo está na página de cadastro
    When o indivíduo clica no botão "login-button"
    And o indivíduo preenche o campo "e-mail" com "iam@cin.ufpe.br"
    And o indivíduo preenche o campo "password" com "12345678"
    And o indivíduo clica no botão "ent"
    Then a borda do input "e-mail" fica vermelha, aparece um ícone de erro no input "email" e aparece a seguinte mensagem na tela: "Usuário não encontrado!"

Scenario: Tentativa de login com a senha incorreta
    Given que o indivíduo está na página de cadastro
    When o indivíduo clica no botão "login-button"
    And o indivíduo preenche o campo "e-mail" com "iams@cin.ufpe.br"
    And o indivíduo preenche o campo "password" com "ikrumelo"
    And o indivíduo clica no botão "ent"
    Then a borda do input "password" fica vermelha, aparece um ícone de erro no input "password" e aparece a seguinte mensagem na tela: "Senha incorreta!"

Scenario: Login realizado com sucesso
    Given que o indivíduo está na página de cadastro
    When o indivíduo clica no botão "login-button"
    And o indivíduo preenche o campo "e-mail" com "iams@cin.ufpe.br"
    And o indivíduo preenche o campo "password" com "12345678"
    And o indivíduo clica no botão "ent"
    Then aparece a seguinte mensagem na cor verde na tela: "Bem-vindo, Icaro Melo!"
    And o usuário é redirecionado para a tela inicial
    