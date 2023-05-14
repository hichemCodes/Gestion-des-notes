import React, { useCallback, useMemo, useRef, useState,useEffect } from 'react';
import axios from "axios";
import '../style/ens.css';
import { jsPDF } from "jspdf";
import * as Wj from '@grapecity/wijmo.react.grid';
import "@grapecity/wijmo.styles/wijmo.css";
import * as wjcCore from '@grapecity/wijmo';
wjcCore.setLicenseKey('quentin.ridel@etu.univ-rouen.fr,E612957246325918#B03ZxJCLlNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPnpVazImU494Ys9EdGp5SPVWMpBDZC5kTnNEbSRGcqpmdwFDMiFVTuhjV6QWRYNzSa96YB34VvMje4w4UyMUTLtUSLNmZXZ7YvJkZUp5bL3iSG3EZaBTeTZ5NnZVOvt4QxwWT7w4V9dFZaFnUBVjeUlGUsp7Nq3WYxoWUvQTYk3SMzUDZElGcRhzZndlMTtiWxlEbB9GbZJlTwNkayljaaVGTa54UpZHMvQ4NHtUR7FTczMkepR7dCpXO8NTZERWdmRzRIpmaotUOyt6LO9EZyMWb7hDNOZHM5hTONVVS6sGWxhXMsRFToJGRj3GbIZDM7pVT4lXUUZmeBNUT0xESuRGTjJHR8RnQPJDbvNHVPRkTlBnZm3GOsRnNw4Ga8kDMXpGc4F4UC5WYDVDenFzQjl4YmhDMMRnRupmc4NDcORFW92WZlhXS5pEejJlWTZ5Q4oGTINmRiojITJCLiEEMCZUMxYkNiojIIJCL4gTM8cjNwETO0IicfJye#4Xfd5nIJBjMSJiOiMkIsIibvl6cuVGd8VEIgQXZlh6U8VGbGBybtpWaXJiOi8kI1xSfiUTSOFlI0IyQiwiIu3Waz9WZ4hXRgAicldXZpZFdy3GclJFIv5mapdlI0IiTisHL3JyS7gDSiojIDJCLi86bpNnblRHeFBCI73mUpRHb55EIv5mapdlI0IiTisHL3JCNGZDRiojIDJCLi86bpNnblRHeFBCIQFETPBCIv5mapdlI0IiTisHL3JyMDBjQiojIDJCLiUmcvNEIv5mapdlI0IiTisHL3JSV8cTQiojIDJCLi86bpNnblRHeFBCI4JXYoNEbhl6YuFmbpZEIv5mapdlI0IiTis7W0ICZyBlIsIiMzITNxADI4ETNwIjMwIjI0ICdyNkIsIyMxYDMyIDMyIiOiAHeFJCLiInZu8WZ53mctYXauVnL5RXZAxWZklmcu8Wa49WZ5FnI0ISYONkIsUWdyRnOiwmdFJCLigTM9UjMzYDNycTN9ITM6IiOiQWSiwSfdtlOicGbmJCLiIjdyIDMyIIOII');


