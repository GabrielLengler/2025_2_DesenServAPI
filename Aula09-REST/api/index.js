const express = require("express")
const knex = require("knex")
const errors = require("http-errors")

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


app.get( "/product/last" , (req, res, next)=>{
    conn( "produto" )
        .orderBy("id" , "desc")
        .first()
        .then( dados => res.json( dados )  )
        .catch( next )
} )


app.get( "/product/:idProd" , (req, res, next)=>{
    const id = req.params.idProd
    conn( "produto" )
        .where( "id" , id )
        .first()
        .then( dados => res.json( dados )  )
        .catch( next )
} )


app.post( "/product" , (req, res, next)=>{
    conn( "produto" )
        .insert( req.body )
        .then( dados => {
            if( !dados ){
                return next(errors( 404 , "Erro ao inserir" ) )
            } 
            res.status(201).json( {
                resposta : "Produto inserido" ,
                id : dados[0]
            } )  
        })
        .catch( next )
} )


app.put( "/product/:idProd" , (req, res, next)=>{
    conn( "produto" )
        .where( "id" , idProd)
        .update( req.body )
        .then( dados => {
            if( !dados ){
                return next(errors( 404 , "Erro ao editar" ) )
            } 
            res.status(200).json( {
                resposta : "Produto atualizado" 
            } )  
        })
        .catch( next )
} )


app.delete( "/product/:idProd" , (req, res, next)=>{
    const id = req.params.idProd
    conn( "produto" )
        .where( "id" , id )
        .delete()
        .then( dados => {
            if( !dados ){
                return next(errors( 404 , "Erro ao tentar excluir") )
            }
            res.status(200).json( {
                resposta : "Produto excluido"
            } )         
        } )
        .catch( next )
} )



app.listen( PORT , ()=>{
    console.log( `Loja executando em: http://${HOSTNAME}:${PORT}` )
} )
