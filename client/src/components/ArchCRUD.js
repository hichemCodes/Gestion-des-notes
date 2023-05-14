import axios from "axios";
import React,{ useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';

const ArchCRUD =() => {
    const[dataList, setDataList] = useState([]);

    const[annee, setAnnee] = useState("");
    
    const openExitAddArch = () => {
         document.querySelector('#ajouter').classList.toggle('show');
         clearAddForm();
    }
    const openExitDelArch = () => {
         document.querySelector('#supprimer').classList.toggle('show');
         clearAddForm();
    }

    
    const handleSubmitAddArch =  (e) => {
        e.preventDefault();
        axios.post('api/archive')
        .then(res=> {
            openExitAddArch();  
            updateList();
            clearAddForm();
            window.M.toast({ html: 'Archive ajouté avec succés' , classes:'teal lighten-2 rounded '},2500);
        }).catch( err => {
            
            window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
            
        });
    };
    const handleSubmitDelArch =  async(e) => {
        e.preventDefault();

        const data = {
            anneeUniv: annee
        }
        console.log(data);
        const options = {
            headers: {"content-type": "application/json"}
        }
        axios.post('api/archive/del',data,options)
        .then(res=> {
            handleSubmitDelArch();  
            updateList();
            window.M.toast({ html: 'Archive supprimé avec succés' , classes:'teal lighten-2 rounded '},2500);
    
            }).catch( err => {
                window.M.toast({ html: ''.err.message , classes:'  rounded red '},2500)                     
            });
    };

    const updateList = () =>  {
        axios.get('api/archive/all').then(res=> {
            setDataList(res.data)
        });
    }

    const clearAddForm = ()=> {
         const allInputs = document.querySelectorAll('#addForm input,#delForm input');

         allInputs.forEach ( input => {
                 input.value = "";  
         });
    }

    useEffect(() => {
        document.title="Archivage";
        axios.get('api/archive/all').then(res=> {
            setDataList(res.data)
        });
        
    },[]);

    if(localStorage.getItem('token')) {
        return(
            <>
                <div>
                    <h4>Archives :</h4>
                    <table className="highlight stripped centered responsive-table center-align">
                        <thead>
                            <tr className="grey lighten-2">
                                <th>Année</th>
                                <th>Université</th>
                                <th>Faculté</th>
                                <th>Département</th>
                                <th>Formation</th>
                                <th>Semestre</th>
                                <th>Module</th>
                                <th>Credit module</th>
                                <th>Enseignement</th>
                                <th>N°Enseignant</th>
                                <th>Enseignant</th>
                                <th>N°Etudiant</th>
                                <th>Etudiant</th>
                                <th>TP</th>
                                <th>CC</th>
                                <th>Exam</th>
                            </tr>
                        </thead>
                        <tbody className="grey lighten-5">          
                            {dataList.map((val)=> {
                                return (
                                    <tr>
                                    <td>{val.AnneeUniv}</td>
                                    <td>{val.nomUniversite}</td>
                                    <td>{val.nomFac}</td>
                                    <td>{val.nomDepartement}</td>
                                    <td>{val.nomForma}</td>
                                    <td>{val.semestre}</td>
                                    <td>{val.nomModule}</td>
                                    <td>{val.creditModule}</td>
                                    <td>{val.nomEnseignement}</td>
                                    <td>{val.numEns}</td>
                                    <td>{val.nomEns} {val.prenomEns}</td>
                                    <td>{val.numEtu}</td>
                                    <td>{val.nomEtu} {val.prenomEtu}</td>
                                    <td>{val.noteTP}</td>
                                    <td>{val.noteCC}</td>
                                    <td>{val.noteExam}</td>
                                </tr>
                                )
                             })}
                        </tbody>
                    </table>
                    <div className="add-admin-icon">
                        
                      <i className="fa-solid fa-circle-plus" onClick={openExitAddArch}></i>
                      <span >Ajouter une archive</span>
                  
                    </div>
                    <div className="add-admin-icon">
                      <i className="fa-solid fa-trash-can" onClick={openExitDelArch}></i>
                      <span >Supprimer une archive</span>
                    </div>
                    <div className="cover-all" id="ajouter">
                        <div className="col s12 m6">
                                <div className="card white">
                                    <div className="card-content black-text">
                                        <span className="card-title center crufFormSpan">Ajouter une archive</span>
                                        <form onSubmit={handleSubmitAddArch} id="addForm">
                                                <i className="fas fa-times" onClick={openExitAddArch}></i>
                                                <div className="left-align">
                                                    <button className="btn">Archiver</button>
                                                </div>
                                            </form>
                                    </div>
                                </div>
                        </div>

                    </div>

                    <div className="cover-all" id="supprimer">
                        <div className="col s12 m6">
                                <div className="card white">
                                    <div className="card-content black-text">
                                        <span className="card-title center crufFormSpan">Supprimer l'archive</span>
                                        <form onSubmit={handleSubmitDelArch} id="delForm">
                                                <i className="fas fa-times" onClick={openExitDelArch}></i>
                                                <div className="group"> 
                                                    <label>Année</label>
                                                    <input type="text" required autoFocus placeholder="exemple : 2020-2021" onChange={e => setAnnee(e.target.value)}/> 
                                                </div>
                                                <div className="left-align">
                                                    <button className="btn">Supprimer</button>
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

export default ArchCRUD;
