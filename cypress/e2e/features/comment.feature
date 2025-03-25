Feature: Comentar em um post
    As a usuário comum
    I want to comentar em um post já existente
    So that eu posso colocar minhas impressões sobre as reviews feitas por outros usuários

Scenario: Comentar em um post
    Given que o usuário com email "polita@email.com" e senha "12345678" está logado no sistema
    Given que o usuário "polita@email.com" está na página da review "67e0b6c9e6c6458ca2ef7d83"
    When seleciona para comentar
    And insere o comentário "discordo mano" no campo de comentários
    And confirma o envio
    Then a mensagem "Comentário enviado com sucesso" deve aparecer na página


Scenario: Comentar inválido em um post 
    Given que o usuário com email "polita@email.com" e senha "12345678" está logado no sistema
    Given que o usuário "polita@email.com" está na página da review "67e0b6c9e6c6458ca2ef7d83"
    When seleciona para comentar
    And confirma o envio
    Then a mensagem "Comentário enviado com sucesso" deve aparecer na página
