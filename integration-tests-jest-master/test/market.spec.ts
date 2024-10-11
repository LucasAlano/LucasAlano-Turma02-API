import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Mercado', () => {
    const p = pactum;
    const rep = SimpleReporter;
    const baseUrl = 'https://api-desafio-qa.onrender.com';

    p.request.setDefaultTimeout(30000);

    let itemId;

    beforeAll(async () => {
        p.reporter.add(rep);
        // Retorna todos os mercados existentes e salva o ID do primeiro.
        const response = await p
            .spec()
            .get(`${baseUrl}/mercado`)
            .expectStatus(StatusCodes.OK)
            .returns('res.body');

        itemId = response[0].id;
    });

    afterAll(async () => {
        // Remove um mercado específico pelo ID após os testes.
        await p
            .spec()
            .delete(`${baseUrl}/mercado/${itemId}`)
            .expectStatus(StatusCodes.NO_CONTENT);
        p.reporter.end();
    });

    describe('GET', () => {
        it('Deve retornar todos os mercados cadastrados', async () => {
            const response = await p
                .spec()
                .get(`${baseUrl}/mercado`)
                .expectStatus(StatusCodes.OK)
                .returns('res.body');

            expect(response).toBeDefined(); // Adiciona uma verificação para garantir que a resposta existe
        });
    });

    describe('GET', () => {
        it('Deve retornar um mercado pelo ID especificado', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/${itemId}`)
                .expectStatus(StatusCodes.OK);
        });
    });

    describe('GET', () => {
        it('Não deve retornar um mercado com ID inexistente', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0`)
                .expectStatus(StatusCodes.NOT_FOUND);
        });
    });

    describe('POST', () => {
        it('Deve criar um novo mercado com categorias e subcategorias vazias', async () => {
            const novoMercado = {
                nome: `Mercado Lucas ${Date.now()}`,
                cnpj: "12345678912345",
                endereco: `Rua Joao Norbal ${Date.now()}`
            };

            await p
                .spec()
                .post(`${baseUrl}/mercado`)
                .withJson(novoMercado)
                .expectStatus(StatusCodes.CREATED);
        });
    });

    describe('POST', () => {
        it('Não deve criar um mercado com CNPJ inválido', async () => {
            const cnpjErro = "123456";

            await p
                .spec()
                .post(`${baseUrl}/mercado`)
                .withJson({
                    nome: "Mercado Teste",
                    cnpj: cnpjErro,
                    endereco: "testes"
                })
                .expectStatus(StatusCodes.BAD_REQUEST)
                .expectJson({
                    "errors": [
                        {
                            "type": "field",
                            "msg": "Nome é obrigatório",
                            "path": "nome",
                            "location": "body"
                        },
                        {
                            "type": "field",
                            "msg": "CNPJ deve ter 14 dígitos",
                            "path": "cnpj",
                            "location": "body",
                            "value": cnpjErro
                        }
                    ]
                });
        });
    });

    describe('PUT', () => {
        it('Deve atualizar um mercado existente pelo ID', async () => {
            const mercadoAtualizado = {
                nome: `Mercado Lucas Atualizado ${Date.now()}`,
                cnpj: "12345678912345",
                endereco: `Rua Joao Norbal Atualizado ${Date.now()}`
            };

            await p
                .spec()
                .put(`${baseUrl}/mercado/${itemId}`)
                .withJson(mercadoAtualizado)
                .expectStatus(StatusCodes.OK);
        });
    });

    describe('PUT', () => {
        it('Não deve atualizar um mercado com CNPJ inválido', async () => {
            const cnpjErro = "123456";

            await p
                .spec()
                .put(`${baseUrl}/mercado/${itemId}`)
                .withJson({
                    nome: `MercadoTeste ${Date.now()}`,
                    cnpj: cnpjErro,
                    endereco: `EnderecoTeste ${Date.now()}`
                })
                .expectStatus(StatusCodes.BAD_REQUEST);
        });
    });

    describe('PUT', () => {
        it('Não deve atualizar um mercado com ID inexistente', async () => {
            await p
                .spec()
                .put(`${baseUrl}/mercado/0`)
                .withJson({
                    nome: `MercadoTeste ${Date.now()}`,
                    cnpj: "12345678912345",
                    endereco: `EnderecoTeste ${Date.now()}`
                })
                .expectStatus(StatusCodes.NOT_FOUND);
        });
    });

    describe('DELETE', () => {
        it('Não deve remover um mercado com ID inexistente', async () => {
            await p
                .spec()
                .delete(`${baseUrl}/mercado/0`)
                .expectStatus(StatusCodes.NOT_FOUND);
        });
    });

    describe('GET', () => {
        it('Não deve retornar produtos de um mercado inexistente pelo ID', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos`)
                .expectStatus(StatusCodes.NOT_FOUND);
        });
    });

    describe('GET', () => {
        it('Não deve retornar frutas de um mercado inexistente', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos/hortifruit/frutas`)
                .expectStatus(StatusCodes.NOT_FOUND);
        });
    });

    describe('GET', () => {
        it('Não deve retornar legumes de um mercado inexistente', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos/hortifruit/legumes`)
                .expectStatus(StatusCodes.NOT_FOUND);
        });
    });

    describe('GET', () => {
        it('Não deve retornar doces de um mercado inexistente', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos/padaria/doces`)
                .expectStatus(StatusCodes.NOT_FOUND);
        });
    });

    describe('GET', () => {
        it('Não deve retornar salgados de um mercado inexistente', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos/padaria/salgados`)
                .expectStatus(StatusCodes.NOT_FOUND);
        });
    });

    describe('GET', () => {
        it('Não deve retornar bovinos de um mercado inexistente', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos/acougue/bovinos`)
                .expectStatus(StatusCodes.NOT_FOUND);
        });
    });

});
