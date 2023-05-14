import React,{ useEffect , useState} from "react";
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';

const HomeEtu  = (props) => {
    const [dataList,setDataList] = useState([]);
    const [idFormation,setIdFormation] = useState('');
    const [currentFormation,setCurrentFormation] = useState([]);
    const [trouve,setTrouve] = useState(false);

    const jsPdfGenerator = () => {
      
        const { jsPDF } = require("jspdf");
        const doc = new jsPDF();
       
        doc.setFontSize(25);
        doc.text(15, 13, 'Notes et Résultats');

        var nom_univ,nom_forma;
        currentFormation.map((val)=> {
            return (
                nom_univ= val.nomUniversite,
                nom_forma =val.nomForma              
            )})

        doc.setFontSize(17);
        doc.text(15,22,""+nom_univ); 
        doc.setFontSize(12);      
        doc.text(15,28,"Spécialité :"+nom_forma);
        doc.setFontSize(10);
        doc.text(15,33,`Nom et prénom : ${props.user.nom} ${props.user.prenom} `);
        doc.text(15,38,`Numéro INE : ${props.user.num}`);
        doc.line(200, 280, 10, 280); 
        var m_names = new Array("Janvier", "Février", "Mars", 
                            "Avril", "Mai", "Juin", "Juillet",
                            "Aout", "Septembre", 
                            "Octobre", "Novembre", "Decembre");
        var today = new Date();
        var curr_date = today.getDate();
        var curr_month = today.getMonth();
        var curr_year = today.getFullYear();
        today =  curr_date + "  " +m_names[curr_month] + "  " + curr_year;
        var newdat = today;

        doc.text(15,43,"Date d'édition : " +newdat);
 
       today =  curr_date + "/" +curr_month+ "/" + curr_year;
       var auj = today;
       doc.text(210-200,297-10,'Fait, le '+auj);
       doc.text(210-200,297-5,"L'original du relevé de notes est fourni par le service de scolarité");

       var columns = [
        { title: "Code", dataKey: "code" },
        { title: "Module", dataKey: "module" },
        { title: "Tp", dataKey: "tp" },
        { title: "CC", dataKey: "cc" },
        { title: "Examen", dataKey: "examen" },
        { title: "Note", dataKey: "note" },
        { title: "Session 2", dataKey: "session2" },
        { title: "Résultat", dataKey: "res" },
    ];
    var rows=[];
    
    currentFormation.filter(formation=>(formation.session===1)).map((val)=> {
        var a=`${currentFormation.filter(formation=>(formation.session===2)).map((val2)=> {
            return(val2.idModule===val.idModule ? val2.noteExam:"")      
        })
        }`;
        console.log(a);
        return (rows=[...rows,
            {code: val.idModule,
            module: val.nomModule, 
            tp: val.noteTP,
            cc: val.noteCC, 
            examen: val.noteExam,
            session2:  a.replace(","," "),
            note: "",
            res:val.noteExam>10 ?"ADM":"AJ",
             }
        ])})

    doc.autoTable(columns, rows, {       
        startY: doc.autoTableEndPosY() + 50,
        margin: { horizontal: 10 },
        styles: { overflow: 'linebreak' , halign: "center" },
        bodyStyles: { valign: 'top' },
        columnStyles: { email: { columnWidth: 'wrap' } },
        theme: "striped"
      });

      const pageCount = doc.internal.getNumberOfPages();
      for(var i = 1; i <= pageCount; i++) {
          // pointer sur la page i
         doc.setPage(i);
          //affichage page 1/n
         doc.text('Page ' + String(i) + ' / ' + String(pageCount),210-10,297-10,null,null,"right");
     }
     doc.saveGraphicsState();
     doc.setGState(new doc.GState({opacity: 0.1}));
     doc.setTextColor(200,200,400,0.1);
     doc.setFontSize(100);
     doc.text(50,200,'Non certifié',50,50)
     doc.restoreGraphicsState();
    
     doc.save(`Détails_de_notes_${props.user.nom}_${props.user.prenom}.pdf`);
        
        }


        const jsPdf_formation_Generator = () => {
      
            const { jsPDF } = require("jspdf");
            const doc = new jsPDF();
            doc.setFontSize(25);
            doc.text(15, 13, 'Mes formations');
            doc.setFontSize(10);  
            doc.text(15, 30,`Nom et prénom : ${props.user.nom} ${props.user.prenom} `);
            doc.text(15, 35,`Numéro INE : ${props.user.num}`);
            doc.line(200, 280, 10, 280); 
            var m_names = new Array("Janvier", "Février", "Mars", 
                                "Avril", "Mai", "Juin", "Juillet",
                                "Aout", "Septembre", 
                                "Octobre", "Novembre", "Decembre");
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth();
            var curr_year = today.getFullYear();
            today =  curr_date + "  " +m_names[curr_month] + "  " + curr_year;
            var newdat = today;
    
            doc.text(15,40,"Date d'édition : " +newdat);
     
           today =  curr_date + "/" +curr_month+ "/" + curr_year;
           var auj = today;
           doc.text(210-200,297-10,'Fait, le '+auj);
              
           var columns = [
            { title: "Année", dataKey: "annee" },
            { title: "Code", dataKey: "code" },
            { title: "formation", dataKey: "form" },
            { title: "Crédit", dataKey: "credit" },
            { title: "Session", dataKey: "sess" },
            { title: "Note", dataKey: "note" },
            { title: "Résultats", dataKey: "res" },
        ];
        var rows=[];
    
        dataList.map((val)=> {
            return (rows=[...rows,
                {annee: val.AnnéeUniv,
                credit: val.creditForma, 
                code: val.idForma, 
                form: val.nomForma,
                }
            ])})
    
        doc.autoTable(columns, rows, {
            startY: doc.autoTableEndPosY() + 50,
            margin: { horizontal: 15 },
            styles: { overflow: 'linebreak', halign: "center"},
            bodyStyles: { valign: 'top' },
            columnStyles: { email: { columnWidth: 'wrap' } },
            theme: "striped"
          });

          const pageCount = doc.internal.getNumberOfPages();
            for(var i = 1; i <= pageCount; i++) {
                // pointer sur la page i
               doc.setPage(i);
                //affichage page 1/n
               doc.text('Page ' + String(i) + ' / ' + String(pageCount),210-10,297-10,null,null,"right");
           }

        doc.save(`Formation_${props.user.nom}_${props.user.prenom}.pdf`);            
    }


    const goFormation = async(e) => {
        console.log(idFormation)
        e.preventDefault();
        const options = {
            headers: {"content-type": "application/json"}
        }
        const data = {
            num: props.user.num,
            idForma: idFormation
        };
        axios.post('api/etu/forma/all',data,options).then(res=> {
            console.log(res.data);
            setCurrentFormation(res.data);
        });
        document.querySelector('.cover-all').classList.toggle('show');

    }
    const closeFormation = () => {
 
        document.querySelector('.cover-all').classList.toggle('show');
    }
    
    useEffect ( ()=> {
        document.title = "Accueil étudiant"; 
        const rCount = sessionStorage.getItem('rCount');
        if(rCount < 1) {
          sessionStorage.setItem('rCount', String(rCount + 1));
          window.location.reload();
        } else {
          sessionStorage.removeItem('rCount');
        }
    },[]);
    useEffect ( ()=> {
        const options = {
            headers: {"content-type": "application/json"}
        }
        const data = {
            num: props?.user?.num
        };
        axios.post('api/etu/forma',data,options).then(res=> {
            setDataList(res.data)
        });
    },[props?.user?.num]);
    

    console.log('jefo');
    if(props.user) {  
        console.log(dataList)
        return (
            <React.Fragment>
            <div className="container">
                <h4>Bonjour {props.user.prenom} {props.user.nom}
                    <div className="col right-align"><i onClick={jsPdf_formation_Generator} class="fa-regular fa-file-pdf" style={{color:"red"}}></i></div>
                </h4>
                <h8>INE : {props.user.num}</h8>
                <table class ="highlight stripped">
                    <thead>
                        <tr class="grey lighten-2">
                            <th>Année</th>
                            <th>Code</th>
                            <th>Formation</th>
                            <th>Session</th>
                            <th>Note</th>
                            <th>Résultat</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody class="grey lighten-3">
                        
                    {dataList.map((val)=> {
                           return (
                               <tr>
                                   <td>{val.AnnéeUniv}</td>
                                   <td>{val.idForma}</td>
                                   <td>{val.nomForma}</td>
                                   <td></td>     
                                   <td></td>     
                                   <td></td>     
                                   <td>
                                   <form onSubmit={goFormation}>
                                       <input id={val.idForma} type="hidden" value={val.idForma} />
                                       <button type="submit" onClick={ e => {
                                                        setIdFormation(document.getElementById(""+val.idForma).value);
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
            <div className="cover-all">
                     <div class="card white large-div">
                        <div class="card-content black-text ">
                            <i class="fas fa-times" onClick={closeFormation}></i>
                            <h5>Mes notes<div className="col right-align"><i onClick={jsPdfGenerator} class="fa-regular fa-file-pdf" style={{color:"red"}}></i></div></h5>
                            <table >
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Module</th>
                                    <th colSpan={4}>Session 1</th>
                                    <th>Session 2</th>
                                    <th>Resultat</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th>{currentFormation.length > 0 && currentFormation[0].nomForma}</th>
                                    <th>TP</th>
                                    <th>CC</th>
                                    <th>Exam</th>
                                    <th>Moyenne</th>
				    <th>Note</th>
                                    <th></th>
                                </tr>
                                {console.log(currentFormation.filter(formation=>(formation.session===2)))}
                                {currentFormation.filter(formation=>(formation.session===1)).map((val)=> { 
                                    return (
                                    <>
                                    <tr>
                                        <td>{val.idModule}</td>
                                        <td>{val.nomModule}</td>
                                        <td>{val.noteTP}</td>
                                        <td>{val.noteCC}</td>
                                        <td>{val.noteExam}</td>
                                        <td></td>
                                        <td>
                                      {currentFormation.filter(formation=>(formation.session===2)).map((val2)=> {
                                            
                                            return (val2.idModule===val.idModule ? val2.noteExam:"")
                                         })
                                         }
                                        </td>
                                       
                                        <td>{val.noteExam>10 ?"ADM":"AJ"}</td>
                                    </tr>
                                    </>
                                    )})
                                }   
                            </thead>
                            </table>
                        </div> 
                     </div> 
            </div>  
            </React.Fragment>
        )
    } else {
        return(<h2> </h2>);
    }
};

export default HomeEtu ;