const HomeEns = (props) => {

    const [dataList,setDataList] = useState([]);
    const [dataListFormationPresident,dataListFormationPresidentsetDataList] = useState([]);

    const [idEnseignement,setIdEnseignement] = useState('');
    const [cuurentEnsignement,setCuurentEnsignement] = useState([]);
    const [moduleName,setmoduleName] = useState('');
    const [allmodulesName,setallmodulesName] = useState([]);
    const [allEtuName,setallEtuName] = useState([]);
    const [compteurEtudiant,setcompteurEtudiant] = useState(0);
 
     

    
    const [noteTP,setnoteTP] = useState('');
    const[CC1, setCC1] = useState("");
    const[Exam, setExam] = useState("");
    const[session, setSession] = useState("");
    const [rowData, setRowData] = useState([]);
    const resultatFinale = [];
    const [resultatFinaleState,setresultatFinaleState] = useState([]);


    const goModule = async(e) =>  {
        e.preventDefault();
        const options = {
            headers: {"content-type": "application/json"} 
        }
        const data = {
            id: idEnseignement
        };
        axios.post('api/ens/ensgmt/note',data,options).then(async(res)=> {
            console.log(res.data);
            setCuurentEnsignement(res.data);
            setRowData(res.data)
            res.data.map ( elem => {
                resultatFinale.push( (( {  numEtu,nomEtu,prenomEtu,noteTP,noteCC,noteExam,session,AnnéeUniv }) => ({ numEtu,nomEtu,prenomEtu,noteTP,noteCC,noteExam,session,AnnéeUniv }))(elem))
            });
            await setresultatFinaleState(resultatFinale);

        });
        document.querySelector('.cover-all').classList.toggle('show');
    }
    

    const closeModule = () => {
        setCuurentEnsignement([]);
        document.querySelector('.cover-all').classList.toggle('show');
    }

    const obtenirPDF = (idForma,numEns) => {
       
        const options = {
            headers: {"content-type": "application/json"}
        }
        const data = {
            num: numEns
        };

        const dataMod = {
            idForma: idForma
        };
        console.log(dataMod);

        //obtenir les noms des modules 
        axios.post('api/ens/forma/mod',dataMod,options).then(async res=> {

            await setallmodulesName(res.data)

        });
        //obtenir les noms des étudiants 
        axios.post('api/ens/etu/noms',dataMod,options).then(async res=> {

            await setallEtuName(res.data);
            setcompteurEtudiant(res.data.length);

        });

        axios.post('api/ens/forma',data,options).then(res=> {
            const result = res.data.filter(v => v.idForma  === idForma);;

            const doc = new jsPDF();
            doc.setFontSize(10);

            doc.text(15, 30, `DÉPARTEMENT : ${result[0].nomDepartement}`);
            doc.text(15, 40, `FORMATION : ${result[0].nomForma}`);
            doc.text(15, 50, `ANNÉE : ${new Date().getFullYear()}`);
            doc.text(120, 40, `PRÉSIDENT JURY : ${props.user.prenom} ${props.user.nom} `);
            

            

            // première ligne du tableau
            doc.line(15, 60, 195, 60);
            doc.text(16, 65, `NOM `);
            doc.text(36, 65, `PRENOM `);

            // noms des modules
            var x = 70;
            allmodulesName.map ((elem) => {
                
                doc.text(x, 65, `${elem.nomModule}`);
                x+= elem.nomModule.length + 20;
                console.log(elem.nomModule)

            });
            x+=20;

            doc.text(175, 65, `MOYENNE `);
  
            doc.line(15, 70, 195, 70); // line
            
            x= 16;
            var y = 75;
            allEtuName.map ((elem) => {
                
                doc.text(x, y, `${elem.nomEtu} `);//les noms
               
                x+= elem.nomEtu.length + 20;
                doc.text(x, y, `${elem.prenomEtu} `)
                x= 16;
                y+= 10;
                console.log(elem.nomEtu)

            });
            /*doc.text(16, 75, `Test `);
            doc.text(45, 75, `test `);*/

            var x = 70;
            allmodulesName.map ((elem) => {
                
                doc.text(x, 75, ` `);//les notes
                x+= elem.nomModule.length + 20;
                console.log(elem.nomModule)

            });
            doc.text(175, 75, ` `); // moyenn

            doc.line(15, 80, 195, 80); //line


            
            //footer
            y+=10;
            doc.setFontSize(10);
            doc.text(15, y, `Effectif= ${compteurEtudiant}`);
            y+=5;
            doc.text(15, y, 'Acquis= ');
            y+=5;
            doc.text(15, y, 'Non acquis= ');
            y+=5;
            doc.text(15, y, 'Exclus= ');
            y+=5;
            doc.text(15, y, 'Abandons= ');

            
            doc.save("PV.pdf");

        });

        

       


    }
    const updateAllNotes = (e) => {
        e.preventDefault();
        var allRows =  document.querySelectorAll('.wj-row');

        //JSON objet  remplir aprés les modification
        const ResultAfterUpdate = [];

        allRows =  document.querySelectorAll('.wj-cells .wj-row');

        for(var i = 1;i < allRows.length ; i++) {
            const row = allRows[i].childNodes;
            
            //ajouter les note de l'étudiant num
            ResultAfterUpdate.push( {
                TP: row[3].innerHTML,
                CC: row[4].innerHTML,
                exam: row[5].innerHTML,
                num: row[0].innerHTML,
                numEns: idEnseignement
            });
            
        }
        console.log(ResultAfterUpdate);
        
        //faire des appelles axios pour tous modifier 
        ResultAfterUpdate.forEach (etudiant => {

            const options = {
                headers: {"content-type": "application/json"}
            }

            axios.post('api/ens/note/all',etudiant,options)
            .then(res=> {
            });
        });


    }



    useEffect ( ()=> {
        document.title = "Accueil Enseignant"; 
        const rCount = sessionStorage.getItem('rCount');
        if(rCount < 1) {
          sessionStorage.setItem('rCount', String(rCount + 1));
          window.location.reload();
        } else {
          sessionStorage.removeItem('rCount');
        }
    },[]);

    //obtention des infos quand le num de l'enseignant est défini seulement
    useEffect ( ()=> {
        // récupérer les enseignements
        const options = {
            headers: {"content-type": "application/json"}
        }
        const data = {
            num: props?.user?.num
        };
        axios.post('api/ens/ensgmt',data,options).then(res=> {
            setDataList(res.data)
        });

        axios.post('api/ens/forma',data,options).then(res=> {
            dataListFormationPresidentsetDataList(res.data)
            console.log(res.data);
        });


    },[props?.user?.num]);

    useEffect(() => {
        
    }, [resultatFinaleState]);

    

    

    if(props.user) {  
        return (
            <React.Fragment>

            <div class="container">
                <h4>Bonjour {props.user.prenom} {props.user.nom}</h4>     
                <div class="row">
                    <div class="col s12 m12">
                        <div class="card teal lighten-2">
                            <div class="card-content white-text">
                            <h5>Président du jury :</h5> 
                            {dataListFormationPresident.map((val)=> {
                            return (
                                <p><h7>{val.idForma} - {val.nomForma}</h7> <button  onClick={()=> {obtenirPDF(val.idForma,val.numEns)}}><i class="fas fa-file-pdf"></i></button> </p>
                            )
                            })}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m12">
                        <div class="card">
                            <div class="card-content black-text">
                                <h5>Vos enseignements :</h5>
                                <div class="card-action"></div>
                                <table class ="highlight stripped responsive-table">
                                <thead>
                                    <tr class="grey lighten-2">
                                        <th>Identifiant</th>
                                        <th>TP</th>
                                        <th>CC</th>
                                        <th>Exam</th>
                                        <th>Module</th>
                                        <th>Nom</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody class="white">          
                                    {dataList.map((val)=> {
                           
                                    return (
                                        
                                        <tr className="ensg_tr" >
                                            <td>{val.idEnseignement}</td>
                                            <td>{val.coeffTP}</td>
                                            <td>{val.coeffCC}</td>
                                            <td>{val.coeffExam}</td>
                                            <td>{val.nomModule}</td>
                                            <td>{val.nomEnseignement}</td>      
                                            <td>
                                            <form onSubmit={goModule}>
                                                <input id={val.idEnseignement} type="hidden" value={val.idEnseignement} />

                                                <button type="submit"  onClick={ e => {
                                                    setIdEnseignement(document.getElementById(""+val.idEnseignement).value);
                                                    setmoduleName(val.nomModule);
                                                }}>
                                                    <i class="fas fa-tv"/>
                                                </button>    
                                            </form>   
                                                                      
                                            </td>
                                        </tr>
                                        )
                                        })}
                          
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                

                              
               
            </div>
            <div className="cover-all">
                     <div class="card white large-div">
                        <div class="card-content black-text  modif_note">
                            <i class="fas fa-times" onClick={closeModule}></i>
                            <h5>Notes des étudiant pour le module {moduleName} </h5>
                           
                           
                            <Wj.FlexGrid 
                                    itemsSource={ resultatFinaleState }
                            />
                            
                            <i class="fa-solid fa-circle-check" onClick={updateAllNotes}></i>
                               
                            
                           
                         </div>

                            
                            
                        </div> 
                     
            </div>  
            </React.Fragment>

        )
    } else {
        return(<h2> </h2>);
    }
};


export default HomeEns;
