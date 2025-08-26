function lerDados(){
    const req = new XMLHttpRequest()

    req.onreadystatechange = function(){
        console.log("readyState atual: " + this.readyState)
        if( this.readyState == 4 && this.status == 200){
            document.getElementById("conteudo").innerHTML = this.responseText
        }
        if( this.readyState == 4 && this.status == 404){
            txt = this.status + " - " + this.statusText
            document.getElementById("conteudo").innerHTML = txt
    }
}


    req.open("GET" , "dados.txt" , true)
    req.send()

}

function gerarNumeros(){
    const req = new XMLHttpRequest()
    
    req.onreadystatechange = function(){
        console.log("readyState atual: " + this.readyState)
        const divNumeros = docmunt.getElementById("numeros")

        if(this.readyState < 4 )
        divNumeros.innerHTML = "Carregando..."
        
        if( this.readyState == 4 && this.status == 200){
            document.getElementById("conteudo").innerHTML = this.responseText
        }
        if( this.readyState == 4 && this.status == 404){
            txt = this.status + " - " + this.statusText
            document.getElementById("conteudo").innerHTML = txt
    }
}
    numero = document.getElementById("txtNumero").value
    req.open("GET" , "servidor.php?valor=" + numero , true)
    req.send()

}