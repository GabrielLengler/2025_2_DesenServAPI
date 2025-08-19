function add(){
    const txtNome = document.getElementById("txtNome")
    const nome = txtNome.value
    if ( nome == "" ){
        alert("Digite um nome!")
    }else{
        var divLista = document.getElementById("lista")
        var conteudo = divLista.innerHTML
        conteudo += nome + "<br>"
        divLista.innerHTML = conteudo
        txtNome.value = ""
    }
}

function validar(){
    const valor = document.getElementById("txtNumero").value
    if( valor == ""){
        alert("O campo valor é obrigatório!")
        console.log("O campo valor é obrigatório!")
        return false
    }else if( isNaN( valor) ){
        alert("É permitido apenas números!")
        console.log("É permitido apenas números!")
        return false
    }else{
        if( valor >0 && valor <11 ){
            console.log("Valor " + valor + " é permitido")
            return true
        }else{
            console.log("Formulário inválido!")
            return false
        }
    }

}

function criarObjeto(){
    var conteudo = document.getElementById("conteudo")
    var pessoa = {
        nome : "Maria" ,
        idade: 25 ,
        altura : 1.75 ,
        vivo : true ,
        conjuge : {
            nome: "José" ,
            idade: 26
        },
        filhos : [
            { nome : "Júlia" , idade : 5 } ,
            { nome : "Pedro" , idade : 2 }
        ] ,
        fomacoes : [ "Graduação" , "Mestrado" ] ,
        getIMC : function(peso){
            return peso / (this.altura * this.altura)
        }
    }
    txt = "Nome: " + pessoa.nome + "<br>Idade: " + pessoa.idade
    txt += "<br>Cônjuge: " + pessoa.conjuge.nome
    if( pessoa.vivo ) txt += "<br>" + pessoa.nome + " está vivo(a)"
    pessoa.filhos.forEach( filho => {
        txt += "<br>Nome: " + filho.nome + " - Idade: " + filho.idade
    });
    txt += "<br>IMC: " + pessoa.getIMC( 60 )
    conteudo.innerHTML = txt

}