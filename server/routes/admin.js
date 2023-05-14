require('dotenv').config();

const express = require('express');
const mysqlConnection = require("../connection");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const jwt_decode = require('jwt-decode');

//préparation des requêtes
const query_getUniv = "SELECT * from univ_vw;";
const query_getFac = "SELECT * from fac_vw;";
const query_getDep = "SELECT * from dep_vw;";
const query_getForma = "SELECT * from forma_vw;";
//diplication de getForma pour avoir les crédits dans le résultat
const query_getFormaMod = "SELECT * from Formation;";

const query_getMod = "SELECT * from mod_vw;";
const query_getEnsgmt ="SELECT * from Enseignement_vw;";
const query_getEtu = "SELECT * from etu_vw;";
const query_getEns = "SELECT * from ens_vw;";
const query_AdminLogin = "select idAdmin, mdpAdmin from Admin where idAdmin = ?;";
const query_getAdminInfo = "select numAdmin, idAdmin from Admin where idAdmin = ?";
const query_getArchive = "select * from Archive;"

const query_inserEtu = 'call insert_etu(?, ?, ?, ?, ?, ?);';
const query_inserEns ="call insert_ens(?, ?, ?, ?, ?);";
const query_inserUniv = "call insert_univ(?,?);";
const query_inserFac = "call insert_fac(?,?,?);";
const query_inserDep ="call insert_dep(?,?,?);";
const query_inserForma = "call insert_form(?,?,?,?,?);"
const query_inserMod = "call insert_mod(?,?,?,?,?);";
const query_inserEnsgmt = "call insert_enseignement(?,?,?,?,?,?,?)";
const query_inserArchive = "call insert_archive()";

const query_delUniv= "call delete_univ(?);";
const query_delFac= "call delete_fac(?);";
const query_delDep= "call delete_dep(?);";
const query_delEns= "call delete_ens(?);";
const query_delForm= "call delete_form(?);";
const query_delMod= "call delete_mod(?);";
const query_delEnsgmt= "call delete_enseignement(?);"
const query_delEtu="call delete_etu(?);";
const query_delArchive ="call delete_archive(?)";

const query_updateUniv = "call update_univall(?,?)";
const query_updateFac ="call update_facall(?,?,?)";
const query_updateDep = "call update_depall(?,?,?)";
const query_updateEns ="call update_ensall(?,?,?,?)";
const query_updateForm ="call update_formall(?,?,?,?,?)";
const query_updateMod ="call update_modall(?,?,?,?,?)";
const query_updateEnsgmt="call update_enseignementall(?,?,?,?,?,?,?)";
const query_updateEtu="call update_etuall(?,?,?,?,?)";

const query_getAnnee="select concat(convert(annee,char), '-', convert(annee + 1, char)) as annee, semestre_en_cours, session_en_cours, entre_note_active from Annee;";
const query_incrAnnee="call incr_annee();";
const query_incrSemestre="call incr_semestre();";
const query_incrSession="call incr_session()";

let refreshTokens = [];


//generation de JWT
function generateToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_ADMIN, { expiresIn: '60m'});
 }

 //verification de JWT
 function authToken(req, res, next) {
     const header = req.headers['authorization'];
     const token = header && header.split(' ')[1];
     if (token == null) return res.sendStatus(401);
     
     jwt.verify(token, process.env.ACCESS_TOKEN_ADMIN, (err, user) => {
         if (err) return res.sendStatus(403);
         req.user = user;
         next();
     })
 }

//génération de refreshToken
router.post('/tokenAdmin', (req, res) => {
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
router.delete('/logoutAdmin', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204);
})

//tentative de connexion pour l'admin
router.post("/login/admin", async (req, res) => {
    //vérification de l'id
    var user = null;
    mysqlConnection.query(query_AdminLogin, [req.body.id],
        async (err, rows, fields) => {
    if(err) {
        res.send(err);
    }
    user = rows[0];
    //si user est null, l'utilisateur n'existe pas
    if (user == null) {
        return res.status(400).send({message: "Erreur: Identifiant ou mot de passe invalide"});
    };
    /*sinon on compare le mdp obtenu avec le mdp haché correspondant à l'utilisateur trouvé
     dans la bdd*/
    try {
        if(await bcrypt.compare(req.body.mdp, user.mdpAdmin)) {
            //génération et envoi du JWT
            const id = req.body.id;
            const u = { id: id };
            const token = generateToken(u);
            const refreshToken = jwt.sign(u, process.env.REFRESH_TOKEN_ADMIN)
            res.json({token: token, refreshToken: refreshToken});
        } else {
            res.status(400).send({message: "Erreur: Identifiant ou mot de passe invalide"})
        }
   } catch {
       res.status(500).send("Erreur: Connexion impossible, veuillez réessayer ultérieurement")
   }
   });
});

