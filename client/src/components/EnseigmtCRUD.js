import React,{ useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';



const EnseigmtCRUD =() => {
    const[dataList, setDataList] = useState([]);
    const[dataListEns, setDataListEns] = useState([]);
    const[dataListMod, setDataListMod] = useState([]);

    const[numEnsg, setNumEnsg] = useState("");
    const[nom, setNom] = useState("");
    const[ptp, setPtp] = useState("");
    const[PCC1, setPCC1] = useState("");
    const[PCC2, setPCC2] = useState("");
    const[PExam, setPExam] = useState("");
    const[numEns, setNumEns] = useState("");
    const[idMod, setIdMod] = useState("");
    const[idEnseignement, setidEnseignement] = useState("");
    const[method,setMethod] = useState("");

    const openExitAddEnsg = () => {
        document.querySelector('.cover-all').classList.toggle('show');
       

        //état par défaut des forms
        document.querySelector("#editForm").style.display = "none";
        document.querySelector("#addForm").style.display = "block";

        setNumEnsg("");
        setNom("");
        setPtp("");
        setPCC1("");
        setPExam("");
        setNumEns("");
        setIdMod("");
        setidEnseignement("");
        clearAddForm();
        setMethod("Ajouter");
   }

   const handleSubmitAddEnsg =  type => async(e) => {
        e.preventDefault();

        const data = {
            id: numEnsg,
            idMod: idMod,
            numEns: numEns,
            nom: nom,
            tp: parseInt(ptp,10),
            cc: parseInt(PCC1,10),
            exam: parseInt(PExam,10)
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        if(type === "add") {
            axios.post('api/ensgmt',data,options)
            .then(res=> {
                openExitAddEnsg();  
                updateList();
                clearAddForm();
                window.M.toast({ html: 'Enseignement ajouté avec succés' , classes:'teal lighten-2 rounded '},2500);

            }).catch( err => {
                //tester si le id entré est éxiste déja
                const idIdExist = dataList.filter(v => v.idEnseignement  === data.id);
                if(idIdExist.length != 0) { // ici on  trouvé l'id dans la liste ddes université 
                    window.M.toast({ html: 'l\'id que vous avez entré existe déja !' , classes:'  rounded red '},2500)
                } else {
                    window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
                }
            });
        } else {
            axios.put('api/ensgmt',data,options)
            .then(res=> {
                openExitAddEnsg();  
                updateList();
                window.M.toast({ html: 'Enseignement modifié avec succés' , classes:'teal lighten-2 rounded '},2500);
    
            }).catch( err => {
                window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
            });
        }
    };

    //supprimer un Enseignement  
    const deleteEnsg =  async(e) => {
        e.preventDefault();

        const data = {
                id: idEnseignement,
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        axios.post('api/ensgmt/del',data,options)
        .then(res=> {
            updateList();
            window.M.toast({ html: 'Enseignement supprimé avec succés' , classes:'teal lighten-2 rounded '},2500);
        }).catch( err => {
            window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
        });
    };

    const openEditEnsg = (e) => {
        e.preventDefault();

        axios.get('api/enseign/all').then(res=> {
            const result = res.data.filter(v => v.idEnseignement === idEnseignement);
            console.log(res.data);
            //obtenir les information de l'université 
            setNumEnsg(result[0].numEns);
            setNom(result[0].nomEns);
            setPtp(result[0].coeffTP);
            setPCC1(result[0].coeffCC1);
            setPExam(result[0].coeffExam);
            setNumEns(result[0].numEns);
            setIdMod(result[0].idModule);
            setidEnseignement(result[0].idEnseignement);
            setMethod("Modifier");
        });

        //afficher le formulaire de la modification
        document.querySelector('.cover-all').classList.toggle('show');
        document.querySelector("#addForm").style.display = "none";
        document.querySelector("#editForm").style.display = "block";

    }

    const updateList = () =>  {
        axios.get('api/enseign/all').then(res=> {
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

    useEffect(() => {
        document.title="Modules - Admin";
        axios.get('api/enseign/all').then(res=> {
            setDataList(res.data);
            console.log(res.data);
        });

        axios.get('api/mod/all').then(res=> {
            setDataListMod(res.data)
        });

        axios.get('api/ens/all').then(res=> {
            setDataListEns(res.data)
        });

    },[]);

    if(localStorage.getItem('token')) {
        return(
            <>
                <div class="container">
                    <h4>Liste des enseignements dans la base de donées :</h4>
                    <table class ="highlight stripped">
                        <thead>
                            <tr class="grey lighten-2">
                                <th>N°</th>
                                <th>Nom</th>
                                <th>%TP</th>
                                <th>%CC</th>
                                <th>%Exam</th>
                                <th>Enseignant</th>
                                <th>Module</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="grey lighten-3">          
                            {dataList.map((val)=> {
                                return (
                                        <tr>
                                            <td>{val.idEnseignement}</td>
                                            <td>{val.nomEnseignement}</td>
                                            <td>{val.coeffTP}</td>
                                            <td>{val.coeffCC}</td>
                                            <td>{val.coeffExam}</td>
                                            <td>{val.nomEns}</td>
                                            <td>{val.nomModule}</td>
                                            <td className="iconsTd">
                                                <form onSubmit={deleteEnsg}>
                                                    <input id={val.idEnseignement} type="hidden" value={val.idEnseignement} />
                                                    <button type="submit"  onClick={e => setidEnseignement(document.getElementById(""+val.idEnseignement).value)}><i class="fas fa-trash-alt"/></button>    
                                                </form> 
                                                <form onSubmit={openEditEnsg}>
                                                    <input id={val.idEnseignement} type="hidden" value={val.idEnseignement} />
                                                    <button type="submit"  onClick={e => setidEnseignement(document.getElementById(""+val.idEnseignement).value)}><i class="fa-solid fa-pen-to-square"/></button>    
                                                </form>                                               
                                             </td>
                                             
                                        </tr>
                                )
                             })}
                        </tbody>
                    </table>
                    <div className="add-admin-icon">
                        
                      <i className="fa-solid fa-circle-plus" onClick={openExitAddEnsg}></i>
                      <span >Ajouter un enseignements</span>
                  
                    </div>
                    <div className="cover-all">
                        <div class="col s12 m6 larg-form">
                                <div class="card white">
                                    <div class="card-content black-text">
                                        <span class="card-title center crufFormSpan">{method} un enseignements</span>
                                        <form onSubmit={handleSubmitAddEnsg("add")} id="addForm">
                                                <i class="fas fa-times" onClick={openExitAddEnsg}></i>
                                                <div class="group"> 
                                                    <label>ID</label>
                                                    <input type="text" required autoFocus onChange={e => setNumEnsg(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Nom d'enseignements</label>
                                                    <input type="text" required autoFocus onChange={e => setNom(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>coeffTP</label>
                                                    <input type="text" required autoFocus onChange={e => setPtp(e.target.value)}/>      
                                                </div>  
                                                <div class="group"> 
                                                    <label>coeffCC</label>
                                                    <input type="text" required autoFocus onChange={e => setPCC1(e.target.value)}/>      
                                                </div>
                                                <div class="group"> 
                                                    <label>coeffExam</label>
                                                    <input type="text" required autoFocus onChange={e => setPExam(e.target.value)}/>      
                                                </div>   
                                               
                    
                                                 <div class="group">
                                                    <label>enseignant</label>

                                                    <select className="crud-select addFormSelect" onChange={e => setNumEns(e.target.value)}>
                                                        <option value="" disabled selected>Séléctionnez un enseignant </option>
                                                        {dataListEns.map((val)=> {
                                                            return (
                                                                <option value={val.numEns}>{val.nomEns}</option>
                                                            )
                                                        })}
                                                        
                                                    </select>
                                                </div> 

                                                <div class="group">
                                                    <label>Module</label>

                                                    <select className="crud-select addFormSelect" onChange={e => setIdMod(e.target.value)}>
                                                        <option value="" disabled selected>Séléctionnez un module</option>
                                                        {dataListMod.map((val)=> {
                                                            return (
                                                                <option value={val.idModule}>{val.nomModule}</option>
                                                            )
                                                        })}
                                                        
                                                    </select>
                                                </div> 
                                                
                                                <div class="left-align">
                                                    <button class="btn">Ajouter</button>
                                                </div>
                                            </form>

                                            <form onSubmit={handleSubmitAddEnsg("edit")} id="editForm">
                                                <i class="fas fa-times" onClick={openExitAddEnsg}></i>
                                                <div class="group"> 
                                                    <label>ID</label>
                                                    <input type="text"  value={numEns} required autoFocus disabled onChange={e => setNumEnsg(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>Nom d'enseignements</label>
                                                    <input type="text" value={nom} required autoFocus onChange={e => setNom(e.target.value)}/>      
                                                </div> 
                                                <div class="group"> 
                                                    <label>coeffTP</label>
                                                    <input type="text" value={ptp} required autoFocus onChange={e => setPtp(e.target.value)}/>      
                                                </div>  
                                                <div class="group"> 
                                                    <label>coeffCC</label>
                                                    <input type="text" value={PCC1} required autoFocus onChange={e => setPCC1(e.target.value)}/>      
                                                </div>
                                                <div class="group"> 
                                                    <label>coeffExam</label>
                                                    <input type="text" value={PExam} required autoFocus onChange={e => setPExam(e.target.value)}/>      
                                                </div>   
                                               
                    
                                                 <div class="group">
                                                    <label>enseignant</label>

                                                    <select className="crud-select" onChange={e => setNumEns(e.target.value)}>
                                                        <option value="" disabled selected>Séléctionnez un enseignant </option>
                                                        {dataListEns.map((val)=> {
                                                           
                                                            if( val.numEns === numEns) {
                                                                return (<option  value={val.numEns} selected>{val.nomEns}</option>)
                                                            } else {
                                                                return (<option value={val.numEns}>{val.nomEns}</option>)
                                                            }
                                                        })}
                                                        
                                                    </select>
                                                </div> 

                                                <div class="group">
                                                    <label>Module</label>

                                                    <select className="crud-select" onChange={e => setIdMod(e.target.value)}>
                                                        <option value="" disabled selected>Séléctionnez un module</option>
                                                        {dataListMod.map((val)=> {
                                                           
                                                            if( val.idModule === idMod) {
                                                                return (<option  value={val.idModule} selected>{val.nomModule}</option>)
                                                            } else {
                                                                return (<option value={val.idModule}>{val.nomModule}</option>)
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

export default EnseigmtCRUD;
