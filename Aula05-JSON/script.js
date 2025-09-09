function lerJSON(){
    const req = new XMLHttpRequest()
    req.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            const divJSON = document.getElementById("divJSON")
            divJSON.innerHTML = this.responseText + "<BR><hr>"
            const objPessoa = JSON.parse( this.responseText )
            txt = "Nome: " + objPessoa.nome
            txt += "<br>Idade: " + objPessoa.idade
            txt += "<br>Casado(a): "
            //objPessoa.casado ? txt += "Sim" : txt += "Não"
            if( objPessoa.casado ){
                txt += "Sim" + "<br>Cônjuge: " + objPessoa.conjuge.nome
            }else{
                txt += "Não"
            }
            txt += "<br>Filhos: "
            objPessoa.filhos.forEach( filho => {
                txt += "<br>Nome: " + filho.nome + " - Idade: " + filho.idade
            })
            txt += "<br>Formações: "
            objPessoa.formacoes.forEach( formacao => {
                txt += " - " + formacao
            })

            divJSON.innerHTML += txt
    
        }

    }

}




function buscarProdutos(){
    const req = new XMLHttpRequest()
    req.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            const divProdutos = document.getElementById("divProdutos")
            txt = '<table border="1">'
            txt += '    <tr> '
            txt += '        <th>Código</th> '
            txt += '        <th>Nome</th> '
            txt += '        <th>Preço</th> '
            txt += '        <th>Excluir</th> '
            txt += '    </tr> '
            objJSON = JSON.parse( this.responseText )
            const produtos = objJSON.produtos
            produtos.forEach( prod => {
                txt += "<tr>"
                txt += "    <td>" + prod.id + "</td>"
                txt += "    <td>" + prod.nome + "</td>"
                txt += "    <td>" + prod.preco + "</td>"
                txt += "    <td><button onclick='excluir(" + prod.id + ")'> X </button></td>"
                txt += "</tr>"
            })
            txt += "</table>"
            divProdutos.innerHTML = txt

        }
    }


    req.open("GET" , "servidor.php?buscar" , true )
    req.send()
}

function excluir( idProd ){
    const req= new XMLHttpRequest()
    req.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            buscarProdutos()
        }
    }
    req.open("GET", "servidor.php?excluir&idProduto=" + idProd , true)
    req.send()

}

function inserirProduto(){
    const nome = document.getElementById("txtNome").value
    const preco = document.getElementById("txtPreco").value
    const req= new XMLHttpRequest()
    req.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            const json = JSON.parse ( this.responseText )
            txt = json.resposta
            if ( json.id ) txt += "\nId gerado: " + json.id
            alert( txt )
            buscarProdutos()
        }

    }

    req.open("POST", "servidor.php?inserir", true)
    req.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" )
    req.send("name=" + nome + "&price=" + preco)
}