import React, {Component} from 'react';
import axios from "axios";
import { Navigate } from 'react-router-dom';

export default class login extends Component {
    state = {};

    componentDidMount = () => {  
        document.title = "Authentification";
    };

   handleSubmitEtu= async(e) => {
       e.preventDefault();
        const data = {
            id: this.idEtu,
            mdp: this.mdpEtu
        }
        const header = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axios.post('api/login/etu', data, header).then( res => {
                localStorage.setItem('token', res.data.token);
                this.setState({
                loggedInEtu: true
                });
                this.props.setUser(res.data.user);
        })
        .catch(err => {
            this.setState({
                messageEtu:  err.response.data.message
            })
        })
    };

    handleSubmitEns= async(e) => {
        e.preventDefault();
         const data = {
             id: this.idEns,
             mdp: this.mdpEns
         }
         const header = {
             headers: {
                 'Content-Type': 'application/json'
             }
         }
         await axios.post('api/login/ens', data, header).then( res => {
                 localStorage.setItem('token', res.data.token);
                 this.setState({
                 loggedInEns: true
                 });
                 this.props.setUser(res.data.user);
         })
         .catch(err => {
             this.setState({
                 messageEns:  err.response.data.message
             })
         })
     };

    
        render(){
            if(this.state.loggedInEtu) {
                return <Navigate to="/homeEtu"/>
            }
            if(this.state.loggedInEns) {
                return <Navigate to="/homeEns"/>
            }
            var errorEtu = '';
            var errorEns = '';

            if(this.state.messageEtu) {
                errorEtu = (
                    <div className="red center container">{this.state.messageEtu}</div>
                )
            }

            if(this.state.messageEns) {
                errorEns = (
                    <div className="red center container">{this.state.messageEns}</div>
                )
            }
                return(
                    <div class="row container">
                        <h3 class="center">Veuillez entrer votre identifiant et mot de passe</h3>
                        <div class="col s12 m6">
                            
                        
                            <div class="card white">
                                <div class="card-content black-text">
                                    <span class="card-title center">Connexion étudiant</span>
                                        <form onSubmit={this.handleSubmitEtu}>
                                            <div class="group"> 
                                                <label>Identifiant</label>
                                                <input type="text" required autoFocus onChange={e => this.idEtu = e.target.value}/>      
                                            </div>   
                                            <div class="group"> 
                                                <label>Mot de passe</label>
                                                <input type="password" required onChange={e => this.mdpEtu = e.target.value}/>      
                                            </div>
                                            <div class="left-align">
                                                <button class="btn">Se connecter</button>
                                            </div>
                                    </form>
                                    {errorEtu}
                                </div>
                            </div>
                        </div>
                        <div class="col s12 m6">
                            <div class="card grey lighten-4">
                                <div class="card-content black-text">
                                    <span class="card-title center">Connexion enseignant</span>
                                        <form onSubmit={this.handleSubmitEns}>
                                            <div class="group"> 
                                                <label>Identifiant</label>
                                                <input type="text" required onChange={e => this.idEns = e.target.value}/>      
                                            </div>   
                                            <div class="group"> 
                                                <label>Mot de passe</label>
                                                <input type="password" required onChange={e => this.mdpEns = e.target.value}/>      
                                            </div>
                                            <div class="right-align">
                                                <button class="btn">Se connecter</button>
                                            </div>
                                    </form>
                                    {errorEns}
                                </div>
                            </div>
                        </div>
                    </div>
                );
    };
};
