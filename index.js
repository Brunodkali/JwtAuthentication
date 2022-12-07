const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser');
const port = 3000;
const jwt = require('jsonwebtoken');  
const cors = require('cors')
const SECRET = 'brunoAuth';  

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];

    try {
        jwt.verify(token, SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).json({ auth: false, mensagem: 'Falha ao autenticar o token' });
            }else {
                req.userId = decoded.userId;
                next();
            }
        });
    }catch (err) {
        return err;
    }
}; 

app.get('/', (req, res) => {
    res.json('Você está na rota principal');
});

app.post('/login', (req, res) => {
    try {
        let login = req.body.login;
        let senha = req.body.senha;

        if(login === 'bruno' && senha === '123') {
            const token = jwt.sign({ userId: 1 }, SECRET, {expiresIn: 300});

            res.json({ auth: true, token: token });
        }
        res.status(401).json({ message: 'Login inválido!' });
    }catch (err) {
        return err;   
    }
});

app.get('/clientes', verifyJWT, (req, res) => { 
    console.log(req.userId + ' fez essa chamada');
    res.json(
        [
            {id:1, nome:'Luiz'},
            {id:2, nome:'Bruno'},
            {id:3, nome:'Débora'},
            {id:4, nome:'Carlos'}
        ]
    );
});

app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
});
 
app.listen(port, () => {
    console.log('Servidor rodando');
});
