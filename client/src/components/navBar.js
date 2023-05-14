import React, { Component } from 'react';
import axios from 'axios';

export default class NavBar extends Component {
    
    handleLogout= () => {
        axios.delete('/logoutEtu');
        axios.delete('/logoutEns');
        axios.delete('/logoutAdmin');
        localStorage.clear();
    }
    

    render() {

        if(this.props.user) {         
            if(localStorage.getItem('role') === "etudiant") { 
                return (
                    <nav>
                        <div class="nav-wrapper teal lighten-2">
                            <a href="http://srv-dpi-proj-gestnotes.univ-rouen.fr//homeetu" class="brand-logo">Accueil</a>
                            <a href="http://srv-dpi-proj-gestnotes.univ-rouen.fr/" onClick={this.handleLogout} class="right"> Se déconnecter</a>
                            <ul id="nav-mobile" class="left hide-on-med-and-down">
                            </ul>
                        </div>
                    </nav> 
                    );
            }
            else if(localStorage.getItem('role') === "enseignant"){// 
                return (
                    <nav>
                        <div class="nav-wrapper teal lighten-2">
                            <a href="http://srv-dpi-proj-gestnotes.univ-rouen.fr//homeEns" class="brand-logo">Accueil</a>
                            <a href="http://srv-dpi-proj-gestnotes.univ-rouen.fr/" onClick={this.handleLogout} class="right"> Se déconnecter</a>
                            <ul id="nav-mobile" class="left hide-on-med-and-down">
                            </ul>

                        </div>
                    </nav> 
                    );
            }
            else if(localStorage.getItem('role') === "admin")  { 
                return (
                    <nav>
                        <div class="nav-wrapper teal lighten-2">
                            <a href="http://srv-dpi-proj-gestnotes.univ-rouen.fr/homeAdmin" class="brand-logo">Accueil</a>
                            <a href="http://srv-dpi-proj-gestnotes.univ-rouen.fr/admin" onClick={this.handleLogout} class="right"> Se déconnecter</a>
                            <ul id="nav-mobile" class="left hide-on-med-and-down">
                            </ul>
                        </div>
                    </nav> 
                    );
            }
            return (
            <nav>
                <div class="nav-wrapper teal lighten-2">
                    <a href="http://srv-dpi-proj-gestnotes.univ-rouen.fr/homeetu" class="brand-logo">Accueil</a>
                    <a href="http://srv-dpi-proj-gestnotes.univ-rouen.fr/" onClick={this.handleLogout} class="right"> Se déconnecter</a>
                    <ul id="nav-mobile" class="left hide-on-med-and-down">
                    </ul>
                </div>
            </nav> 
            );
        } else {
            return (
                <nav>
                    <div class="nav-wrapper teal lighten-2">
                        <a href="http://srv-dpi-proj-gestnotes.univ-rouen.fr/" class="brand-logo">Accueil</a>
                        <ul id="nav-mobile" class="left hide-on-med-and-down">
                        </ul>
                    </div>
                </nav> 
                );
        }
    }
}
