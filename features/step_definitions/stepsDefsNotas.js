/*
const { BeforeAll, AfterAll, Given, When, Then } = require("@cucumber/cucumber");
const request = require('supertest');
const assert = require('assert');
const app = require('../../backend/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');// Banco Em memoria para Tests

//const app = process.env.TEST_URL || 'http://localhost:5001';

let mongoServer;
const user = {
    name: "alex",
    email: 'ajs6@gmail.com',
    password: "123456789"
}

BeforeAll(async function () {
    try {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        if (!uri) {
            console.log("URI do MongoDB é undefined.");
        }
        await mongoose.connect(uri);

        const res = await request(app)
            .post('/users/add/')
            .send(user)
        assert.strictEqual(res.statusCode, 201);
    } catch (error) {
        console.log(error);
    }
});

AfterAll(async function () {
    try {
        await mongoose.disconnect();
        await mongoServer.stop();
    } catch (error) {
        console.log(error);
    }
});


Given('as seguintes notas do usuario {string} existem:', async function (string, dataTable) {
    const dataTableNew = dataTable.hashes();
    for (element of dataTableNew) {
        const res = await request(app)
            .post('/notes/add/')
            .send({
                email: string,
                title: element.title,
                note: element.note
            })
        assert.strictEqual(res.statusCode, 201);
    }
});

Then('as seguintes notas devem existir do usuario {string}:', async function (string, dataTable) {
    const dataTableNew = dataTable.hashes();
    const res = await request(app)
        .get(`/notes/${string}`)

    for (let index = 0; index < dataTableNew.length; index++) {
        assert.strictEqual(res.body.notes[index].title, dataTableNew[index].title);
        assert.strictEqual(res.body.notes[index].note, dataTableNew[index].note);
    }
});

When('adiciono uma nova nota para o title {string}, com o seguinte texto {string} do usuario {string}', async function (string, string1, string2) {
    let newNote = {
        email: string2,
        title: string,
        note: string1
    };
    const res = await request(app)
        .post('/notes/add/')
        .send(newNote)
    assert.strictEqual(res.statusCode, 201);
});

When('edito a nota do title {string} para {string} do usuario {string}', async function (string, string1, string2) {
    const res = await request(app)
        .put('/notes/edit')
        .send({
            email: string2,
            title: string,
            note: string1
        })
    assert.strictEqual(res.statusCode, 200);
});

When('remover a nota do title {string} do usuario {string}', async function (string, string1) {
    const res = await request(app)
        .del('/notes/dell')
        .send({
            email: string1,
            title: string
        })
    assert.strictEqual(res.statusCode, 200);
});

*/