Feature: notas
    As um usuário
    I want to adicionar, editar e remover notas
    So that eu possa organizar minhas ideias e informações pessoais

  Scenario: Adicionar uma nota
    Given as seguintes notas do usuario "ajs6@gmail.com" existem:
      | title                  | note                           |
      | Um Sonho de Liberdade  | muito emocionantes             |
      | O Poderoso Chefão      | uma obra de primeira qualidade |
      | O Cavaleiro das Trevas | um ótimo filme                 |
    When adiciono uma nova nota para o title "A Origem", com o seguinte texto "muito complexo" do usuario "ajs6@gmail.com"
    Then as seguintes notas devem existir do usuario "ajs6@gmail.com":
      | title                  | note                           |
      | Um Sonho de Liberdade  | muito emocionantes             |
      | O Poderoso Chefão      | uma obra de primeira qualidade |
      | O Cavaleiro das Trevas | um ótimo filme                 |
      | A Origem               | muito complexo                 |

  Scenario: Editar uma notas existente:
    Given as seguintes notas do usuario "ajs6@gmail.com" existem:
      | title                  | note                           |
      | Um Sonho de Liberdade  | muito emocionantes             |
      | O Poderoso Chefão      | uma obra de primeira qualidade |
      | O Cavaleiro das Trevas | um ótimo filme                 |
      | A Origem               | muito complexo                 |
    When edito a nota do title "O Cavaleiro das Trevas" para "Meu favorito" do usuario "ajs6@gmail.com"
    Then as seguintes notas devem existir do usuario "ajs6@gmail.com":
      | title                  | note                           |
      | Um Sonho de Liberdade  | muito emocionantes             |
      | O Poderoso Chefão      | uma obra de primeira qualidade |
      | O Cavaleiro das Trevas | Meu favorito                   |
      | A Origem               | muito complexo                 |

  Scenario: Remover uma nota existente:
    Given as seguintes notas do usuario "ajs6@gmail.com" existem:
      | title                  | note                           |
      | Um Sonho de Liberdade  | muito emocionantes             |
      | O Poderoso Chefão      | uma obra de primeira qualidade |
      | O Cavaleiro das Trevas | Meu favorito                   |
      | A Origem               | muito complexo                 |
    When remover a nota do title "A Origem" do usuario "ajs6@gmail.com"
    Then as seguintes notas devem existir do usuario "ajs6@gmail.com":
      | title                  | note                           |
      | Um Sonho de Liberdade  | muito emocionantes             |
      | O Poderoso Chefão      | uma obra de primeira qualidade |
      | O Cavaleiro das Trevas | Meu favorito                   |
