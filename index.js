const crypto = require('crypto'); // biblioteca que criptografa em sha256

var qtdIteracoes = 2; // quantos blocos irá minerar (gerar hash válido), após o bloco genesis
var caractereDificuldade = "0" // pode escolher o caractere
var dificuldade = 1; // número de caracteres a ser validado no início do hash
var nonce = 1;

function Bloco(mensagem, indice, hashAnterior) {
        this.mensagem = mensagem;
        this.indice = indice;
        this.hashAnterior = hashAnterior;
}

function CalculaHash(bloco) {
        let timestamp = String(new Date());
        let blocoConcatenado = timestamp+Object.values(bloco).join("");
        let hash = crypto.createHash('sha256').update(blocoConcatenado).digest('hex');
        return hash;
}

// define a dificuldade da função abaixo dessa, de validação desses hashs gerados
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

function ValidaHash(bloco) {
        let hashValido;
        do {
                if(bloco.indice == 0 && dificuldade == 0) {
                        hashValido = CalculaHash(bloco); 
                } else {
                        nonce++;
                        hashValido = CalculaHash(bloco);
                }
                //caso queira visualizar o console da validação só colocar console.log(hashValido) nessa parte
        } while(hashValido.substring(0,dificuldade) !== stringDificuldade)
        // acima os parâmetros de validação do hash gerado, coleta um pedaço da string do começo do hash e compara com a string de dificuldade
        return hashValido;
}

function IniciarBlockchain() {
        let indice = 0
        let cadeiaHashs = [];
        let BlocoGenesis = new Bloco('teste', indice, 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb');
        cadeiaHashs.push(ValidaHash(BlocoGenesis));
        indice++;
        console.log("[nonce] "+nonce)
        do {
                let BlocoSeguinte = new Bloco('teste', indice, cadeiaHashs[indice-1]);
                cadeiaHashs.push(ValidaHash(BlocoSeguinte));
                console.log("[nonce] "+nonce)
                indice++
        } while (indice < qtdIteracoes)
        cadeiaHashs.push('ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb')
        return cadeiaHashs;
}

function ValidaBlockchain(cadeiaHashs) {
        // loop que percorre todo o array de hashs procurando hash inválido
        for(let i = 0;i <= (qtdIteracoes); i++) {
                if(cadeiaHashs[i].substring(0,dificuldade) !== stringDificuldade) {
                        cadeiaHashs.splice(i,1,"|Erro|Hash Inválido|")
                }
        }

        return cadeiaHashs;
}

console.log(ValidaBlockchain(IniciarBlockchain()));