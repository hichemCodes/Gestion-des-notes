import React,{ useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';



const FormaCRUD =() => {
    const[dataList, setDataList] = useState([]);
    const[dataListDept, setDataListDept] = useState([]);
    const[dataListEns, setDataListEns] = useState([]);

    const[NumForma, setNumForma] = useState("");
    const[idDept, setidDept] = useState("");
    const[nomForma, setnomForma] = useState("");
    const[credit, setcredit] = useState("");
    const[numEns, setnumEns] = useState("");
    const[idForma, setidForma] = useState("");
    const[method,setMethod] = useState("");


    const openExitAddForma = () => {
         document.querySelector('.cover-all').classList.toggle('show');
         

        //état par défaut des forms
        document.querySelector("#editForm").style.display = "none";
        document.querySelector("#addForm").style.display = "block";

        setNumForma("");
        setidDept("");
        setnomForma("");
        setcredit("");
        setnumEns("");
        setidForma("");
        clearAddForm();
        setMethod("Ajouter");
    }

    const handleSubmitAddForma =  type => async(e) => {
        e.preventDefault();

        const data = {
             id: NumForma,
             idDep: idDept,
             nom: nomForma,
             credit: parseInt(credit,10),
             numEns: numEns

        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        if(type === "add") {
            axios.post('api/forma',data,options)
            .then(res=> {
                openExitAddForma();  
                updateList();
                clearAddForm();
                window.M.toast({ html: 'Formation ajoutée avec succés' , classes:'teal lighten-2 rounded '},2500);
            }).catch( err => {
                //tester si le id entré est éxiste déja
                const idIdExist = dataList.filter(v => v.idForma  === data.id);
                if(idIdExist.length != 0) { // ici on  trouvé l'id dans la liste des formations 
                    window.M.toast({ html: 'l\'id que vous avez entré existe déja !' , classes:'  rounded red '},2500)
                } else {
                    window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
                }
            });
        } else {
            axios.put('api/forma',data,options)
            .then(res=> {
                openExitAddForma();  
                updateList();
                window.M.toast({ html: 'Formation modifiée avec succés' , classes:'teal lighten-2 rounded '},2500);
            }).catch( err => {
                window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
            });
        }
    };

    //supprimer une Formation 
    const deletEtud =  async(e) => {
        e.preventDefault();

        const data = {
                id: idForma,
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        axios.post('api/forma/del',data,options)
        .then(res=> {
            updateList();
            window.M.toast({ html: 'Formation supprimée avec succés' , classes:'teal lighten-2 rounded '},2500);
        }).catch( err => {
            window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
        });
    };

    const openEditForma = (e) => {
        e.preventDefault();

        axios.get('api/forma/all/modify').then(res=> {
            const result = res.data.filter(v => v.idForma === idForma);
            console.log(res.data);
            //obtenir les information de l'université 
           

            setNumForma(result[0].idForma);
            setidDept(result[0].idDepartement);
            setnomForma(result[0].nomForma);
            setcredit(result[0].creditForma);
            setnumEns(result[0].numEns);
            setidForma(result[0].idForma);
            setMethod("Modifier");

        });

        //afficher le formulaire de la modification
        document.querySelector('.cover-all').classList.toggle('show');
        document.querySelector("#addForm").style.display = "none";
        document.querySelector("#editForm").style.display = "block";

    }

    useEffect(() => {
        document.title="Formations - Admin";
        axios.get('api/forma/all').then(res=> {
            setDataList(res.data);
            console.log(res.data)
        });


        axios.get('api/dep/all').then(res=> {
            setDataListDept(res.data)
         });

         axios.get('api/ens/all').then(res=> {
            setDataListEns(res.data);
            console.log(res.data);
         });
    },[]);

    const updateList = () =>  {
        axios.get('api/forma/all').then(res=> {
            setDataList(res.data)
        });
    }

    const clearAddForm = ()=> {
         const allInputs = document.querySelectorAll('#addForm input');

         allInputs.forEach ( input => {
                 input.value = "";  
         });

         var selects = document.querySelectorAll(".addFormSelect");
         selects.forEach(select => {
            select.options[0].selected = true;
         });
    }

    if(localStorage.getItem('token')) {
        return(
            <>
                <div class="container">
                    <h4>Liste des formations dans la base de donées :</h4>
                    <table class ="highlight stripped">
                        <thead>
                            <tr class="grey lighten-2">
                                <th>N°</th>
                                <th>Intitulé</th>
                                <th>N°Departement</th>
                                <th>Departement</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="grey lighten-3">          
                            {dataList.map((val)=> {
                                return (
                                        <tr>
                                            <td>{val.idForma}</td>
                                            <td>{val.nomForma}</td>
                                            <td>{val.identDep}</td>
                                            <td>{val.nomDepartement}</td>
                                            <td className="iconsTd">
                                                <form onSubmit={deletEtud}>
                                                    <input id={val.idForma} type="hidden" value={val.idForma} />
                                                    <button type="submit"  onClick={e => setidForma(document.getElementById(""+val.idForma).value)}><i class="fas fa-trash-alt"/></button>    
                                                </form> 
                                                <form onSubmit={openEditForma}>
                                                    <input id={val.idForma} type="hidden" value={val.idForma} />
                                                    <button type="submit"  onClick={e => setidForma(document.getElementById(""+val.idForma).value)}><i class="fa-solid fa-pen-to-square"/></button>    
                                                </form>                                               
                                             </td>
                                        </tr>
                                )
                             })}
                        </tbody>
                    </table>
                    <div className="add-admin-icon">
                        
                      <i className="fa-solid fa-circle-plus" onClick={openExitAddForma}></i>
                      <span >Ajouter une formation</span>
                  
                    </div>
                    <div className="cover-all">
                        <div class="col s12 m6">
                                <div class="card white">
                                    <div class="card-content black-text">
                                        <span class="card-title center crufFormSpan">{method} une formation</span>
                                        <form onSubmit={handleSubmitAddForma("add")} id="addForm">
                                                <i class="fas fa-times" onClick={openExitAddForma}></i>
                                                <div class="group"> 
                                                    <label>N° Formation</label>
                                                    <input type="text" required autoFocus onChange={e => setNumForma(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Intitulé</label>
                                                    <input type="text" required autoFocus onChange={e => setnomForma(e.target.value)}/>      
                                                </div>   
                                                <div class="group">
                                                    <label>Nom de département</label>

                                                    <select className="crud-select addFormSelect" onChange={e => setidDept(e.target.value)}>
                                                        <option value="" disabled selected>Séléctionnez la formation</option>
                                                        {dataListDept.map((val)=> {
                                                            return (
                                                                <option value={val.idDepartement}>{val.nomDepartement}</option>
                                                            )
                                                        })}
                                                        
                                                    </select>
                                                </div>
                                                <div class="group"> 
                                                    <label>crédit</label>
                                                    <input type="number" required autoFocus onChange={e => setcredit(e.target.value)}/>      
                                                </div>   
                                                <div class="group">
                                                    <label>Résponsable (enseignant)</label>

                                                    <select className="crud-select addFormSelect" onChange={e => setnumEns(e.target.value)}>
                                                        <option value="" disabled selected>Séléctionnez un enseignant</option>
                                                        {dataListEns.map((val)=> {
                                                            return (
                                                                <option value={val.numEns}>{val.nomEns}</option>
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
                                                    <label>N° Formation</label>
                                                    <input type="text" value={NumForma} required autoFocus disabled onChange={e => setNumForma(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Intitulé</label>
                                                    <input type="text" value={nomForma} required autoFocus onChange={e => setnomForma(e.target.value)}/>      
                                                </div>   
                                                <div class="group">
                                                    <label>Nom de département</label>

                                                    <select className="crud-select" onChange={e => setidDept(e.target.value)}>
                                                        {dataListDept.map((val)=> {
                                                         
                                                            if( val.idDepartement === idDept) {
                                                                return (<option  value={val.idDepartement} selected>{val.nomDepartement}</option>)
                                                            } else {
                                                                return (<option value={val.idDepartement}>{val.nomDepartement}</option>)
                                                            }
                                                        })}
                                                        
                                                    </select>
                                                </div>
                                                <div class="group"> 
                                                    <label>crédit</label>
                                                    <input type="number" value={credit} required autoFocus onChange={e => setcredit(e.target.value)}/>      
                                                </div>   
                                                <div class="group">
                                                    <label>Résponsable (enseignant)</label>

                                                    <select className="crud-select" onChange={e => setnumEns(e.target.value)}>
                                                        <option value="" disabled selected>Séléctionnez un enseignant</option>
                                                        {dataListEns.map((val)=> {
                                                            
                                                            if( val.numEns === numEns) {
                                                                return (<option  value={val.numEns} selected>{val.nomEns}</option>)
                                                            } else {
                                                                return (<option value={val.numEns}>{val.nomEns}</option>)
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

export default FormaCRUD;