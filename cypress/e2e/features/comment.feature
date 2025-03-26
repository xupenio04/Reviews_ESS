Feature: Comentar em um post
    As a usuário comum
    I want to comentar em um post já existente
    So that eu posso colocar minhas impressões sobre as reviews feitas por outros usuários

Scenario: Comentar em um post
    Given que o usuário com email "polita@email.com" e senha "12345678" está logado no sistema
    And existe uma review na página inicial
    When ele navega para "review_detail"
    And seleciona para comentar
    And insere o comentário "discordo mano" no campo de comentários
    And confirma o envio
    Then a mensagem "Comentário enviado com sucesso" deve aparecer na página

Scenario: Comentar inválido em um post 
    Given que o usuário com email "polita@email.com" e senha "12345678" está logado no sistema
    And existe uma review na página inicial
    When ele navega para "review_detail"
    And seleciona para comentar
    And confirma o envio
    Then a mensagem "Erro no envio!" deve aparecer na página
