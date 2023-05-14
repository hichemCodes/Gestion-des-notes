import React,{ useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';



const ModCRUD =() => {
    const[dataList, setDataList] = useState([]);
    const[dataListForma, setDataListForma] = useState([]);

    const[numMod, setNumMod] = useState("");
    const[idForma, setidForma] = useState("");
    const[nom, setNom] = useState("");
    const[credit, setcredit] = useState("");
    const[semestre, setSemestre] = useState("");
    const[method,setMethod] = useState("");


    const openExitAddForma = () => {
        document.querySelector('.cover-all').classList.toggle('show');
         
        //état par défaut des forms
        document.querySelector("#editForm").style.display = "none";
        document.querySelector("#addForm").style.display = "block";

        setNumMod("");
        setidForma("");
        setNom("");
        setcredit("");
        setSemestre("");
        clearAddForm();
        setMethod("Ajouter");
    }

    const handleSubmitAddForma =  type => async(e) => {
        e.preventDefault();

        const data = {
             id: numMod,
             idForma: idForma,
             nom: nom,
             semestre: parseInt(semestre,10),
             credit: parseInt(credit,10)
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        if(type === "add") {
            axios.post('api/mod',data,options)
            .then(res=> {
                openExitAddForma();  
                updateList();
                clearAddForm();
                window.M.toast({ html: 'Module ajouté avec succés' , classes:'teal lighten-2 rounded '},2500);
            }).catch( err => {
                //tester si le id entré est éxiste déja
                const idIdExist = dataList.filter(v => v.idModule  === data.id);
                if(idIdExist.length != 0) { // ici on  trouvé l'id dans la liste des modules 
                    window.M.toast({ html: 'l\'id que vous avez entré existe déja !' , classes:'  rounded red '},2500)
                } else {
                    window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
                }
            });
        } else {
            axios.put('api/mod',data,options)
            .then(res=> {
                openExitAddForma();  
                updateList();
                window.M.toast({ html: 'Module modifié avec succés' , classes:'teal lighten-2 rounded '},2500);
            }).catch( err => {
                window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
            });
        }
    };

    //supprimer un Module 
    const deleteMod =  async(e) => {
        e.preventDefault();

        const data = {
             id: numMod,
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        axios.post('api/mod/del',data,options)
        .then(res=> {
            updateList();
            window.M.toast({ html: 'Module supprimé avec succés' , classes:'teal lighten-2 rounded '},2500);
        }).catch( err => {
            window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
        });
    };

    const openEditMod = (e) => {
        e.preventDefault();

        axios.get('api/mod/all').then(res=> {
            const result = res.data.filter(v => v.idModule === numMod);
            console.log(res.data);
            //obtenir les information de l'université 
            setNumMod(result[0].idModule);
            setidForma(result[0].idForma);
            setNom(result[0].nomModule);
            setcredit(result[0].creditModule);
            setSemestre(result[0].semestre);
            setMethod("Modifier");

        });

        //afficher le formulaire de la modification
        document.querySelector('.cover-all').classList.toggle('show');
        document.querySelector("#addForm").style.display = "none";
        document.querySelector("#editForm").style.display = "block";

    }

    useEffect(() => {
        document.title="Modules - Admin";
        axios.get('api/mod/all').then(res=> {
            setDataList(res.data)
        });

        axios.get('api/forma/all').then(res=> {
            setDataListForma(res.data)
         });
    },[]);

    const updateList = () =>  {
        axios.get('api/mod/all').then(res=> {
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
                    <h4>Liste des modules dans la base de donées :</h4>
                    <table class ="highlight stripped">
                        <thead>
                            <tr class="grey lighten-2">
                                <th>N°</th>
                                <th>Intitulé</th>
                                <th>Semestre</th>
                                <th>Crédits</th>
                                <th>N°Formation</th>
                                <th>Formation</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="grey lighten-3">          
                            {dataList.map((val)=> {
                                return (
                                        <tr>
                                            <td>{val.idModule}</td>
                                            <td>{val.nomModule}</td>
                                            <td>{val.semestre}</td>
                                            <td>{val.creditModule}</td>
                                            <td>{val.idForma}</td>
                                            <td>{val.nomForma}</td>
                                            <td className="iconsTd">
                                                <form onSubmit={deleteMod}>
                                                    <input id={val.idModule} type="hidden" value={val.idModule} />
                                                    <button type="submit"  onClick={e => setNumMod(document.getElementById(""+val.idModule).value)}><i class="fas fa-trash-alt"/></button>    
                                                </form>  
                                                <form onSubmit={openEditMod}>
                                                    <input id={val.idModule} type="hidden" value={val.idModule} />
                                                    <button type="submit"  onClick={e => setNumMod(document.getElementById(""+val.idModule).value)}><i class="fa-solid fa-pen-to-square"></i></button>    
                                                </form>                                               
                                             </td>
                                        </tr>
                                )
                             })}
                        </tbody>
                    </table>
                    <div className="add-admin-icon">
                        
                      <i className="fa-solid fa-circle-plus" onClick={openExitAddForma}></i>
                      <span >Ajouter un module</span>
                  
                    </div>
                    <div className="cover-all">
                        <div class="col s12 m6">
                                <div class="card white">
                                    <div class="card-content black-text">
                                        <span class="card-title center crufFormSpan">{method} un module</span>
                                        <form onSubmit={handleSubmitAddForma("add")} id="addForm">
                                                <i class="fas fa-times" onClick={openExitAddForma}></i>
                                                <div class="group"> 
                                                    <label>N module</label>
                                                    <input type="text" required autoFocus onChange={e => setNumMod(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Intitulé</label>
                                                    <input type="text" required autoFocus onChange={e => setNom(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>semestre</label>
                                                    <input type="text" required autoFocus onChange={e => setSemestre(e.target.value)}/>      
                                                </div>  
                                                <div class="group"> 
                                                    <label>Crédit</label>
                                                    <input type="text" required autoFocus onChange={e => setcredit(e.target.value)}/>      
                                                </div>   
                                               
                                               

                                                 <div class="group">
                                                    <label>Nom de formation</label>

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

                                            <form onSubmit={handleSubmitAddForma("edit")} id="editForm">
                                                <i class="fas fa-times" onClick={openExitAddForma}></i>
                                                <div class="group"> 
                                                    <label>N module</label>
                                                    <input type="text" value={numMod} required autoFocus disabled onChange={e => setNumMod(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Intitulé</label>
                                                    <input type="text" value={nom} required autoFocus onChange={e => setNom(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>semestre</label>
                                                    <input type="text" value={semestre} required autoFocus onChange={e => setSemestre(e.target.value)}/>      
                                                </div>  
                                                <div class="group"> 
                                                    <label>Crédit</label>
                                                    <input type="text" value={credit} required autoFocus onChange={e => setcredit(e.target.value)}/>      
                                                </div>   
                                               
                                               

                                                 <div class="group">
                                                    <label>Nom de formation</label>

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

export default ModCRUD;