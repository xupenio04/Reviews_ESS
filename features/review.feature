Feature: Criar Reviews
    As a usuário comum
    I want to criar publicações sobre reviews de filme 
    So that eu posso divulgar minha avaliação sobre o filme

Scenario: Criar uma review válido
    Given que o usuário "ana@email.com" com senha "123456" está autenticado no sistema
    When uma requisição POST com um JSON com título "Title", corpo "Adorei o filme", classificação 5 e conteúdo "67e327fd1d1cfdd8bf403e6a" para a rota "http://localhost:5001/reviews/add"
    Then o JSON da resposta contém "Review criada com sucesso"
    And o status da resposta é "201"

Scenario: Criar uma review não estando logado
    Given que o usuário "ana@email.com" com senha "123456" não está autenticado no sistema
    When uma requisição POST com um JSON com título "Melhor Filme do Mundo", corpo "Adorei o filme", classificação 5 e conteúdo "67e327fd1d1cfdd8bf403e6a" para a rota "http://localhost:5001/reviews/add"
    Then o JSON da resposta contém "Usuário não autenticado" 
    And o status da resposta é "401"

Scenario: Criar uma review sem título
    Given que o usuário "ana@email.com" com senha "123456" está autenticado no sistema
    When uma requisição POST com um JSON com corpo "Adorei o filme", classificação 5 e conteúdo "67e327fd1d1cfdd8bf403e6a" para a rota "http://localhost:5001/reviews/add"
    Then o JSON da resposta contém "Preencha todos os campos"
    And o status da resposta é "400"

Scenario: Deletar uma review
    Given que o usuário "ana@email.com" com senha "123456" está autenticado no sistema 
    And o usuário "ana@email.com" é proprietário da review com título "Título da Review", corpo "Conteúdo da Review", classificação 5 e conteúdo "67e327fd1d1cfdd8bf403e6a"
    When uma requisição DELETE com um JSON com a review para a rota "http://localhost:5001/reviews/delete"
    Then o JSON da resposta contém "Review excluída com sucesso"
    And o status da resposta é "200"

Scenario: Editar uma review
    Given que o usuário "ana@email.com" com senha "123456" está autenticado no sistema 
    And o usuário "ana@email.com" é proprietário da review com título "Título da Review", corpo "Conteúdo da Review", classificação 5 e conteúdo "67e327fd1d1cfdd8bf403e6a"
    When uma requisição PUT com um JSON com o corpo "Mudei minha review" para a rota "http://localhost:5001/reviews/edit"
    Then o JSON da resposta contém "Review editada com sucesso"
    And o status da resposta é "200"

Scenario: Curtir uma review
    Given que o usuário "ana@email.com" com senha "123456" está autenticado no sistema 
    And existe a review do usuário "dos3@cin.ufpe.br" com senha "12345678" com título "Título da Review", corpo "Conteúdo da Review", classificação 5 e conteúdo "67e327fd1d1cfdd8bf403e6a"
    When uma requisição PUT com um JSON com a review para a rota "http://localhost:5001/reviews/like"
    Then o JSON da resposta contém "Review curtida com sucesso"
    And o status da resposta é "200"

Scenario: Filtrar a review por classificação
    Given que o usuário "ana@email.com" com senha "123456" está autenticado no sistema
    And o usuário "ana@email.com" é proprietário da review com título "Título da Review 5", corpo "Conteúdo da Review 5", classificação 5 e conteúdo "67ad7e98d4b8624b167ce4a1"
    And o usuário "ana@email.com" é proprietário da review com título "New Review", corpo "Mais que perfeito", classificação 8 e conteúdo "67ad7e98d4b8624b167ce4a1"
    When uma requisição POST com classificação 8, gênero "", título "" é enviada pela rota "http://localhost:5001/reviews/filter"
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter "Reviews Encontradas"
    And a review retornada deve ter título "New Review", corpo "Mais que perfeito", classificação 8 e conteúdo "67ad7e98d4b8624b167ce4a1"

Scenario: Filtrar a review por classificação inexistente
    Given que o usuário "ana@email.com" com senha "123456" está autenticado no sistema
    And o usuário "ana@email.com" é proprietário da review com título "Título da Review 3", corpo "Conteúdo da Review 3", classificação 3 e conteúdo "67ad7e98d4b8624b167ce4a1"
    And o usuário "ana@email.com" é proprietário da review com título "Título da Review 5", corpo "Conteúdo da Review 5", classificação 5 e conteúdo "67ad7e98d4b8624b167ce4a1"
    When uma requisição POST com classificação 9, gênero "", título "" é enviada pela rota "http://localhost:5001/reviews/filter"
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter "Nenhuma review corresponde aos filtros"

Scenario: Filtrar a review por gênero
    Given que o usuário "ana@email.com" com senha "123456" está autenticado no sistema
    And o usuário "ana@email.com" é proprietário da review com título "Lugia é o melhor", corpo "O melhor filme de pokemon", classificação 5 e conteúdo "67dad4119429a2af3f58ddc9"
    And o usuário "ana@email.com" é proprietário da review com título "New Review", corpo "Mais que perfeito", classificação 8 e conteúdo "67ad7e98d4b8624b167ce4a1"
    When uma requisição POST sem classificação, mas com gênero "Animação", título "" é enviada pela rota "http://localhost:5001/reviews/filter"
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter "Reviews Encontradas"
    And a review retornada deve ter título "Lugia é o melhor", corpo "O melhor filme de pokemon", classificação 5 e conteúdo "67dad4119429a2af3f58ddc9"

Scenario: Filtrar a review por título do filme
    Given que o usuário "ana@email.com" com senha "123456" está autenticado no sistema
    And o usuário "ana@email.com" é proprietário da review com título "Lugia é o melhor", corpo "O melhor filme de pokemon de todos os tempos", classificação 5 e conteúdo "67dad4119429a2af3f58ddc9"
    And o usuário "ana@email.com" é proprietário da review com título "New Review", corpo "Mais que perfeito", classificação 8 e conteúdo "67ad7e98d4b8624b167ce4a1"
    When uma requisição POST sem classificação, mas com gênero "", título "Pokémon: The Movie 2000" é enviada pela rota "http://localhost:5001/reviews/filter"
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter "Reviews Encontradas"
    And a review retornada deve ter título "Lugia é o melhor", corpo "O melhor filme de pokemon de todos os tempos", classificação 5 e conteúdo "67dad4119429a2af3f58ddc9"
