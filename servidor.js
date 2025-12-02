const app = require('./app');
const port = 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Registrar rotas
const minionsRotas = require('./src/rotas/minionsRotas');
app.use('/minions', minionsRotas);
