const http = require("http")

const hostname = "127.0.0.1"
const port = 3000

var cont = 0

const server = http.createServer( (req, res) => {
        cont ++
        console.log( `Contador de requisições:  ${cont}` )
        res.statusCode = 200
        res.setHeader( "Content-type" , "text/plain")
        res.end( "Olá Mundinho!" )
})

server.listen( port , hostname , () => {
        console.log( `Servidor executando em http://${hostname}:${port}`)
} )


