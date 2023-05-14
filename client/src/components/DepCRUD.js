import React,{ useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';



const DepCRUD =() => {
    const[dataList, setDataList] = useState([]);
    const[dataListFac, setDataListFac] = useState([]);
    const[idDepartement, setidDepartement] = useState("");
    const[nomDepartement, setnomDepartement] = useState("");
    const[idFac, setidFac] = useState("");
    const[method,setMethod] = useState("");


    const openExitAddFac = () => {
         document.querySelector('.cover-all').classList.toggle('show');
         
        //état par défaut des forms
        document.querySelector("#editForm").style.display = "none";
        document.querySelector("#addForm").style.display = "block";
        //state par défaut
        setidDepartement("");
        setnomDepartement("");
        setidFac("");
        clearAddForm();
        setMethod("Ajouter");

    }

    const handleSubmitAddDep =  type => async(e) => {
        e.preventDefault();

        const data = {
             id: idDepartement,
             idFac: idFac,
             nom: nomDepartement
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        if(type === "add") {
            axios.post('api/dep',data,options)
            .then(res=> {
                openExitAddFac();  
                updateList();
                clearAddForm();
                window.M.toast({ html: 'Département ajouté avec succés' , classes:'teal lighten-2 rounded '},2500);
            }).catch( err => {
                //tester si le id entré est éxiste déja
               //tester si le id entré est éxiste déja
               const idIdExist = dataList.filter(v => v.idDepartement  === data.id);
               if(idIdExist.length != 0) { // ici on  trouvé l'id dans la liste ddes université 
                   window.M.toast({ html: 'l\'id que vous avez entré existe déja !' , classes:'  rounded red '},2500)
               } else {
                   window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
               }
            });
        } else {
            axios.put('api/dep',data,options)
            .then(res=> {
                openExitAddFac();  
                updateList();
                window.M.toast({ html: 'Département modifié avec succés' , classes:'teal lighten-2 rounded '},2500);
            }).catch( err => {
                window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
            });
        }
    };

    //supprimer un Département 
    const deletDep =  async(e) => {
        e.preventDefault();

        const data = {
                id: idDepartement,
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        axios.post('api/dep/del',data,options)
        .then(res=> {
            updateList();
            window.M.toast({ html: 'Département supprimé avec succés' , classes:'teal lighten-2 rounded '},2500);
        }).catch( err => {
            window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
        });
    };
    const openEditDep = (e) => {
        e.preventDefault();

        axios.get('api/dep/all').then(res=> {
            const result = res.data.filter(v => v.idDepartement  === idDepartement);
            console.log(res.data);
            //obtenir les information de l'université 
            setidDepartement(result[0].idDepartement);
            setnomDepartement(result[0].nomDepartement);
            setidFac(result[0].idFac);
            setMethod("Modifier");

        });

        //afficher le formulaire de la modification
        document.querySelector('.cover-all').classList.toggle('show');
        document.querySelector("#addForm").style.display = "none";
        document.querySelector("#editForm").style.display = "block";
        
    }
        
    useEffect(() => {
        document.title="Département - Admin";
        axios.get('api/dep/all').then(res=> {
            setDataList(res.data)
        });

        axios.get('api/fac/all').then(res=> {
            setDataListFac(res.data)
        });
        
    },[]);

    const updateList = () =>  {
        axios.get('api/dep/all').then(res=> {
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
                    <h4>Liste des Départements dans la base de donées :</h4>
                    <table class ="highlight stripped">
                        <thead>
                            <tr class="grey lighten-2">
                                <th>N°</th>
                                <th>Nom</th>
                                <th>Faculté</th>
                                <th>N°Faculté</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="grey lighten-3">          
                            {dataList.map((val)=> {
                                return (
                                        <tr>
                                            <td>{val.idDepartement}</td>
                                            <td>{val.nomDepartement}</td>
                                            <td>{val.nomFac}</td>
                                            <td>{val.idFac}</td>
                                            <td className="iconsTd">
                                                <form onSubmit={deletDep}>
                                                    <input id={val.idDepartement} type="hidden" value={val.idDepartement} />
                                                    <button type="submit"  onClick={e => setidDepartement(document.getElementById(""+val.idDepartement).value)}><i class="fas fa-trash-alt"/></button>    
                                                </form> 
                                                <form onSubmit={openEditDep}>
                                                    <input id={val.idDepartement} type="hidden" value={val.idDepartement} />
                                                    <button type="submit"  onClick={e => setidDepartement(document.getElementById(""+val.idDepartement).value)}><i class="fa-solid fa-pen-to-square"/></button>    
                                                </form>                                               
                                             </td>
                                        </tr>
                                )
                             })}
                        </tbody>
                    </table>
                    <div className="add-admin-icon">
                        
                      <i className="fa-solid fa-circle-plus" onClick={openExitAddFac}></i>
                      <span >Ajouter un département</span>
                  
                    </div>
                    <div className="cover-all">
                        <div class="col s12 m6">
                                <div class="card white">
                                    <div class="card-content black-text">
                                        <span class="card-title center crufFormSpan">{method} un département</span>
                                        <form onSubmit={handleSubmitAddDep("add")} id="addForm">
                                                <i class="fas fa-times" onClick={openExitAddFac}></i>
                                                <div class="group"> 
                                                    <label>N° Département</label>
                                                    <input type="text" required autoFocus onChange={e => setidDepartement(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Nom du Département</label>
                                                    <input type="text" required autoFocus onChange={e => setnomDepartement(e.target.value)}/>      
                                                </div>   
                                                <div class="group">
                                                    <label>Faculté</label>

                                                    <select className="crud-select" id="addFormSelect" onChange={e => setidFac(e.target.value)} >
                                                        <option value="" disabled selected>Séléctionnez la facuté</option>
                                                        {dataListFac.map((val)=> {
                                                            return (
                                                                <option value={val.idFac}>{val.nomFac}</option>
                                                            )
                                                        })}
                                                    </select>
                                                    </div>
                                                <div class="left-align">
                                                    <button class="btn">Ajouter</button>
                                                </div>
                                            </form>

                                            <form onSubmit={handleSubmitAddDep("edit")} id="editForm">
                                                <i class="fas fa-times" onClick={openExitAddFac}></i>
                                                <div class="group"> 
                                                    <label>N° Département</label>
                                                    <input type="text" value={idDepartement} required autoFocus disabled onChange={e => setidDepartement(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Nom du Département</label>
                                                    <input type="text" value={nomDepartement} required autoFocus onChange={e => setnomDepartement(e.target.value)}/>      
                                                </div>   
                                                <div class="group">
                                                    <label>Faculté</label>

                                                    <select className="crud-select" onChange={e => setidFac(e.target.value)}>
                                                        <option value="" disabled selected>Séléctionnez la facuté</option>
                                                        {dataListFac.map((val)=> {
                                                            if( val.idFac === idFac) {
                                                                return (<option  value={val.idFac} selected>{val.nomFac}</option>)
                                                             } else {
                                                                return (<option value={val.idFac}>{val.nomFac}</option>)
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

export default DepCRUD;