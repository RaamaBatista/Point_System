import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UseContext"
import { processUserDataAndNavigate } from '../funcao/funcao'
import './login.css'
import Swal from "sweetalert2";

function Login() {
    const navigate = useNavigate()
    const { user, setUser } = useUser()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const handleMail = (e) => {
        setEmail(e.target.value)
    };

    const handlePass = (e) => {
        setPassword(e.target.value)
    };

    function Busca(e) {
        e.preventDefault();
        fetch('http://localhost:3333/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password: password })
        })
            .then(response => {
                if (!response.ok) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Email ou senha incorretos!'
                    })
                    throw new Error('Network response was not ok')

                }
                return response.json()
            })
            .then(data => {

                processUserDataAndNavigate(data, setUser, navigate)
            })
            .catch(error => {
                console.error('Error:', error)
            });
    }

    return (
        <div className="container2">
            <form>
                <div><h1>Login de Ponto</h1></div>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input type="email" onChange={handleMail} />
                    <label htmlFor="senha">Senha: </label>
                    <input type="password" onChange={handlePass} />
                    <button className="btn2" onClick={Busca}>Logar</button>
                </div>
            </form>
        </div>
    )
}

export default Login