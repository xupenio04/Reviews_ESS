const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const axios = require('axios'); 

const BASE_URL = process.env.TEST_URL || 'http://localhost:5001';


Given('que existe um usuário com username {string}', async function (username) {
    this.response = await request(BASE_URL).get(`/users/find/${username}`);
    this.user = this.response.body
});


When('o usuário pesquisa por {string} na barra de pesquisa', async function (searchUser) {
    this.response = await request(BASE_URL).get(`/users/find/${searchUser}`);
    this.searchResult = this.response.body;
});

Then('o sistema deve retornar o perfil do usuário {string}', function (searchUser) {
    assert.strictEqual(this.searchResult.name, searchUser, `Usuário encontrado não é ${searchUser}`);
});

Then('o sistema deve retornar o status {string}', function (expectedStatus){
    assert.strictEqual(this.response.status, parseInt(expectedStatus),`A busca falhou`);
})

When('o usuário executa a ação de {string} no perfil do usuário {string}', async function (action, targetUsername) {
    this.response = await request(BASE_URL).get(`/users/find/${targetUsername}`);
    this.targetUser = this.response.body;

    if(action == "Visualizar Seguindo"){
        this.followingList = this.targetUser.following;
    }

    else if(action == "Visualizar Seguidores"){
        this.followerList = this.targetUser.followers;
    }

    else if(action == "Seguir"){
        const requestBody = { originName: this.user.name,
                              destinationName: targetUsername} 

         this.response = await request(BASE_URL)
            .post(`/users/follow/${this.targetUser}`)
            .send(requestBody) 
            .set('movie-Type', 'application/json');
    }
    
  });

  Then('o sistema deve retornar a seguinte lista de {string}:', function (data, list) {
    const expectedList = list.rawTable.flat(); // Converte a tabela para um array de strings
    // Verifica se a lista retornada é igual à esperada
    if(data == "Usuários Seguidos")
        assert.deepStrictEqual(this.followingList, expectedList, `A lista de seguindo não corresponde ao esperado`);
    else if(data == "Seguidores")
        assert.deepStrictEqual(this.followerList, expectedList, `A lista de seguindo não corresponde ao esperado`);
  });

  Then('a lista de {string} do usuário {string} deve ser atualizada para:', async function (data, username, list) {
    const expectedList = list.rawTable.flat(); // Converte a tabela para um array de strings
    this.response = await request(BASE_URL).get(`/users/find/${username}`);
    this.targetUser = this.response.body

    if(data == "following")
        assert.deepStrictEqual(this.targetUser.following, expectedList, `A lista de seguindo não foi atualizada corretamente`)
    else if(data == "followers")
        assert.deepStrictEqual(this.targetUser.followers, expectedList, `A lista de seguidores não foi atualizada corretamente`)
  });

  When('o usuário realiza a operação de {string} sua conta com os seguintes campos:', function (username, list) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });
  
// Quando uma requisição PUT com um JSON e o campo é enviado para o perfil do usuário
When('uma requisição PUT com um JSON com o campo {string} com o valor {string} ocorre para o perfil do usuário {string}', async function (field, value, username) {
    requestBody = null;

    if(field == "email"){
        requestBody = { newName: "", 
                        newEmail: value, 
                        newPassword: ""}; // Cria um objeto JSON dinâmico com o campo e o valor fornecidos
    }
    
    if(field == "name"){
        requestBody = { newName: value, 
                        newEmail: "", 
                        newPassword: ""}; // Cria um objeto JSON dinâmico com o campo e o valor fornecidos
    }

    if(field == "password"){
        requestBody = { newName: "", 
                        newEmail: "", 
                        newPassword: value}; // Cria um objeto JSON dinâmico com o campo e o valor fornecidos
    }

    response = await request(BASE_URL)
        .put(`/users/${username}`) // URL com o nome do usuário que será atualizado
        .send(requestBody)
        .set('Accept', 'application/json'); // Definindo o tipo de resposta esperada
    // Verifica se a requisição foi bem-sucedida (status 200)
    assert.strictEqual(response.status, 200, `Erro na requisição: status ${response.status}`);
});

