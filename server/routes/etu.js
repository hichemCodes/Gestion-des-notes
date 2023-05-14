require('dotenv').config();


const express = require('express');
const mysqlConnection = require("../connection");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const router = express.Router();

//préparation des requetes 
const query_loginEtu = "select * from Etudiant where idEtu = ?;";
const query_getEtuInfo= "select * from etu_vw where idEtu = ?";
const query_getForma = "select distinct idForma, nomForma,AnneeUniv, creditForma from Archive where numEtu = ?;";
const query_getAllInfo = "select idUniversite, nomUniversite, idFac, nomFac, idDep, nomDepartement, idForma, nomForma, creditForma, semestre, idModule, nomModule, creditModule, idEnseignement, nomEnseignement, numEtu, nomEtu, prenomEtu, noteTP, noteCC, noteExam, session, AnneeUniv from Archive where numEtu=? and idForma=?;";

let refreshTokens = [];

function generateToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_ETU, { expiresIn: '60m'});
 }
 
 function authToken(req, res, next) {
     const header = req.headers['authorization'];
     const token = header && header.split(' ')[1];
     if (token == null) return res.sendStatus(401);
     
     jwt.verify(token, process.env.ACCESS_TOKEN_ETU, (err, user) => {
         if (err) return res.sendStatus(403);
         req.user = user;
         next();
     })
 }


//génération de refreshToken
router.post('/tokenEtu', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if(refreshTokens.includes(refreshToken)) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_ETU, (err, user) => {
       if (err) return res.sendStatus(403); 
       const acessToken = generateToken({ id :user.id});
       res.json({ token: acessToken});
    })
});

//suppression de token
router.delete('/logoutEtu', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204);
})



/**
 * @openapi
 * /api/login/etu:
 *   post:
 *     summary: Tentative de connection pour un Etudiant
 *     parameters:
 *     - in: body
 *       name: user
 *       description: credentials de l'étudiant
 *       schema:
 *          type: object
 *          properties: 
 *              id:
 *                  type: string
 *              mdp:
 *                  type: string
 *     responses:
 *          200:
 *            description: Renvoie un JSON Web Token unique à l'étudiant
 *            schema:
 *             type: object
 *             properties:
 *               token:
 *                  type: string
 *          500:
 *            description: Renvoie un message d'erreur
 *            schema:
 *             type: object
 *             properties:
 *               message:
 *                  type: string
 *          400:
 *            description: Renvoie un message d'erreur en format JSON
 *            schema:
 *             type: object
 *             properties:
 *               message:
 *                  type: string
 */
router.post("/login/etu", async (req, res) =>{
    //vérification de l'id
    var user = null;
    mysqlConnection.query(query_loginEtu ,[req.body.id],
        async (err, rows, fields) => {
    if(err) {
        res.send(err);
    }
    user = rows[0];
    //si user est null, l'utilisateur n'existe pas
    if (user == null) {
        return res.status(400).send({
            message: "Erreur: Identifiant ou mot de passe invalide."
        });
    };
    /*sinon on compare le mdp obtenu avec le mdp haché correspondant à l'utilisateur trouvé
     dans la bdd*/
    try {
        if(await bcrypt.compare(req.body.mdp, user.mdpEtu)) {
            //génération et envoi du JWT
            const id = req.body.id;
            const u = { id: id };
            const token = generateToken(u);
            const refreshToken = jwt.sign(u, process.env.REFRESH_TOKEN_ETU)
            res.json({token: token, refreshToken: refreshToken});
        } else {
            res.status(400).send({message: "Erreur: Identifiant ou mot de passe non valide."});
        }
   } catch {
       res.status(500).send({message: "Erreur : impossible de se connecter."})
   }
   });
});

/**
 * @openapi
 * /api/etu:
 *   get:
 *     summary: Obtenir les informations d'un étudiant avec son Token
 *     responses:
 *          200:
 *            description: Renvoie un JSON Web Token unique à l'étudiant
 *            schema:
 *             type: object
 *             properties:
 *               id:
 *                  type: string
 *               nom:
 *                  type: string
 *               prenom:
 *                  type: string
 *               num:
 *                  type: string
 *          500:
 *            description: Renvoie un message d'erreur
 */router.get("/etu", authToken, (req, res) => {
    try {
        var decoded =  jwt_decode(req.headers.authorization.split(' ')[1]);
        mysqlConnection.query(query_getEtuInfo ,[decoded.id],
            async (err, rows, fields) => {
        if(err) {
            res.send(err);
        }
        user = rows[0];
        res.json({id: user.idEtu, nom: user.nomEtu, prenom: user.prenomEtu, num: user.numEtu})
        });
    } catch {
        res.status(500).send('Erreur');
    }
});

//obtenir toutes les formations d'un étudiants (selon l'archive) avec son numéro en paramètre

router.post("/etu/forma", authToken, (req, res) => {
    try{
        mysqlConnection.query(query_getForma,[req.body.num], (err, rows, fields)=>{
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

//obtenir les notes d'un étudiant avec son numéro en paramètre
router.post("/etu/note", authToken, (req, res) => {
    try{
        mysqlConnection.query(query_getNote,[req.body.num], (err, rows, fields)=>{
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


//obtenir les modules, les enseignements et les notes d'un étudiant à partir de son num et d'un id de formation
router.post("/etu/forma/all", authToken, (req, res) => {
    try{
        mysqlConnection.query(query_getAllInfo,[req.body.num, req.body.idForma], (err, rows, fields)=>{
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


module.exports = router;
