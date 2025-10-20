import http from "http";
import { v4 } from "uuid";

const port = 3000;

const clientes = [
    {
        id: "1",
        nome: "Luana da Silva Castro",
        dataNascimento: "01/05/1990",
        genero: "F",
        telefone: "(24) 9 9902-3244"
    }
];

const server = http.createServer((request, response) => {
    const { method, url } = request;
    
    let body = "";

    request.on("data", (chunk) => {

        body += chunk.toString();

    });

    request.on("end", () => {

        // Recolho a variavel id direto da URL
        const id = url.split('/')[2];

        if(url === "/clientes" && method === "GET") {

            response.writeHead(200, { "content-type" : "application/json" });
            response.end(JSON.stringify(clientes));

        } else if (url === "/clientes" && method === "POST") {
        
            const { nome, dataNascimento, genero, telefone } = JSON.parse(body);

            const novoCliente = { id: v4(), nome, dataNascimento, genero, telefone };

            clientes.push(novoCliente);

            response.writeHead(201, { "content-type" : "application/json" });

            response.end(JSON.stringify(novoCliente));

        
        } else if (url.startsWith("/clientes") && method === "PUT") {

            const { nome, dataNascimento, genero, telefone } = JSON.parse(body);
            
            //Procuro dentro do array clientes um objeto C com um atributo id igual a variavel id que peguei da url previamente
            const clienteAlterado = clientes.find(c => c.id === id);

            //Se encontrei esse cliente/objeto, altero todas as suas propriedades para as enviadas via PUT
            if (clienteAlterado) {

                clienteAlterado.nome           = nome;
                clienteAlterado.dataNascimento = dataNascimento;
                clienteAlterado.genero         = genero;
                clienteAlterado.telefone       = telefone;

                response.writeHead(200, { "content-type" : "application/json" });

                response.end(JSON.stringify(clienteAlterado));

            } else {
                response.writeHead(404, { "content-type" : "application/json" });
                response.end(JSON.stringify({ message: "Cliente nao encontrado" }));
            }

        } else if (url.startsWith("/clientes") && method === "DELETE") {
        
            //Procuro no array de objetos o index referente ao objeto com o ID informado
            const index = clientes.findIndex(c => c.id === id);

            if (index !== -1) {

                clientes.splice(index, 1);                
                response.writeHead(204);
                response.end();

            } else {
                response.writeHead(404, { "content-type" : "application/json" });
                response.end(JSON.stringify({ message: "Cliente nao encontrado" }));
            }

        } else {

            response.writeHead(404, { "content-type" : "application/json" });
            response.end(JSON.stringify({ message: "Rota nao encontrada" }));

        }

    });    
});

server.listen(port, () => {
    console.log(`Servidor ligado na porta ${port}`);
});


/**
 * 
 *  - Conceito de variável: variável é um espaço reservado na memória ram
 *  - O que é memória ram? É uma memória temporária do seu computador
 *  - Enquanto o servidor estiver ligado, as informações continuarão a ser armazenadas, a partir do momento
 *    que o servidor é reiniciado, os dados somem, semelhante ao que acontece com um ctrl + c, ctrl + v.
 *    Se você instala um software, ou um arquivo, ao desligar o seu computador, os arquivos permanecem pois são armazenados no HD.
 *    Porém ao desligar o computador, o que estava armazenado no ctrl + c, ctrl + v é perdido, pois é armazenado numa variável.
 * 
 */