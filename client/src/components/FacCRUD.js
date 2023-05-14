import React,{ useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';
import '../style/admin.css'


const FacCRUD =() => {
    const[dataList, setDataList] = useState([]);
    const[dataListUniv, setDataListUniv] = useState([]);
    const[idFac, setidFac] = useState("");
    const[idUniversite, setidUniversite] = useState("");
    const[nomFac, setnomFac] = useState("");
    const[method,setMethod] = useState("");

    

    const openExitAddFac = () => {
        document.querySelector('.cover-all').classList.toggle('show');
         
        //état par défaut des forms
        document.querySelector("#editForm").style.display = "none";
        document.querySelector("#addForm").style.display = "block";
        //state par défaut
        setidUniversite("");
        setidFac("");
        setnomFac("");
        clearAddForm();
        setMethod("Ajouter");
    }

    const handleSubmitAddFac =  type => async(e) => {
        e.preventDefault();

        const data = {
             id: idFac,
             nom: nomFac,
             idUniv: idUniversite
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        if(type === "add") {
            axios.post('api/fac',data,options)
            .then(res=> {
                openExitAddFac();  
                updateList();
                clearAddForm();
                window.M.toast({ html: 'Faculté ajoutée avec succés' , classes:'teal lighten-2 rounded '},2500);

            }).catch( err => {
                //tester si le id entré est éxiste déja
                const idIdExist = dataList.filter(v => v.idFac  === data.id);
                if(idIdExist.length != 0) { // ici on  trouvé l'id dans la liste ddes université 
                    window.M.toast({ html: 'l\'id que vous avez entré existe déja !' , classes:'  rounded red '},2500)
                } else {
                    window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
                }
            });
        } else {
            axios.put('api/fac',data,options)
            .then(res=> {
                openExitAddFac();  
                updateList();
                window.M.toast({ html: 'Faculté modifiée avec succés' , classes:'teal lighten-2 rounded '},2500);
            }).catch( err => {
                window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
            });
        }
    };

    //supprimer une Faculté 
    const deleteFac =  (e) => {
        e.preventDefault();
        axios.post('api/fac/del', {id: idFac}, {headers: {"content-type": "application/json"}})
        .then(res=> {
            updateList();
            window.M.toast({ html: 'Faculté supprimée avec succés' , classes:'teal lighten-2 rounded '},2500);
        }).catch( err => {
            window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
        });
    };
    

    const openEditFac = (e) => {
        e.preventDefault();

        axios.get('api/fac/all').then(res=> {
            const result = res.data.filter(v => v.idFac  === idFac);
            console.log(res.data);
            //obtenir les information de l'université 
            setidFac(result[0].idFac);
            setnomFac(result[0].nomFac);
            setidUniversite(result[0].idUniversite);
            setMethod("Modifier");

        });

        //afficher le formulaire de la modification
        document.querySelector('.cover-all').classList.toggle('show');
        document.querySelector("#addForm").style.display = "none";
        document.querySelector("#editForm").style.display = "block";

        

    }

    const updateList = () =>  {
        axios.get('api/fac/all').then(res=> {
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

    useEffect(() => {
        document.title="Facultées - Admin";
        document.addEventListener('DOMContentLoaded', function() {
            
        });

        axios.get('api/fac/all').then(res=> {
            setDataList(res.data);
        });
        axios.get('api/univ/all').then(res=> {
            setDataListUniv(res.data)
         });

    },[]);



    if(localStorage.getItem('token')) {
        return(
            <>
                <div class="container">
                    <h4>Liste des Facultés dans la base de donées :</h4>
                    <table class ="highlight stripped">
                        <thead>
                            <tr class="grey lighten-2">
                                <th>N°</th>
                                <th>Nom</th>
                                <th>Université</th>
                                <th>N°Université</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="grey lighten-3">          
                            {dataList.map((val)=> {
                                return (
                                        <tr>
                                            <td>{val.idFac}</td>
                                            <td>{val.nomFac}</td>
                                            <td>{val.nomUniversite}</td>
                                            <td>{val.idUniversite}</td>
                                            <td className="iconsTd">
                                                <form onSubmit={deleteFac}>
                                                    <input id={val.idFac} type="hidden" value={val.idFac} />
                                                    <button type="submit"  onClick={e => setidFac(document.getElementById(""+val.idFac).value)}><i class="fas fa-trash-alt"/></button>    
                                                </form>  

                                                 <form onSubmit={openEditFac}>
                                                    <input id={val.idFac} type="hidden" value={val.idFac} />
                                                    <button type="submit"  onClick={e => setidFac(document.getElementById(""+val.idFac).value)}><i class="fa-solid fa-pen-to-square"></i></button>    
                                                </form>  

                                             </td>
                                        </tr>
                                )
                             })}
                        </tbody>
                    </table>
                    <div className="add-admin-icon">
                        
                      <i className="fa-solid fa-circle-plus" onClick={openExitAddFac}></i>
                      <span >Ajouter une faculté</span>
                  
                    </div>
                    <div className="cover-all">
                        <div class="col s12 m6">
                                <div class="card white">
                                    <div class="card-content black-text">
                                        <span class="card-title center crufFormSpan">{method} une faculté</span>
                                        <form onSubmit={handleSubmitAddFac("add")} id="addForm">
                                                <i class="fas fa-times" onClick={openExitAddFac}></i>
                                                <div class="group"> 
                                                    <label>Id Faculté</label>
                                                    <input type="text" required autoFocus onChange={e => setidFac(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Nom du faculté</label>
                                                    <input type="text" required autoFocus onChange={e => setnomFac(e.target.value)}/>      
                                                </div>   
                                                <div class="group">
                                                    <label>Nom de l'université</label>

                                                    <select className="crud-select" id="addFormSelect" onChange={e => setidUniversite(e.target.value)}>
                                                        <option value="" disabled selected>Séléctionnez l'université</option>
                                                        {dataListUniv.map((val)=> {
                                                            return (
                                                                <option value={val.idUniversite}>{val.nomUniversite}</option>
                                                            )
                                                        })}
                                                        
                                                    </select>
                                                    </div>
                                                <div class="left-align">
                                                    <button class="btn">Ajouter</button>
                                                </div>
                                            </form>

                                            <form onSubmit={handleSubmitAddFac("edit")} id="editForm">
                                                <i class="fas fa-times" onClick={openExitAddFac}></i>
                                                <div class="group"> 
                                                    <label>Id Faculté</label>
                                                    <input type="text" required autoFocus disabled value={idFac} onChange={e => setidFac(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Nom du faculté</label>
                                                    <input type="text" value={nomFac} required autoFocus onChange={e => setnomFac(e.target.value)}/>      
                                                </div>   
                                                <div class="group">
                                                    <label>Nom de l'université</label>

                                                    <select className="crud-select" onChange={e => setidUniversite(e.target.value)}>
                                                        {dataListUniv.map((val)=> {
                                                            if( val.idUniversite === idUniversite) {
                                                                return (<option  value={val.idUniversite} selected>{val.nomUniversite}</option>)
                                                            } else {
                                                                return (<option value={val.idUniversite}>{val.nomUniversite}</option>)
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

export default FacCRUD;