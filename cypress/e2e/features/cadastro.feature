Feature: Realizar Cadastro

Scenario: Tentativa de cadastrar um username já cadastrado
    Given que o indivíduo está na página de cadastro e que o username "xupenio" já está cadastrado no banco de dados
    When o indivíduo preenche o campo "nome" com "xupenio"
    And o indivíduo preenche o campo "e-mail" com "xupenio@email.com"
    And o indivíduo preenche o campo "password" com "12345678"
    And o indivíduo preenche o campo "confirm-password" com "12345678"
    And o indivíduo clica no botão "ent"
    Then a borda do input "nome" fica vermelha, aparece um ícone de erro no input "name" e aparece a seguinte mensagem na tela: "Username já cadastrado!"

Scenario: Tentativa de cadastrar um email já cadastrado
    Given que o indivíduo está na página de cadastro e que o email "iams@cin.ufpe.br" já está cadastrado no banco de dados
    When o indivíduo preenche o campo "nome" com "Danerd"
    And o indivíduo preenche o campo "e-mail" com "iams@cin.ufpe.br"
    And o indivíduo preenche o campo "password" com "12345678"
    And o indivíduo preenche o campo "confirm-password" com "12345678"
    And o indivíduo clica no botão "ent"
    Then a borda do input "e-mail" fica vermelha, aparece um ícone de erro no input "email" e aparece a seguinte mensagem na tela: "Email já cadastrado!"

Scenario: Tentativa de cadastrar uma senha com menos de 8 caracteres
    Given que o indivíduo está na página de cadastro
    When o indivíduo preenche o campo "nome" com "Danerd"
    And o indivíduo preenche o campo "e-mail" com "danerd@cin.ufpe.br"
    And o indivíduo preenche o campo "password" com "1234567"
    And o indivíduo preenche o campo "confirm-password" com "1234567"
    And o indivíduo clica no botão "ent"
    Then a borda do input "password" fica vermelha, aparece um ícone de erro no input "password" e aparece a seguinte mensagem na tela: "A senha deve ter pelo menos 8 caracteres!"

Scenario: A confirmação de senha não confere
    Given que o indivíduo está na página de cadastro
    When o indivíduo preenche o campo "nome" com "Danerd"
    And o indivíduo preenche o campo "e-mail" com "danerd@cin.ufpe.br"
    And o indivíduo preenche o campo "password" com "12345678"
    And o indivíduo preenche o campo "confirm-password" com "1"
    Then a borda do input "confirm-password" fica vermelha, aparece um ícone de erro no input "confirm" e aparece a seguinte mensagem na tela: "A confirmação de senha não confere!"

Scenario: Cadastro realizado com sucesso
    Given que o indivíduo está na página de cadastro
    When o indivíduo preenche o campo "nome" com "Danerd"
    And o indivíduo preenche o campo "e-mail" com "danerd@cin.ufpe.br"
    And o indivíduo preenche o campo "password" com "12345678"
    And o indivíduo preenche o campo "confirm-password" com "12345678"
    And o indivíduo clica no botão "ent"
    Then aparece a seguinte mensagem na cor verde na tela: "Usuário criado com sucesso!"
    And o usuário é redirecionado para a tela inicial
    