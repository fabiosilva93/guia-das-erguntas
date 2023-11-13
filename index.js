const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./models/Pergunta");
const Resposta = require("./models/Resposta");

//DATABASE CONNECTION
connection.authenticate()
    .then(() =>{
        console.log("Conexão feita com banco de dados!");
    }).catch((msgErro) => {
        console.log(msgErro);
    });

//CONFIGS

//Definindo o Template Engine. Necessário criar uma pasta views.
//Os arquivos html precisam ter a extensão .ejs
app.set('view engine', 'ejs');

//Definindo diretório onde será disponível os arquivos estáticos
app.use(express.static('public'));

//O body parser permite que os dados enviados pelo formulário sejam
//"traduzidos" para uma estrutura javascript
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//ROTAS
app.get("/", function(req, res){
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC'] //Ordenação DESC = Decrescente || ASC = Crescente
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        }); //O Render já vai direto na pasta views e busca o arquivo
    }); //Faz o SELECT na tabela
});

app.get("/perguntar", function(req, res){
    res.render("perguntar");
});

//Rotas do tipo POST são usavas para receber dados dos formulários
app.post("/salvarpergunta", function (req, res){
    let titulo = req.body.titulo; //Depois de configurar o body parser acima, ele disponibiliza esse objeto.body para capturar os dados do formulario
    let pergunta = req.body.pergunta;
    Pergunta.create({
        titulo: titulo,
        pergunta: pergunta
    }).then(() => {
        res.redirect("/");//Aqui será redirecionado após os dados serem inseridos na tabela
    });
});

//Rota que faz a listagem da pergunta para poder responder pelo ID
app.get("/pergunta/:id", function (req, res) {
    let id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ //Pergunta achada
            res.render("pergunta", {
                pergunta: pergunta
            });
        }else{//Pergunta não encontrada
            res.redirect("/");
        }
    });
});

app.post("/responder", function (req, res) {
    let corpo = req.body.corpo;
    let perguntaId = req.body.perguntaId;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);

    });
});

app.listen(8080, function(){
    console.log("App rodando em http://localhost:8080");
});