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