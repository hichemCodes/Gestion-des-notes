import React,{ useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';



const EtuCRUD =() => {
    const[dataList, setDataList] = useState([]);
    const[dataListForma, setDataListForma] = useState([]);

    const[numEtud, setNumEtud] = useState("");
    const[idEtud, setIdEtud] = useState("");
    const[nomEtud, setNomEtud] = useState("");
    const[prenomEtud, setPrenomEtud] = useState("");
    const[motDePasse, setMotDePasse] = useState("");
    const[idForma, setidForma] = useState("");
    const[method,setMethod] = useState("");


    const openExitAddEtu = () => {
        document.querySelector('.cover-all').classList.toggle('show');
        
        //état par défaut des forms
        document.querySelector("#editForm").style.display = "none";
        document.querySelector("#addForm").style.display = "block";

        setNumEtud("");
        setIdEtud("");
        setNomEtud("");
        setPrenomEtud("");
        setMotDePasse("");
        setidForma("");
        clearAddForm();
        setMethod("Ajouter");

    }

    const handleSubmitAddEtud =  type => async(e) => {
        e.preventDefault();

        const data = {
             id: idEtud,
             mdp: motDePasse,
             nom: nomEtud,
             prenom: prenomEtud,
             num: numEtud,
             forma: idForma
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        if(type === "add") {
            axios.post('api/etu',data,options)
            .then(res=> {
                openExitAddEtu();  
                updateList();
                clearAddForm();
                window.M.toast({ html: 'Étudiant ajouté avec succés' , classes:'teal lighten-2 rounded '},2500);
                
            }).catch( err => {
                //tester si le id entré est éxiste déja et le num aussi
                const idIdExist = dataList.filter(v => v.idEtu  === data.id);
                const numIsExist = dataList.filter(v => v.numEtu  === data.num);
                if(idIdExist.length != 0) { // ici on  trouvé l'id dans la liste ddes université 
                    window.M.toast({ html: 'l\'id que vous avez entré existe déja !' , classes:'  rounded red '},2500)
                } else if(numIsExist.length != 0) { 
                    window.M.toast({ html: 'le numéro que vous avez entré existe déja !' , classes:'  rounded red '},2500)
                }
                else {
                    window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
                }
            });
        } else {
            axios.put('api/etu',data,options)
            .then(res=> {
                openExitAddEtu();  
                updateList();
                window.M.toast({ html: 'Étudiant modifié avec succés' , classes:'teal lighten-2 rounded '},2500);
    
            }).catch( err => {
                window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
            });
        }
        
    };

    //supprimer un Étudiant 
    const deletEtud =  async(e) => {
        e.preventDefault();

        const data = {
                id: idEtud,
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        axios.post('api/etu/del',data,options)
        .then(res=> {
            updateList();
            window.M.toast({ html: 'Étudiant supprimé avec succés' , classes:'teal lighten-2 rounded '},2500);
        }).catch( err => {
            window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
        });
    };

    const openEditEtu = (e) => {
        e.preventDefault();

        axios.get('api/etu/all').then(res=> {
            const result = res.data.filter(v => v.idEtu === idEtud);
            console.log(res.data);
            //obtenir les information de l'université 
            setNumEtud(result[0].numEtu);
            setIdEtud(result[0].idEtu);
            setNomEtud(result[0].nomEtu);
            setPrenomEtud(result[0].prenomEtu);
            setMotDePasse(result[0].motDePasse);
            setidForma(result[0].idForma);
            setMethod("Modifier");

        });

        //afficher le formulaire de la modification
        document.querySelector('.cover-all').classList.toggle('show');
        document.querySelector("#addForm").style.display = "none";
        document.querySelector("#editForm").style.display = "block";

    }

    useEffect(() => {
        document.title="Etudiants - Admin";
        axios.get('api/etu/all').then(res=> {
            setDataList(res.data)
        });

        axios.get('api/forma/all').then(res=> {
            setDataListForma(res.data)
        });
    },[]);

    const updateList = () =>  {
        axios.get('api/etu/all').then(res=> {
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
                    <h4>Liste des étudiants dans la base de donées :</h4>
                    <table class ="highlight stripped">
                        <thead>
                            <tr class="grey lighten-2">
                                <th>N°</th>
                                <th>Identifiant</th>
                                <th>Nom</th>
                                <th>Prenom</th>
                                <th>Formation</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="grey lighten-3">          
                            {dataList.map((val)=> {
                                return (
                                        <tr>
                                            <td>{val.numEtu}</td>
                                            <td>{val.idEtu}</td>
                                            <td>{val.nomEtu}</td>
                                            <td>{val.prenomEtu}</td>
                                            <td>{val.idForma}</td>
                                            <td className="iconsTd">
                                                <form onSubmit={deletEtud}>
                                                    <input id={val.idEtu} type="hidden" value={val.idEtu} />
                                                    <button type="submit"  onClick={e => setIdEtud(document.getElementById(""+val.idEtu).value)}><i class="fas fa-trash-alt"/></button>    
                                                </form> 
                                                <form onSubmit={openEditEtu}>
                                                    <input id={val.idEtu} type="hidden" value={val.idEtu} />
                                                    <button type="submit"  onClick={e => setIdEtud(document.getElementById(""+val.idEtu).value)}><i class="fa-solid fa-pen-to-square"/></button>    
                                                </form>                                               
                                            </td>
                                        </tr>
                                )
                             })}
                        </tbody>
                    </table>
                    <div className="add-admin-icon">
                        
                      <i className="fa-solid fa-circle-plus" onClick={openExitAddEtu}></i>
                      <span >Ajouter un étudiant</span>
                  
                    </div>
                    <div className="cover-all">
                        <div class="col s12 m6">
                                <div class="card white">
                                    <div class="card-content black-text">
                                        <span class="card-title center crufFormSpan">{method} un étudiant</span>
                                        <form onSubmit={handleSubmitAddEtud("add")} id="addForm">
                                                <i class="fas fa-times" onClick={openExitAddEtu}></i>
                                                <div class="group"> 
                                                    <label>N°</label>
                                                    <input type="text" required autoFocus onChange={e => setNumEtud(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Identifiant</label>
                                                    <input type="text" required autoFocus onChange={e => setIdEtud(e.target.value)}/>      
                                                </div>   
                                                <div class="group"> 
                                                    <label>Nom</label>
                                                    <input type="text" required autoFocus onChange={e => setNomEtud(e.target.value)}/>      
                                                </div>   
                                                <div class="group"> 
                                                    <label>Prénom</label>
                                                    <input type="text" required autoFocus onChange={e => setPrenomEtud(e.target.value)}/>      
                                                </div>  
                                                <div class="group"> 
                                                    <label>Mot de passe</label>
                                                    <input type="password" required autoFocus onChange={e => setMotDePasse(e.target.value)}/>      
                                                </div>   
                                                <div class="group">
                                                    <label>Formation</label>

                                                    <select className="crud-select" id="addFormSelect" onChange={e => setidForma(e.target.value)}>
                                                        <option value="" disabled selected>Séléctionnez la formation</option>
                                                        {dataListForma.map((val)=> {
                                                            return (
                                                                <option value={val.idForma}>{val.nomForma}</option>
                                                            )
                                                        })}
                                                        
                                                    </select>
                                                    </div>
                                                <div class="left-align">
                                                    <button class="btn">Ajouter</button>
                                                </div>
                                            </form>

                                            <form onSubmit={handleSubmitAddEtud("edit")} id="editForm">
                                                <i class="fas fa-times" onClick={openExitAddEtu}></i>
                                                <div class="group"> 
                                                    <label>N°</label>
                                                    <input type="text"  value={numEtud} required disabled autoFocus onChange={e => setNumEtud(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Identifiant</label>
                                                    <input type="text" value={idEtud} required autoFocus onChange={e => setIdEtud(e.target.value)}/>      
                                                </div>   
                                                <div class="group"> 
                                                    <label>Nom</label>
                                                    <input type="text" value={nomEtud} required autoFocus onChange={e => setNomEtud(e.target.value)}/>      
                                                </div>   
                                                <div class="group"> 
                                                    <label>Prénom</label>
                                                    <input type="text" value={prenomEtud} required autoFocus onChange={e => setPrenomEtud(e.target.value)}/>      
                                                </div>  
                                                <div class="group"> 
                                                    <label>Mot de passe</label>
                                                    <input type="password" value={motDePasse} required autoFocus onChange={e => setMotDePasse(e.target.value)}/>      
                                                </div>   
                                                <div class="group">
                                                    <label>Formation</label>

                                                    <select className="crud-select" onChange={e => setidForma(e.target.value)}>
                                                        <option value="" disabled selected>Séléctionnez la formation</option>
                                                        {dataListForma.map((val)=> {
                                                           
                                                            if( val.idForma === idForma) {
                                                                return (<option  value={val.idForma} selected>{val.nomForma}</option>)
                                                            } else {
                                                                return (<option value={val.idForma}>{val.nomForma}</option>)
                                                            }
                                                        })}
                                                        
                                                    </select>
                                                    </div>
                                                <div class="left-align">
                                                    <button class="btn">Modifier</button>
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

export default EtuCRUD;
