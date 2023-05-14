import React,{ useEffect, useState } from "react";
import axios from "axios";


const HomeAdmin = (props) => {
    const [dataList,setDataList] = useState([]);


    useEffect(()=> {
        document.title = "Accueil administrateur"; 
        const rCount = sessionStorage.getItem('rCount');
        if(rCount < 1) {
          sessionStorage.setItem('rCount', String(rCount + 1));
          window.location.reload();
        } else {
          sessionStorage.removeItem('rCount');
        }
    },[]);

    useEffect ( ()=> {
            axios.get('api/annee').then(res=> {
                setDataList(res.data)
            });
    },[props?.user?.num]);

        if(props.user) {  
            return (
                <>
                 <div class="row center container">
                    <div class="col s12 m12">
                        <div class="card white">
                            <div class="card-content black-text">
                            {dataList.map((val)=> {
                                return (
                                <>
                                <h4>Année universitaire en cours : {val.annee}</h4>
                                <h6 class="card-title">semestre : {val.semestre_en_cours}</h6>
                                <h6 class="card-title">session : {val.session_en_cours}</h6>
                                </>
                                )})}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row center container">
                    <div class="card white">
                        <table class="highlight">
                        <tbody>
                            <tr>
                                <div class ="row valign-wrapper center">
                                        <div class="col s4 m4">
                                            <div class="card teal lighten-2">
                                                <div class="card-action blue-text">
                                                    <a class ="white-text"href="/homeadmin/univ">Universités</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col s4 m4">
                                            <div class="card teal lighten-2">
                                                <div class="card-action">
                                                    <a class ="white-text" href="/homeadmin/fac">Facultés</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col s4 m4">
                                            <div class="card teal lighten-2">
                                                <div class="card-action">
                                                    <a class ="white-text" href="/homeadmin/dep">Départements</a>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </tr>
                            <tr>
                                <div class = "row valign-wrapper center">
                                <div class="col s4 m4">
                                            <div class="card teal lighten-2">
                                                <div class="card-action">
                                                    <a class ="white-text" href="/homeadmin/forma">Formations</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col s4 m4">
                                            <div class="card teal lighten-2">
                                                <div class="card-action">
                                                    <a class ="white-text" href="/homeadmin/mod">Modules</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col s4 m4">
                                            <div class="card teal lighten-2">
                                                <div class="card-action">
                                                    <a class ="white-text" href="/homeadmin/enseigmt">Enseignements</a>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </tr>
                            <tr>
                                <div class = "row valign-wrapper center">
                                <div class="col s6 m6">
                                            <div class="card teal lighten-2">
                                                <div class="card-action">
                                                    <a class ="white-text" href="/homeadmin/etu">Etudiants</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col s6 m6">
                                            <div class="card teal lighten-2">
                                                <div class="card-action">
                                                    <a class ="white-text" href="/homeadmin/ens">Enseignants</a>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </tr>
                            <tr>
                                <div class = "row valign-wrapper center">
                                <div class="col s12 m12">
                                            <div class="card teal lighten-2">
                                                <div class="card-action">
                                                    <a class ="white-text" href="/homeadmin/archive">Archive</a>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </tr>
                        </tbody>
                        </table>
                    </div> 
                </div>
                </>
            );
        } else {
            return(<h2> </h2>);
        }
    };

export default HomeAdmin;