// Depois de atualizar, o campo do perfil deve ter o valor esperado
Then('o campo {string} do perfil do usuário {string} deve ter o valor {string}', async function (field, username, expectedValue) {
    // Busca o usuário atualizado
    const userResponse = await request(BASE_URL).get(`/users/find/${username}`);
    updatedUser = userResponse.body;
    // Verifica se o campo foi atualizado com o valor esperado
    assert.strictEqual(updatedUser[field], expectedValue, `O campo ${field} não foi atualizado corretamente`);
});

When('uma requisição DELETE ocorre para o perfil do usuário {string}', async function (username) {
    this.response = await request(BASE_URL)
        .delete(`/users/${username}`)
        .set('Accept', 'application/json');

    assert.strictEqual(this.response.status, 200, `Erro na requisição: status ${this.response.status}`);
});

Then('o usuário {string} não existe mais no sistema', async function (username) {
    const userResponse = await request(BASE_URL).get(`/users/find/${username}`);
    assert.strictEqual(userResponse.status, 404, `Usuário ainda existe no sistema, mas deveria ter sido deletado`);
});


const systemState = {
    user: {name: null, admin: null},
    page: null,
    searchResult: null
};

let response

Given('que o usuário {string} com senha {string} está autenticado no sistema', async function (email, password) {
    try {
        const loginResponse = await axios.post('http://localhost:5001/users/login', {
            email: email,
            password: password
        });
        token = loginResponse.data.token;
    } catch (error) {
        throw new Error('Falha na autenticação');
    }
});

