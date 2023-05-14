import React,{ useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';



const EnsCRUD =() => {
    const[dataList, setDataList] = useState([]);

    const[numEns, setNumEns] = useState("");
    const[idEns, setIdEns] = useState("");
    const[nomEns, setNomEns] = useState("");
    const[prenomEns, setPrenomEns] = useState("");
    const[motDePasse, setMotDePasse] = useState("");
    const[method,setMethod] = useState("");

    const openExitAddEns = () => {
        document.querySelector('.cover-all').classList.toggle('show');
    
        //état par défaut des forms
        document.querySelector("#editForm").style.display = "none";
        document.querySelector("#addForm").style.display = "block";

        setNumEns("");
        setIdEns("");
        setNomEns("");
        setPrenomEns("");
        setMotDePasse("");
        clearAddForm();
        setMethod("Ajouter");

    }

    const handleSubmitAddEtud =  type => async(e) => {
        e.preventDefault();

        const data = {
             id: idEns,
             mdp: motDePasse,
             nom: nomEns,
             prenom: prenomEns,
             num: numEns
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }

        if(type === "add") {
            axios.post('api/ens',data,options)
            .then(res=> {
                openExitAddEns();  
                updateList();
                clearAddForm();
                window.M.toast({ html: 'Enseignant ajouté avec succés' , classes:'teal lighten-2 rounded '},2500);
                
            }).catch( err => {
                //tester si le id entré est éxiste déja et le num aussi
                const idIdExist = dataList.filter(v => v.idEnseignant  === data.id);
                const numIsExist = dataList.filter(v => v.numEns  === data.num);
                if(idIdExist.length !== 0) { // ici on  trouvé l'id dans la liste ddes université 
                    window.M.toast({ html: 'l\'id que vous avez entré existe déja !' , classes:'  rounded red '},2500)
                } else if(numIsExist.length !== 0) { 
                    window.M.toast({ html: 'le numéro que vous avez entré existe déja !' , classes:'  rounded red '},2500)
                }
                else {
                    window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
                }
            });
        } else {
            axios.put('api/ens',data,options)
            .then(res=> {
                openExitAddEns();  
                updateList();
                window.M.toast({ html: 'Enseignant modifié avec succés' , classes:'teal lighten-2 rounded '},2500);
    
            }).catch( err => {
                window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
            });
        }
    };

    //supprimer un Enseignant  
    const deleteEns =  async(e) => {
        e.preventDefault();

        const data = {
            id: idEns,
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        axios.post('api/ens/del',data,options)
        .then(res=> {
            openExitAddEns();  
            updateList();
            window.M.toast({ html: 'Enseignant modifié avec succés' , classes:'teal lighten-2 rounded '},2500);

        }).catch( err => {
            window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
        });
    };

    const openEditEns = (e) => {
        e.preventDefault();

        axios.get('api/ens/all').then(res=> {
            const result = res.data.filter(v => v.idEnseignant === idEns);
            console.log(res.data);
            //obtenir les information de l'université 
            setNumEns(result[0].numEns);
            setIdEns(result[0].idEnseignant);
            setNomEns(result[0].nomEns);
            setPrenomEns(result[0].prenomEns);
            setMotDePasse(result[0].motDePasse);
            setMethod("Modifier");
        });

        //afficher le formulaire de la modification
        document.querySelector('.cover-all').classList.toggle('show');
        document.querySelector("#addForm").style.display = "none";
        document.querySelector("#editForm").style.display = "block";

    }

    useEffect(() => {
        document.title="Enseignants - Admin";
        axios.get('api/ens/all').then(res=> {
            setDataList(res.data)
        });
    },[]);

    const updateList = () =>  {
        axios.get('api/ens/all').then(res=> {
            setDataList(res.data)
        });
    }

    const clearAddForm = ()=> {
         const allInputs = document.querySelectorAll('#addForm input');

         allInputs.forEach ( input => {
                 input.value = "";  
         });

         var select = document.querySelector("#addFormSelect");
         
         select.options[0].selected = true;
    }

    if(localStorage.getItem('token')) {
        return(
            <>
                <div class="container">
                    <h4>Liste des Enseignants dans la base de donées :</h4>
                    <table class ="highlight stripped">
                        <thead>
                            <tr class="grey lighten-2">
                                <th>N°</th>
                                <th>Identifiant</th>
                                <th>Nom</th>
                                <th>Prenom</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="grey lighten-3">          
                            {dataList.map((val)=> {
                                return (
                                        <tr>
                                            <td>{val.numEns}</td>
                                            <td>{val.idEnseignant}</td>
                                            <td>{val.nomEns}</td>
                                            <td>{val.prenomEns}</td>
                                            <td className="iconsTd"> 
                                                <form onSubmit={deleteEns}>
                                                    <input id={val.idEnseignant} type="hidden" value={val.idEnseignant} />
                                                    <button type="submit"  onClick={e => setIdEns(document.getElementById(""+val.idEnseignant).value)}><i class="fas fa-trash-alt"/></button>    
                                                </form>   
                                                <form onSubmit={openEditEns}>
                                                    <input id={val.idEnseignant} type="hidden" value={val.idEnseignant} />
                                                    <button type="submit"  onClick={e => setIdEns(document.getElementById(""+val.idEnseignant).value)}><i class="fa-solid fa-pen-to-square"/></button>    
                                                </form>                                               
                                             </td>
                                        </tr>
                                )
                             })}
                        </tbody>
                    </table>
                    <div className="add-admin-icon">
                        
                        <i className="fa-solid fa-circle-plus" onClick={openExitAddEns}></i>
                        <span >Ajouter un enseignant</span>
                    
                    </div>
                    <div className="cover-all">
                        <div class="col s12 m6">
                            <div class="card white">
                                <div class="card-content black-text">
                                    <span class="card-title center crufFormSpan">{method} un enseignant</span>
                                    <form onSubmit={handleSubmitAddEtud("add")} id="addForm">
                                        <i class="fas fa-times" onClick={openExitAddEns}></i>
                                        <div class="group"> 
                                            <label>N°</label>
                                            <input type="text" required autoFocus onChange={e => setNumEns(e.target.value)}/>      
                                        </div> 
                                        <div class="group"> 
                                            <label>Identifiant</label>
                                            <input type="text" required autoFocus onChange={e => setIdEns(e.target.value)}/>      
                                        </div>   
                                        <div class="group"> 
                                            <label>Nom</label>
                                            <input type="text" required autoFocus onChange={e => setNomEns(e.target.value)}/>      
                                        </div>   
                                        <div class="group"> 
                                            <label>Prénom</label>
                                            <input type="text" required autoFocus onChange={e => setPrenomEns(e.target.value)}/>      
                                        </div>  
                                        <div class="group"> 
                                            <label>Mot de passe</label>
                                            <input type="password" required autoFocus onChange={e => setMotDePasse(e.target.value)}/>      
                                        </div>
                                        <div class="left-align">
                                            <button class="btn">Ajouter</button>
                                        </div>
                                    </form>   
                                <form onSubmit={handleSubmitAddEtud("edit")} id="editForm">
                                    <i class="fas fa-times" onClick={openExitAddEns}></i>
                                    <div class="group"> 
                                        <label>N°</label>
                                            <input type="text" value={numEns} required autoFocus disabled onChange={e => setNumEns(e.target.value)}/>      
                                    </div> 
                                    <div class="group"> 
                                        <label>Identifiant</label>
                                        <input type="text" value={idEns} required autoFocus onChange={e => setIdEns(e.target.value)}/>      
                                    </div>   
                                    <div class="group"> 
                                        <label>Nom</label>
                                        <input type="text" value={nomEns} required autoFocus onChange={e => setNomEns(e.target.value)}/>      
                                    </div>   
                                    <div class="group"> 
                                        <label>Prénom</label>
                                        <input type="text" value={prenomEns} required autoFocus onChange={e => setPrenomEns(e.target.value)}/>      
                                    </div>  
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    } else {
        return(<Navigate to="/admin"></Navigate>);
    }
};

export default EnsCRUD;
