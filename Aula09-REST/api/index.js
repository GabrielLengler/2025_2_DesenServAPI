const express = require("express")
const knex = require("knex")
const erros = require("http-errors")

const app = express()

app.use( express.json())
app.use( express.urlencoded( {extended : true} ) )

const PORT = 8001
const HOSTNAME = "localhost"

const conn = knex( {
    client : "mysql" ,
    connection : {
        host : HOSTNAME ,
        user : "root" ,
        password : "" ,
        database : "loja_2025_2"
    }
} )

app.get( "/" , (req, res, next)=>{
    res.json( { resposta : "Seja bem-vindo(a) a nossa API" } )
} )

app.get( "/product" , (req, res, next)=>{
    conn( "produto" )
        .then( dados => res.json( dados )  )
        .catch( next )
} )




app.listen( PORT , ()=>{
    console.log( `Loja executando em: http://${HOSTNAME}:${PORT}` )
} )