Given('que o usuário {string} com senha {string} não está autenticado no sistema', async function (email, password) {
    token = "";
});
Given('o usuário {string} é proprietário da review com título {string}, corpo {string}, classificação {int} e conteúdo {string}', async function (email, titulo, corpo, classificacao, movie) {
    try {
        const reviewResponse = await axios.post('http://localhost:5001/reviews/add', {
            title: titulo,
            body: corpo,
            classification: classificacao,
            movie: movie
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (reviewResponse.data && reviewResponse.data.id) {
            reviewId = reviewResponse.data.id;
        } else {
            throw new Error('Review não foi criada corretamente');
        }
    } catch (error) {
        throw new Error('Falha ao criar a review: ' + (error.response ? error.response.data.message : error.message));
    }

});
Given('existe a review com título {string}, corpo {string}, classificação {int} e conteúdo {string}', async function (titulo, corpo, classificacao, movie) {
    try {
        const reviewResponse = await axios.post('http://localhost:5001/reviews/add', {
            title: titulo,
            body: corpo,
            classification: classificacao, 
            movie: movie
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (reviewResponse.data && reviewResponse.data.id) {
            reviewId = reviewResponse.data.id;
        } else {
            throw new Error('Review não foi criada corretamente');
        }
    } catch (error) {
        throw new Error('Falha ao criar a review: ' + (error.response ? error.response.data.message : error.message));
    }
});

Given('existe o comentário {string} do usuário {string} com senha {string}', async function (conteudo, email, senha) {
    try {
        const loginResponse = await axios.post('http://localhost:5001/users/login', {
            email: email,
            password: senha
        });

        const token = loginResponse.data.token;
        const commentResponse = await axios.post('http://localhost:5001/comment/add', {
            body: conteudo,
            review: reviewId // Certifique-se de que reviewId está definido
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (commentResponse.data && commentResponse.data.id) {
            commentId = commentResponse.data.id;
        } else {
            throw new Error('Comentário não foi criado corretamente');
        }
    } catch (error) {
        console.error("Erro ao criar/verificar comentário:", error.response?.data || error.message);
        throw new Error(`Erro ao criar/verificar comentário: ${error.message}`);
    }
});
Given('existe a review do usuário {string} com senha {string} com título {string}, corpo {string}, classificação {int} e conteúdo {string}', async function (email, password, title, body, classification, movie) {
    try {
        const loginResponse = await axios.post('http://localhost:5001/users/login', {
            email: email,
            password: password
        });

        const token = loginResponse.data.token;
        const reviewResponse = await axios.post('http://localhost:5001/reviews/add', {
            title: title,
            body: body,
            classification: classification, 
            movie: movie
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (reviewResponse.data && reviewResponse.data.id) {
            reviewId = reviewResponse.data.id;
        } else {
            throw new Error('Comentário não foi criado corretamente');
        }
    } catch (error) {
        console.error("Erro ao criar/verificar review:", error.response?.data || error.message);
        throw new Error(`Erro ao criar/verificar review: ${error.message}`);
    }
});
When('uma requisição POST com um JSON com título {string}, corpo {string}, classificação {int} e conteúdo {string} para a rota {string}', async function (titulo, corpo, classificacao, movie, rota) {
    try {
        response = await axios.post(rota, {
            title: titulo,
            body: corpo,
            classification: classificacao, 
            movie: movie
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        response = error.response;
    }
});
When('uma requisição POST com um JSON com corpo {string} e classificação {int} para a rota {string}', async function (corpo, classificacao, rota) {
    try {
        response = await axios.post(rota, {
            body: corpo,
            classification: classificacao
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        response = error.response;
    }
});
When('uma requisição POST com um JSON com conteúdo {string} para a rota {string}', async function (body, rota) {
    try {
        response = await axios.post(rota, {
            body: body, 
            review: reviewId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        response = error.response;
    }
});
When('uma requisição DELETE com um JSON com a review para a rota {string}', async function (rota) {
    try {
        response = await axios.delete(rota, {
            headers: { Authorization: `Bearer ${token}` },
            data: { id: reviewId } 
        });
    } catch (error) {
        response = error.response;
    }
});
When('uma requisição DELETE com um JSON com o comentário para a rota {string}', async function (rota) {
    try {
        response = await axios.delete(rota, {
            headers: { Authorization: `Bearer ${token}` },
            data: { id: commentId } 
        });
    } catch (error) {
        response = error.response;
    }
});
When('uma requisição PUT com um JSON com o corpo {string} para a rota {string}', async function (updates, rota) {

    try {
        response = await axios.put(rota, {
            id: reviewId, 
            updates: updates
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        response = error.response;
    }
});
When('uma requisição PUT com um JSON com a review para a rota {string}', async function (rota) {
    try {
        response = await axios.put(rota, {
            reviewId: reviewId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        response = error.response;
        console.error("Erro na requisição PUT:", error.message);
    }
});

Then('o JSON da resposta contém {string}', function (expectedMessage) {
    assert.strictEqual(response.data.message, expectedMessage);
});
Then('o status da resposta é {string}', function (expectedStatus) {
    assert.strictEqual(response.status.toString(), expectedStatus);
});
//Feature: Realizar cadastro

Given('o usuário quer realizar um cadastro no sistema', function () {
    
});

When('uma requisição POST com um JSON com name {string}, email {string}, password {string} de corpo for enviada para route {string}', async function (name, email, password, route) {
    try {
        response = await axios.post(route, {
            name,
            email,
            password
        });
    } catch (error) {
        response = error.response;
    }
});

Given('que o usuário {string} está autenticado no sistema', function (username) {
    systemState.user.name = username;
    assert.strictEqual(systemState.user.name, username, "Usuário incorreto");
  });

Given('{string} possui acesso a conta de administrador', function (username) {
    assert.strictEqual(systemState.user.name, username, "Usuário incorreto");
    systemState.user.admin = true
    assert.strictEqual(systemState.user.admin, true, "Usuário sem acesso ao cadastro de filmes");
});

  Given('o filme {string} já está disponível no sistema', async function (movie) {
    try{
        response = await axios.post("http://localhost:5001/movies/add", {
            name: movie,
            genre: "default",
            rating: "default",
            cover: {
                imageURL: "default",
                title: "default"
            }
        });
    } catch(error){
        response = error.response
    }
  
    possibleStatus = ["201","400"]
    let statusResponse = response.status.toString()
    
    assert.ok(possibleStatus.includes(statusResponse), "Filme não foi cadastrado corretamente")
    });

    Given('o filme {string} já está disponível no sistema com gênero {string}, classificação indicativa {string}, capa {string}, título {string}', async function (name, genre, rating, coverURL, title) {
        const movie = {
            name: name,
            genre: genre,
            rating: rating,
            cover: {
                imageURL: coverURL,
                title: title
            }
        };
        try{
            response = await axios.post("http://localhost:5001/movies/add", movie);
        } catch(error){
            response = error.response;
        }
    
        if(response.status.toString() === "400"){
            try{
                response = await axios.put("http://localhost:5001/movies/update", movie);
            } catch(error){
                response = error.response;
            }
            let statusResponse = response.status.toString();
            assert.strictEqual(statusResponse,"201", "Filme não foi cadastrado corretamente");
        }
        else{
            let statusResponse = response.status.toString();
            assert.strictEqual(statusResponse,"201", "Filme não foi cadastrado corretamente");
        }
    });
    
    Given('o filme {string} não está disponível no sistema', async function (movie) {
        try{
            response = await axios.delete("http://localhost:5001/movies/delete", {
                data: { name: movie }
            });
        } catch(error){
            response = error.response
        }
        
        possibleStatus = ["200","400"]
        let statusResponse = response.status.toString()
        
        assert.ok(possibleStatus.includes(statusResponse), "Filme não foi cadastrado corretamente")
    });






  When('é enviado novo conteúdo com uma requisição POST com JSON nome {string}, gênero {string}, classificação indicativa {string}, capa {string}, título {string} para a route {string}', 
    async function (name, genre, rating, coverURL, title, route) {
    try{
        response = await axios.post(route, {
            name: name,
            genre: genre,
            rating: rating,
            cover:{
                imageURL: coverURL,
                title: title
            }
        });
    } catch (error){
        response = error.response
    }
  });

  When('é enviada uma busca com uma requisição POST pelo filme de nome {string} para a route {string}', async function (name, route) {
    try{

        response = await axios.post(route, {
            name: name
        });
    } catch (error){
        response = error.response;
    }
  });

  When('uma requisição DELETE é enviada para o filme de nome {string} para a route {string}', async function (name,route) {
    try{
        response = await axios.delete(route, {
            data: {name: name}
        });
    } catch (error){
        response = error.response;
    }
  });

When('uma requisição de modificação POST é enviada para o filme de nome {string}, gênero {string}, classificação indicativa {string}, capa {string}, título {string} para a route {string}', 
    async function (name, genre, rating, coverURL, title, route) {
        try{
            response = await axios.put(route, {
                name:name,
                genre: genre,
                rating: rating,
                cover:{
                    imageURL: coverURL,
                    title: title
                }
            });
        } catch (error){
            response = error.response;
        }
});






Then('o filme retornado deve ter nome {string}, gênero {string}, classificação indicativa {string}, capa {string}, título {string}', 
    async function (name, genre, rating, coverURL, title){
    const expectedMovie = {
        name: name,
        genre: genre,
        rating: rating,
        cover: {
            imageURL: coverURL,
            title: title
        }
    };

    const jsonResponse = (({name,genre,rating,cover}) => ({name,genre,rating,cover}))(response.data.movie);

    assert.deepEqual(expectedMovie, jsonResponse, "O filme retornado não confere com o registrado");
});

Then('o status da resposta deve ser {string}', function (expectedStatus) {
    assert.strictEqual(response.status.toString(), expectedStatus);
});

Then('o JSON da resposta deve conter {string}', function (expectedMessage) {
    assert.strictEqual(response.data.message, expectedMessage);
});

let list;

Given('que um usuário cadastrado com username {string} quer criar uma lista de assistidos',async function (username) {
    this.response = await request(BASE_URL).get(`/users/find/${username}`);
    this.user = this.response.body
});

When('uma requisição POST com JSON com type {string}, members {string} de corpo for enviada para a rota {string}', async function (type, members,route) {
    try {
        response = await axios.post(route, {
            type,
            members: JSON.parse(members)
        });
    } catch (error) {
        response = error.response;
    }
});

Then('o status da resposta da requisição deve ser {string}', function(expectedStatus){
    assert.strictEqual(response.status.toString(), expectedStatus);
});

Then('o JSON da resposta deve conter name {string}, type {string} e members {string}', async function(name,type,members){
    try {
        list = await axios.get(route, {
            name,
            type,
            members: JSON.parse(members)
        });
    } catch (error) {
        response = error.response;
    }
});

Given('que um usuário cadastrado com username {string} quer cadastrar um filme na lista de assistidos', async function (username) {
    this.response = await request(BASE_URL).get(`/users/find/${username}`);
    this.user = this.response.body
});

When('uma requisição POST com JSON com name {string}, gender {string}, description {string}, userAvaliation {string} de corpo for enviada para a rota {string}', async function (name, gender,description,userAvaliation ,route) {
    try {
        response = await axios.post(route, {
            name,
            gender,
            description,
            userAvaliation: parseInt(userAvaliation)
        });
    } catch (error) {
        response = error.response;
    }
});

Then('o status da resposta de adição deve ser {string}', function(expectedStatus){
    assert.strictEqual(response.status.toString(), expectedStatus);
});

Then('o JSON da resposta deve ser a lista atualizada com name {string}, type {string} e members {string}', 
    function (expectedName, expectedType, expectedMembers) {
        const responseData = response.data;

        // Converte a string de members para um array de objetos
        const expectedMembersArray = JSON.parse(expectedMembers);

        // Remove o _id de cada item de members (caso ele esteja presente)
        const actualMembersArray = responseData.members.map(({ _id, ...rest }) => rest);

        // Verifica o nome e o tipo
        assert.strictEqual(responseData.name, expectedName);
        assert.strictEqual(responseData.type, expectedType);

        // Verifica se os membros são iguais, comparando os conteúdos, sem o _id
        assert.deepStrictEqual(actualMembersArray, expectedMembersArray);
    });


Given('que um usuário cadastrado com username {string} quer cadastrar novamente na lista de assistidos',async function (username) {
    this.response = await request(BASE_URL).get(`/users/find/${username}`);
    this.user = this.response.body
});

When('uma requisição POST para cadastro com JSON com name {string}, gender {string}, description {string}, userAvaliation {string} de corpo for enviada para a rota {string}', async function (name, gender,description,userAvaliation ,route) {
    try {
        response = await axios.post(route, {
            name,
            gender,
            description,
            userAvaliation: parseInt(userAvaliation)
        });
    } catch (error) {
        response = error.response;
    }
});

Then('o status da resposta para adicionar deve ser {string}', function(expectedStatus){
    assert.strictEqual(response.status.toString(), expectedStatus);
});

Then('o JSON da resposta de cadastro deve possuir a mensagem afirmando {string}', function (expectedMessage) {
    assert.strictEqual(response.data.message, expectedMessage);
});

Given('que um usuário cadastrado com username {string} quer obter informações de um filme da lista de assistidos',async function (username) {
    this.response = await request(BASE_URL).get(`/users/find/${username}`);
    this.user = this.response.body
});

When('uma requisição GET for enviada para a rota {string}', async function(route){
    try {
        response = await axios.get(route);
    } catch (error) {
        response = error.response;
    }
});

Then('o status da resposta encontrada deve ser {string}', function(expectedStatus){
    assert.strictEqual(response.status.toString(), expectedStatus);
});

Then('o JSON da resposta deve ser o membro encontrada com name {string}, gender {string}, description {string}, userAvaliation {string}',async function(name, gender,description,userAvaliation) {
    try {
        response = await axios.get(route, {
            name,
            gender,
            description,
            userAvaliation: parseInt(userAvaliation)
        });
    } catch (error) {
        response = error.response;
    }
});

Given('que um usuário cadastrado com username {string} quer obter todas informações da lista de assistidos', async function (username) {
    this.response = await request(BASE_URL).get(`/users/find/${username}`);
    this.user = this.response.body
});

When('uma requisição GET for requisitada para a rota {string}',async function (route) {
    try {
        response = await axios.get(route);
    } catch (error) {
        response = error.response;
    }
} );

Then('o status da resposta requisitada deve ser {string}',function(expectedStatus) {
    assert.strictEqual(response.status.toString(), expectedStatus);
});

Then('o JSON da resposta deve ser a lista completa com name {string}, type {string} e members {string}', 
    function (expectedName, expectedType, expectedMembers) {
        const responseData = response.data;

        // Converte a string de members para um array de objetos
        const expectedMembersArray = JSON.parse(expectedMembers);

        // Remove o campo "_id" de cada objeto dentro de responseData.members
        const actualMembers = responseData.members.map(({ _id, ...rest }) => rest);

        // Verifica se os valores retornados batem com os esperados
        assert.strictEqual(responseData.name, expectedName);
        assert.strictEqual(responseData.type, expectedType);
        assert.deepStrictEqual(actualMembers, expectedMembersArray);
    }
);

Given('que um usuário cadastrado com username {string} quer atualizar um filme da lista de assistidos',async function (username) {
    this.response = await request(BASE_URL).get(`/users/find/${username}`);
    this.user = this.response.body
});

When('uma requisição PUT com JSON com name {string}, gender {string}, description {string}, userAvaliation {string} de corpo for enviada para a rota {string}', async function (name,gender,description,userAvaliation,route){
    try {
        response = await axios.put(route, {
            name,
            gender,
            description,
            userAvaliation: parseInt(userAvaliation)
        });
    } catch (error) {
        response = error.response;
    }
} );

Then('o status da resposta para atualização deve ser {string}',function(expectedStatus){
    assert.strictEqual(response.status.toString(), expectedStatus);
});


Then('o JSON da resposta deve a lista atualizada com name {string}, type {string} e members {string}', 
        async function (expectedName, expectedType, expectedMembers) {
            const responseData = response.data;
    
            // Converte a string de members para um array de objetos
            const expectedMembersArray = JSON.parse(expectedMembers);
    
            // Remove o _id de cada item de members (caso ele esteja presente)
            const actualMembersArray = responseData.members.map(({ _id, ...rest }) => rest);
    
            // Verifica o nome e o tipo
            assert.strictEqual(responseData.name, expectedName);
            assert.strictEqual(responseData.type, expectedType);
    
            // Verifica se os membros são iguais, comparando os conteúdos, sem o _id
            assert.deepStrictEqual(actualMembersArray, expectedMembersArray);
        });


Given('que um usuário cadastrado com username {string} quer deletar um filme da lista de assistidos',async function (username) {
    this.response = await request(BASE_URL).get(`/users/find/${username}`);
    this.user = this.response.body
});

When('uma requisição DELETE for enviada para a rota {string}',async function(route){
    try {
        response = await axios.delete(route);
    } catch (error) {
        response = error.response;
    }
});

Then('o status da resposta para deleção deve ser {string}',function(expectedStatus){
    assert.strictEqual(response.status.toString(), expectedStatus);
});

Then('o JSON da resposta deve ser a lista atualizada da deleção com name {string}, type {string} e members {string} obtida pela rota {string}', async function (name,type,members,route) {
    try {
        response = await axios.get(route, {
            name,
            type,
            members: JSON.parse(members)
        });
    } catch (error) {
        response = error.response;
    }
});

Given('que um usuário cadastrado com username {string} quer ver informações de um filme da lista de assistidos',async function (username) {
    this.response = await request(BASE_URL).get(`/users/find/${username}`);
    this.user = this.response.body
});

When('uma requisição do tipo GET for enviada para a rota {string}', async function (route) {
    try {
        response = await axios.get(route);
    } catch (error) {
        response = error.response;
    }
});

Then('o status da resposta obtida deve ser {string}',function(expectedStatus){
    assert.strictEqual(response.status.toString(), expectedStatus);
});

Then('o JSON da resposta deve possuir a mensagem {string}', function (expectedMessage) {
    assert.strictEqual(response.data.message, expectedMessage);
});

Given('que um usuário cadastrado com username {string} deseja deletar um filme da lista de assistidos', async function (username) {
    this.response = await request(BASE_URL).get(`/users/find/${username}`);
    this.user = this.response.body
});

When('uma requisição DELETE for direcionada para a rota {string}', async function (route) {
    try {
        response = await axios.delete(route);
    } catch (error) {
        response = error.response;
    }
});

When("uma requisição POST com classificação {int}, gênero {string}, título {string} é enviada pela rota {string}", 
    async function(classification, genre, title, route){
    try{
        response = await axios.post(route, {
            classification: classification,
            genre: genre,
            title: title
        });
    } catch (error){
        response = error.response;
    }
})

When("uma requisição POST sem classificação, mas com gênero {string}, título {string} é enviada pela rota {string}", 
    async function(genre, title, route){
    try{
        response = await axios.post(route, {
            genre: genre,
            title: title
        });
    } catch (error){
        response = error.response;
    }
})

Then('a review retornada deve ter título {string}, corpo {string}, classificação {int} e conteúdo {string}', async function(titulo, corpo, classificacao, movie){
    const expectedReview = {
        title: titulo,
        body: corpo,
        classification: classificacao,
        movie: movie
    };

    const jsonResponse = (({title,body,classification,movie}) => ({title,body,classification,movie}))(response.data.review.at(response.data.review.length-1));

    assert.deepEqual(expectedReview, jsonResponse, "O filme retornado não confere com o registrado");
});

Then('o status obtido para deleção deve ser {string}',function(expectedStatus){
    assert.strictEqual(response.status.toString(), expectedStatus);
});

Then('o JSON da resposta deve possuir a mensagem afirmando {string}', function (expectedMessage) {
    assert.strictEqual(response.data.message, expectedMessage);
});

let review_list;
let userReview;

Given('o usuário {string} existe no sistema', async function (username) {
    //descrição
});

When('é enviado ao sistema uma requisição GET para a rota {string}', async function (route){
    try{
        response = await axios.get(route);
        
    }
    catch (error) {
        response = error.response;
    }
});

When('são buscadas as reviews do movie {string}', async function (filme){
    const FilmeEncontrado = response.data.find(f => f.name === filme);
    review_list = FilmeEncontrado.reviews;
});

Then('o status da answer deve ser {string}', function (expectedStatus) {
    assert.strictEqual(response.status.toString(), expectedStatus);
});

Then('o JSON da resposta deve ser conter {string}', function(lista) {
    const expectedList = JSON.parse(lista);

    // Função para remover os atributos indesejados
    const cleanReview = (review_list) => review_list.map(({ _id, createdAt, updatedAt, ...rest }) => rest);

    // Remove os campos antes de comparar
    assert.deepStrictEqual(cleanReview(review_list), expectedList);
});

When('é buscada a review publicada pelo usuário {string}', async function(user){
    const cleanReview = (review_list) => review_list.map(({ _id, createdAt, updatedAt, ...rest }) => rest);
    const aux = cleanReview(review_list);
    userReview = aux.find(r => r.user === user);
});

Then('o JSON da resposta deve ser {string}', function(review) {
    const expectedReview = JSON.parse(review);

    
    // Remove os campos antes de comparar
    assert.deepStrictEqual(userReview, expectedReview);
});