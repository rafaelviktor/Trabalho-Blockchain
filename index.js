const crypto = require('crypto'); // biblioteca que criptografa em sha256

var qtdIteracoes = 2; // quantos blocos irá minerar (gerar hash válido), após o bloco genesis
var caractereDificuldade = "0" // pode escolher o caractere
var dificuldade = 1; // número de caracteres a ser validado no início do hash
var nonce = 1;

// função que cria objeto bloco, com 3 parâmetros (construtor)
function Bloco(mensagem, indice, hashAnterior) {
        this.mensagem = mensagem;
        this.indice = indice;
        this.hashAnterior = hashAnterior;
}

// função que pega o timestamp(data/hora atuais) e concatena tudo em uma só string e hashea
function CalculaHash(bloco) {
        let timestamp = String(new Date());
        let blocoConcatenado = timestamp+Object.values(bloco).join("");
        let hash = crypto.createHash('sha256').update(blocoConcatenado).digest('hex');
        return hash;
}

// define a dificuldade da mineração
function DefineDificuldade(caractere, dificuldade) { // pode escolher o caractere e o número de caracteres a ser acrescentado a frente
        let qtdCaracteres = [];
        // array que vai juntar a quantidade de caracteres
        for(let i = 1;i <= dificuldade; i++) {
                qtdCaracteres.push(caractere);
        }
        // após criar array com todos os caracteres, juntar tudo em uma única string e retornar
        let stringCaracteres = qtdCaracteres.join("");
        return stringCaracteres;
}

let stringDificuldade = DefineDificuldade(caractereDificuldade,dificuldade);
console.log(stringDificuldade)

// função que irá validar o hash
function ValidaHash(bloco) {
        let hashValido;
        do {
                // se for bloco genesis (indice 0) não incrementar o nonce
                if(bloco.indice == 0 && dificuldade == 0) {
                        hashValido = CalculaHash(bloco); 
                } else {
                        nonce++;
                        hashValido = CalculaHash(bloco);
                }
                //caso queira visualizar o console da validação só colocar console.log(hashValido) nessa parte
        } while(hashValido.substring(0,dificuldade) !== stringDificuldade) // parâmetros de validação do hash gerado, coleta trecho da string do inicio do hash e compara com a string de dificuldade
        return hashValido;
}

// função equivalente a main, onde irá rodar tudo
function IniciarBlockchain() {
        let indice = 0
        let cadeiaHashs = [];
        // cria bloco genesis e insere os parametros
        let BlocoGenesis = new Bloco('transações', indice, 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb');
        cadeiaHashs.push(ValidaHash(BlocoGenesis)); // valida o bloco genesis e coloca na cadeia de hashs validos
        indice++;
        console.log("[nonce] "+nonce) // exibe log do nonce do bloco validado
        do {
                let BlocoSeguinte = new Bloco('transações', indice, cadeiaHashs[indice-1]);
                cadeiaHashs.push(ValidaHash(BlocoSeguinte)); // valida o bloco e coloca na cadeia de hashs validos
                console.log("[nonce] "+nonce) // exibe log do nonce do bloco validado
                indice++
        } while (indice < qtdIteracoes) // quantos blocos irá minerar (gerar hash válido), após o bloco genesis
                
        // criar situação de bloco inválido entrando na cadeia de hashs
        cadeiaHashs.push('ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb')
        return cadeiaHashs;
}

function ValidaBlockchain(cadeiaHashs) {
        // loop que percorre todo o array de hashs procurando hash inválido
        for(let i = 0;i <= (qtdIteracoes); i++) {
                if(cadeiaHashs[i].substring(0,dificuldade) !== stringDificuldade) {
                        cadeiaHashs.splice(i,1,"|Erro|Hash Inválido|") // ao encontrar hash inválido substitui o hash por string dizendo ser inválido
                }
        }

        return cadeiaHashs;
}

console.log(ValidaBlockchain(IniciarBlockchain()));