//obtenir les informations avec son token
router.get("/admin", authToken, (req, res) => {
    try {
        var decoded =  jwt_decode(req.headers.authorization.split(' ')[1]);
         mysqlConnection.query(query_getAdminInfo, [decoded.id],
            async (err, rows, fields) => {
        if(err) {
            res.send(err);
        }
        user = rows[0];
        res.json({id: user.idAdmin, num: user.numAdmin})
        });
    } catch {
        res.status(500).send('Erreur');
    }
});


//obtenir l'année en cours
router.get("/annee", authToken, (req, res) => {
    mysqlConnection.query(query_getAnnee, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});


//passer à l'année suivante
router.post("/annee", authToken, (req, res) => {
    mysqlConnection.query(query_incrAnnee, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});


//passer au semestre suivant
router.post("/semestre", authToken, (req, res) => {
    mysqlConnection.query(query_incrSemestre, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});


//passer à la session suivante
router.post("/session", authToken, (req, res) => {
    mysqlConnection.query(query_incrSession, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});

//ajouter un nouvel étudiant
router.post("/etu", authToken, async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPasswd = await bcrypt.hash(req.body.mdp, salt);
        const etu= {
            id: req.body.id, 
            mdp: hashedPasswd, 
            nom: req.body.nom,
            prenom: req.body.prenom,
            num: req.body.num,
            forma: req.body.forma
        };
        mysqlConnection.query(query_inserEtu, 
            [etu.id, etu.mdp, etu.nom, etu.prenom, etu.num, etu.forma],
            (err, rows, fields)=>{
            if(!err){
                res.status(201).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});



//ajouter un nouvel enseignant
router.post("/ens", authToken, async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPasswd = await bcrypt.hash(req.body.mdp, salt);
        const ens= {
            id: req.body.id, 
            mdp: hashedPasswd, 
            nom: req.body.nom,
            prenom: req.body.prenom,
            num: req.body.num
        };
        mysqlConnection.query(query_inserEns, 
            [ens.id, ens.mdp, ens.nom, ens.prenom, ens.num],
             (err, rows, fields)=>{
            if(!err){
                res.status(201).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//ajouter une nouvelle université
router.post("/univ", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_inserUniv, 
            [req.body.id, req.body.nom],
            (err, rows, fields)=>{
            if(!err){
                res.status(201).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//ajouter une nouvelle fac
router.post("/fac", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_inserFac, 
            [req.body.id, req.body.idUniv, req.body.nom],
            (err, rows, fields)=>{
            if(!err){
                res.status(201).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//ajouter un nouveau département
router.post("/dep", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_inserDep, 
            [req.body.id, req.body.idFac, req.body.nom],
            (err, rows, fields)=>{
            if(!err){
                res.status(201).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//ajouter une nouvelle formation
router.post("/forma", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_inserForma, 
            [req.body.id, req.body.idDep, req.body.nom, req.body.credit, req.body.numEns],
            (err, rows, fields)=>{
            if(!err){
                res.status(201).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//ajouter un nouveau module
router.post("/mod", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_inserMod, 
            [req.body.id, req.body.idForma, req.body.nom, req.body.semestre, req.body.credit],
            (err, rows, fields)=>{
            if(!err){
                res.status(201).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//ajouter un nouvel enseignement
router.post("/ensgmt", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_inserEnsgmt, 
            [req.body.id, req.body.idMod, req.body.numEns, req.body.nom, req.body.tp, req.body.cc, req.body.exam],
            (err, rows, fields)=>{
            if(!err){
                res.status(201).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//inserer toutes les notes du semestre donné dans la table archive
router.post("/archive", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_inserArchive,
            (err, rows, fields)=>{
            if(!err){
                res.status(201).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});

//supprimer une université avec son id
router.post("/univ/del", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_delUniv,
            [req.body.id], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//supprimer une fac avec son id
router.post("/fac/del", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_delFac,
            [req.body.id], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//supprimer un département avec son id
router.post("/dep/del", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_delDep,
            [req.body.id], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//supprimer un enseignant avec son id
router.post("/ens/del", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_delEns,
            [req.body.id], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//supprimer une formation avec son id
router.post("/forma/del", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_delForm,
            [req.body.id], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//supprimer un module avec son id
router.post("/mod/del", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_delMod,
            [req.body.id], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//supprimer un enseignement avec son id
router.post("/ensgmt/del", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_delEnsgmt,
            [req.body.id], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//supprimer un étudiant avec son id
router.post("/etu/del", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_delEtu,
            [req.body.id], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});

//supprimer les archives d'une année universitaire
router.post("/archive/del", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_delArchive,
            [req.body.anneeUniv], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});

//obtenir toute les universités
router.get("/univ/all", authToken, (req, res) => {
    mysqlConnection.query(query_getUniv, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});

//obtenir toute les facultés
router.get("/fac/all", authToken, (req, res) => {
    mysqlConnection.query(query_getFac, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});

//obtenir tout les départements
router.get("/dep/all", authToken, (req, res) => {
    mysqlConnection.query(query_getDep, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});

//obtenir toute les formations
router.get("/forma/all", authToken, (req, res) => {
    mysqlConnection.query(query_getForma, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});

//obtenir toute les formations
router.get("/forma/all/modify", authToken, (req, res) => {
    mysqlConnection.query(query_getFormaMod, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});


//obtenir tout les modules
router.get("/mod/all", authToken, (req, res) => {
    mysqlConnection.query(query_getMod, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});

//obtenir tout les enseignements
router.get("/enseign/all", authToken, (req, res) => {
    mysqlConnection.query(query_getEnsgmt, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});


//obtenir tout les étudiants
router.get("/etu/all", authToken, (req, res) => {
    mysqlConnection.query(query_getEtu, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});

//obtenir tout les étudiants
router.get("/ens/all", authToken, (req, res) => {
    mysqlConnection.query(query_getEns, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});


//obtenir toutes les archives
router.get("/archive/all", authToken, (req, res) => {
    mysqlConnection.query(query_getArchive, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else {
            res.status(500).send(err);
        }

    })
});



//modifier une univ selon son id
router.put("/univ", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_updateUniv,
            [req.body.id, req.body.nom], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//modifier une fac selon son id
router.put("/fac", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_updateFac,
            [req.body.id, req.body.nom, req.body.idUniv], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//modifier un dep selon son id
router.put("/dep", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_updateDep,
            [req.body.id, req.body.nom, req.body.idFac], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//modifier un enseignant selon son numéro
router.put("/ens", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_updateEns,
            [req.body.num, req.body.id, req.body.nom, req.body.prenom], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//modifier une formation selon son id
router.put("/forma", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_updateForm,
            [req.body.id, req.body.nom, req.body.nom, req.body.idDep, req.body.credit, req.body.numEns], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//modifier un module selon son id
router.put("/mod", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_updateMod,
            [req.body.id, req.body.nom, req.body.idForm, req.body.semestre, req.body.credit], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//modifier un enseignement selon son numéro
router.put("/ensgmt", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_updateEnsgmt,
            [req.body.id, req.body.id, req.body.num, req.body.idMod, req.body.nom, req.body.coeffTP, req.body.coeffCC, req.body.coeffExam], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//modifier un etu selon son numéro
router.put("/etu", authToken, (req, res) => {
    try { 
        mysqlConnection.query(query_updateEtu,
            [req.body.num, req.body.id, req.body.nom, req.body.prenom, req.body.forma], 
            (err, rows, fields)=>{
            if(!err){
                res.status(200).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


//Ajout d'admin (A SUPPRIMER PLUS TARD)
router.post("/admin", async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPasswd = await bcrypt.hash(req.body.mdp, salt);
        const ens= {
            num: req.body.num,
            id: req.body.id, 
            mdp: hashedPasswd, 
        };
        mysqlConnection.query("insert into Admin values(" 
        + "'"+ens.num + "'" + "," + "'" + ens.id + "'" + "," 
        + "'" + ens.mdp + "'" + ")", (err, rows, fields)=>{
            if(!err){
                res.status(201).send();;
            } else {
                res.status(500).send(err);
            }
        }); 
    } catch {
        res.status(500).send('Erreur');
    }          
});


module.exports = router;
