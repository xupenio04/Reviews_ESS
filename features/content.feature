Feature: Cadastro de Conteúdo
    As a usuário administrador
    I want to adicionar novos filmes e séries ao catálogo
    So that os demais usuários possam fazer reviews ligados a esses filmes ou séries

Scenario: Cadastrar novo filme
    Given que o usuário "Breno" está autenticado no sistema
    And "Breno" possui acesso a conta de administrador
    And o filme "Whiplash" não está disponível no sistema
    When é enviado novo conteúdo com uma requisição POST com JSON nome "Whiplash", gênero "Animação", classificação indicativa "Livre", capa "https://m.media-amazon.com/images/I/914trm0WbIL._AC_UF894,1000_QL80_.jpg", título "whiplash" para a route "http://localhost:5001/movies/add"
    Then o status da resposta deve ser "201"
    And o JSON da resposta deve conter "Filme foi cadastrado com sucesso"

Scenario: Cadastrar filme já existente
    Given que o usuário "Breno" está autenticado no sistema
    And "Breno" possui acesso a conta de administrador
    And o filme "Vingadores: Ultimato" já está disponível no sistema
    When é enviado novo conteúdo com uma requisição POST com JSON nome "Vingadores: Ultimato", gênero "Ação", classificação indicativa "+12", capa "exemplo/vingadores.png", título "vingadores" para a route "http://localhost:5001/movies/add"
    Then o status da resposta deve ser "400"
    And o JSON da resposta deve conter "Esse filme já existe!"

Scenario: Cadastrar filme com informações insuficientes
    Given que o usuário "Breno" está autenticado no sistema
    And "Breno" possui acesso a conta de administrador
    When é enviado novo conteúdo com uma requisição POST com JSON nome "About Time", gênero "", classificação indicativa "+16", capa "", título "aboutTime" para a route "http://localhost:5001/movies/add"
    Then o status da resposta deve ser "400"
    And o JSON da resposta deve conter "Todos os campos devem ser preenchidos"

Scenario: Procurar um filme pelo nome
    Given o filme "Pistoleiro" já está disponível no sistema com gênero "Cowboy", classificação indicativa "Livre", capa "https://upload.wikimedia.org/wikipedia/pt/d/d8/Pistoleiro_1975_CN_1087.jpg", título "pistol"
    When é enviada uma busca com uma requisição POST pelo filme de nome "Pistoleiro" para a route "http://localhost:5001/movies/get"
    Then o status da resposta deve ser "201"
    And o JSON da resposta deve conter "Filme foi encontrado"
    And o filme retornado deve ter nome "Pistoleiro", gênero "Cowboy", classificação indicativa "Livre", capa "https://upload.wikimedia.org/wikipedia/pt/d/d8/Pistoleiro_1975_CN_1087.jpg", título "pistol"

Scenario: Procurar um filme inexistente
    Given o filme "Anora" não está disponível no sistema
    When é enviada uma busca com uma requisição POST pelo filme de nome "Anora" para a route "http://localhost:5001/movies/get"
    Then o status da resposta deve ser "400"
    And o JSON da resposta deve conter "Filme não foi encontrado"

Scenario: Deletar um filme existente
    Given que o usuário "Polita" está autenticado no sistema
    And o filme "Barbie" já está disponível no sistema com gênero "Animação", classificação indicativa "Livre", capa "exemplo/barbie.png", título "barbie"
    When uma requisição DELETE é enviada para o filme de nome "Barbie" para a route "http://localhost:5001/movies/delete"
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter "Filme Barbie foi deletado" 

Scenario: Deletar um filme que não existe
    Given que o usuário "Polita" está autenticado no sistema
    And o filme "Crepúsculo" não está disponível no sistema
    When uma requisição DELETE é enviada para o filme de nome "Crepúsculo" para a route "http://localhost:5001/movies/delete"
    Then o status da resposta deve ser "400"
    And o JSON da resposta deve conter "Filme não foi encontrado"


Scenario: Atualizar valores de um filme existente
    Given que o usuário "Polita" está autenticado no sistema
    And o filme "A Lista de Schindler" já está disponível no sistema com gênero "Drama", classificação indicativa "+14", capa "exemplo/schindler.png", título "schindler"
    When uma requisição de modificação POST é enviada para o filme de nome "A Lista de Schindler", gênero "Drama", classificação indicativa "+14", capa "https://br.web.img2.acsta.net/pictures/19/04/10/19/44/2904073.jpg", título "CapaDeSchindler" para a route "http://localhost:5001/movies/update"
    Then o status da resposta deve ser "201"
    And o JSON da resposta deve conter "Filme A Lista de Schindler foi atualizado" 
    And o filme retornado deve ter nome "A Lista de Schindler", gênero "Drama", classificação indicativa "+14", capa "https://br.web.img2.acsta.net/pictures/19/04/10/19/44/2904073.jpg", título "CapaDeSchindler"

Scenario: Atualizar valores de um filme que não existe
    Given que o usuário "Polita" está autenticado no sistema
    And o filme "Nosferatu" não está disponível no sistema
    When uma requisição de modificação POST é enviada para o filme de nome "Nosferatu", gênero "Terror", classificação indicativa "+18", capa "exemplo/nosferatu.png", título "Nosferatu" para a route "http://localhost:5001/movies/update"
    Then o status da resposta deve ser "400"
    And o JSON da resposta deve conter "Filme não foi encontrado"
