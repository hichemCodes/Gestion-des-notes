require('dotenv').config();

const express = require('express');
const mysqlConnection = require("../connection");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const jwt_decode = require('jwt-decode');

//préparation des requêtes
const query_EnsLogin = "select idEnseignant, mdpEns from Enseignant where idEnseignant = ?;";
const query_getEnsInfo = "select * from ens_vw where idEnseignant = ?;";
const query_getEnsgmt = "select * from Enseignement_vw where numEns = ?;"
const query_getFormaPresi= "select * from Formation,Departement WHERE Formation.idDepartement = Departement.idDepartement AND numEns= ?;"
const query_getEnsgmt_note = "SELECT * FROM Etudiant,Note where Note.numEtu = Etudiant.numEtu and Note.idEnseignement = ?"
const query_updateNoteAll = "call update_noteall(?,?,?,?,?);";

let refreshTokens = [];

//generation de JWT
function generateToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_ENS, { expiresIn: '60m'});
 }

 //verification de JWT
 function authToken(req, res, next) {
     const header = req.headers['authorization'];
     const token = header && header.split(' ')[1];
     if (token == null) return res.sendStatus(401);
     
     jwt.verify(token, process.env.ACCESS_TOKEN_ENS, (err, user) => {
         if (err) return res.sendStatus(403);
         req.user = user;
         next();
     })
 }


//génération de refreshToken
router.post('/tokenEns', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if(refreshTokens.includes(refreshToken)) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.ACCESS_TOKEN_ENS, (err, user) => {
       if (err) return res.sendStatus(403); 
       const acessToken = generateToken({ id :user.id});
       res.json({ token: acessToken});
    })
});

//suppression de token
router.delete('/logoutEns', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204);
})


 //tentative de connexion pour un enseignant
router.post("/login/ens", async (req, res) => {
    //vérification de l'id
    var user = null;
    mysqlConnection.query(query_EnsLogin, [req.body.id],
        async (err, rows, fields) => {
    if(err) {
        res.send(err);
    }
    user = rows[0];
    //si user est null, l'utilisateur n'existe pas
    if (user == null) {
        return res.status(400).send({message: "Erreur: Identifiant ou mot de passe incorrect"});
    };
    /*sinon on compare le mdp obtenu avec le mdp haché correspondant à l'utilisateur trouvé
     dans la bdd*/
    try {
        if(await bcrypt.compare(req.body.mdp, user.mdpEns)) {
            //génération et envoi du JWT
            const id = req.body.id;
            const u = { id: id };
            const token = generateToken(u);
            const refreshToken = jwt.sign(u, process.env.REFRESH_TOKEN_ENS)
            res.json({token: token, refreshToken: refreshToken});
        } else {
            res.send({message: "Erreur: Identifiant ou mot de passe incorrect"})
        }
   } catch {
       res.status(500).send("Erreur: Connexion impossible")
   }
   });
});

//obtenir les infos de l'enseignant à partir de son token
router.get("/ens", authToken, (req, res) => {
    try {
        var decoded =  jwt_decode(req.headers.authorization.split(' ')[1]);
         mysqlConnection.query(query_getEnsInfo, [decoded.id],
            async (err, rows, fields) => {
        if(err) {
            res.send(err);
        }
        user = rows[0];
        res.json({id: user.idEnseignant,nom: user.nomEns, prenom: user.prenomEns, num: user.numEns})
        });
    } catch {
        res.status(500).send('Erreur');
    }
});

//obtenir les enseignements d'un enseignant avec son numéro
router.post("/ens/ensgmt", authToken, (req, res) => {
    try{
        mysqlConnection.query(query_getEnsgmt,[req.body.num], (err, rows, fields)=>{
            if(!err){
                res.send(rows);
            }
            else {
                res.status(500).send(err);
            }
        })
    } catch {
        res.status(500).send({message: "Erreur"});
    }
});

//obtenir les formations ou un enseignant est président du jury avec son numéro
router.post("/ens/forma", authToken, (req, res) => {
    try{
        mysqlConnection.query(query_getFormaPresi,[req.body.num], (err, rows, fields)=>{
            if(!err){
                res.send(rows);
            }
            else {
                res.status(500).send(err);
            }
        })
    } catch {
        res.status(500).send({message: "Erreur"});
    }

});

//obtenir les notes et les étudiants dans un enseignements avec un num d'enseignement
router.post("/ens/ensgmt/note", authToken, (req, res) => {
    try{
        mysqlConnection.query(query_getEnsgmt_note,[req.body.id], (err, rows, fields)=>{
            if(!err){
                res.send(rows);
            }
            else {
                res.status(500).send(err);
            }
        })
    } catch {
        res.status(500).send({message: "Erreur"});
    }

    
//modifier note all selon son l'identifiant de l'etudiant et de l'enseignement
router.post("/ens/note/all", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_updateNoteAll,
            [body.TP, req.body.CC, req.body.exam,req.body.num,req.body.numEns], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});

});


module.exports = router;
