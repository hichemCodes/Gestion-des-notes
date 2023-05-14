import React, {Component} from 'react';
import axios from 'axios';
import NavBar from './components/navBar';
import Login from './components/login'
import LoginAdmin from './components/LoginAdmin';
import HomeAdmin from './components/homeAdmin';
import UnivCRUD from './components/UnivCRUD';
import FacCRUD from './components/FacCRUD';
import DepCRUD from './components/DepCRUD'
import FormaCRUD from './components/FormaCRUD';
import ModCRUD from './components/ModCRUD';
import EnseigmtCRUD from './components/EnseigmtCRUD';
import EnsCRUD from './components/EnsCRUD';
import EtuCRUD from './components/etuCRUD';
import HomeEns from './components/HomeEns';
import ArchCRUD from './components/ArchCRUD';
import NotFound from './components/NotFound';
import HomeEtu from './components/homeEtu';
import {BrowserRouter, Routes,Route} from "react-router-dom";

export default class App extends Component {
    state = {};

    componentDidMount = () => {  
        
        if(this.state.user !== undefined) {
            return
        }
      

        axios.get('/api/etu').then(
            res => { 
                this.setUser(res.data);

                localStorage.setItem('role',"etudiant");
              
            },
        );
        axios.get('/api/admin').then(
            res => {
              
                this.setUser(res.data);
                localStorage.setItem('role',"admin");


            },
        );
        axios.get('/api/ens').then(
            res => {
                this.setUser(res.data);
                localStorage.setItem('role',"enseignant");

            },
        );
       
    };

    setUser = (user) => {

        
        this.setState({
            user: user,
        });
    };





    render(){
    return (
        <html>
            <head>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-alpha.3/css/materialize.min.css"></link>
            </head>
            <body>    
                <NavBar user={this.state.user}/>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Login setUser={this.setUser}/>}></Route>
                        <Route path='/admin' element={<LoginAdmin setUser={this.setUser}/>}></Route>
                        <Route path='/homeAdmin' element={<HomeAdmin user={this.state.user}/>}></Route>
                        <Route path='/homeAdmin/univ' element={<UnivCRUD user={this.state.user}/>}></Route>
                        <Route path='/homeAdmin/fac' element={<FacCRUD user={this.state.user}/>}></Route>
                        <Route path='/homeAdmin/dep' element={<DepCRUD user={this.state.user}/>}></Route>
                        <Route path='/homeAdmin/forma' element={<FormaCRUD user= {this.state.user}/>}></Route>
                        <Route path='/homeAdmin/mod' element={<ModCRUD user= {this.state.user}/>}></Route>
                        <Route path='/homeAdmin/enseigmt' element={<EnseigmtCRUD user= {this.state.user}/>}></Route>
                        <Route path='/homeAdmin/ens' element={<EnsCRUD user= {this.state.user}/>}></Route>
                        <Route path='/homeAdmin/etu' element={<EtuCRUD user= {this.state.user}/>}></Route>
                        <Route path='/homeAdmin/archive' element={<ArchCRUD user= {this.state.user}/>}></Route>
                        <Route path='/homeEtu' element={<HomeEtu user={this.state.user}/>}></Route>
                        <Route path='/homeEns' element={<HomeEns user={this.state.user}/>}></Route>
                        <Route path='*' element={<NotFound/>}></Route>
                    </Routes>
                </BrowserRouter>
            </body>
        </html>
    );
    };

}
