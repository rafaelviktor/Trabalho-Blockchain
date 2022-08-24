const crypto = require('crypto');

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

function ValidaHash(bloco) {
        let hashValido;
        do {
                hashValido = CalculaHash(bloco);
                nonce++;
                //caso queira visualizar o console da validação só colocar console.log(hashValido) nessa parte
        } while(hashValido.substring(0,1) !== "0")
        // para mudar a condição só modificar acima
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
        } while (indice < 1)
        return cadeiaHashs;
}

console.log(IniciarBlockchain());