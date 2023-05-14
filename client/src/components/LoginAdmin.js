import axios from 'axios';
import React, { Component} from 'react';
import { Navigate } from 'react-router-dom';



export default class LoginAdmin extends Component {
    state={};

    componentDidMount = () =>{
        document.title = "Authentification Administrateur"
    }

    handleSubmit = async(e) =>{
        e.preventDefault();
        const data = {
            id: this.id,
            mdp: this.mdp
        }
        const header = {
            headers : {
                'Content-Type': 'application/json'
            } 
        }
        await axios.post('api/login/admin', data, header).then(res => {
            localStorage.setItem('token', res.data.token);
            this.setState({
                loggedIn: true
            });
            this.props.setUser(res.data.user)
        }).catch(err => {
            this.setState({
                message: err.response.data.message
            })
        })
    };
    render() {
        if(this.state.loggedIn) {
            return <Navigate to="/homeAdmin"/>
        }
        var error ='';
        if(this.state.message) {
            error = (
                <div className="red center container">{this.state.message}</div>
            )
        }
    return(
<div class='container center'>
    <h1>Authentification Administrateur</h1>
    <h3>Veuillez entrer votre identifiant et mot de passe</h3>
    <div class="container left-align">
                    <form onSubmit={this.handleSubmit}>
                        <div class="group"> 
                            <label>Identifiant</label>
                            <input type="text" required autoFocus onChange={e => this.id = e.target.value}/>      
                        </div>   
                        <div class="group"> 
                            <label>Mot de passe</label>
                            <input type="password" required onChange={e => this.mdp = e.target.value}/>      
                        </div>
                        <button class="waves-effect waves-right btn">Se connecter</button>
                </form>
                {error}
    </div>
</div>
    );
};
};
