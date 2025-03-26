Feature: Friends

Scenario: Acessando o perfil do usuário com sucesso
    Given que o usuário com email "polita@email.com" e senha "12345678" está logado no sistema
    Given que o usuário "polita@email.com" está na página "page_search"
    When  seleciona a barra de pesquisa
    And   insere o nome "Luan_Thiers" na barra de pesquisa
    And   pressiona a tecla enter
    And   seleciona o perfil do usuário "Luan_Thiers"
    Then  o usuário deve ser redirecionado para o perfil do usuário "Luan_Thiers" na página "page_userProfile"

Scenario: Usuário não encontrado
    Given que o usuário com email "polita@email.com" e senha "12345678" está logado no sistema
    Given que o usuário "polita@email.com" está na página "page_search"
    When  seleciona a barra de pesquisa
    And   insere o nome "Pedro Victor" na barra de pesquisa
    And   pressiona a tecla enter
    Then a mensagem "Usuário não encontrado" deve aparecer na página

Scenario: Seguindo um usuário
    Given que o usuário com email "polita@email.com" e senha "12345678" está logado no sistema
    Given que o usuário acessou o perfil do usuário "Luan_Thiers" a partir da página de pesquisa e está na página "page_userProfile"
    When  seleciona a opção seguir
    Then  a mensagem "Agora você está seguindo este usuário!" deve aparecer na página

Scenario: Visualizando a lista de seguidores 
    Given que o usuário com email "polita@email.com" e senha "12345678" está logado no sistema
    Given que o usuário acessou o perfil do usuário "Breno" a partir da página de pesquisa e está na página "page_userProfile"
    When  seleciona a opção seguidores
    Then  uma lista com todos os seguidores do usuário "Breno" deve aparecer na tela

Scenario: Usuário quer deletar a própria conta
    Given que o usuário com email "deivid@email.com" e senha "12345678" está logado no sistema
    Given que o usuário "Deivid" acessou o próprio perfil a partir da página de pesquisa e está na página "page_userProfile"
    When  seleciona a opção excluir conta
    And   confirma a exclusão da conta
    Then  a mensagem "Conta excluída com sucesso!" deve aparecer na página
    Then  o usuário deve ser redirecionado para a página "cadastro"
