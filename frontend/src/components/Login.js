import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const Auth = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/login", {
        email: email,
        password: password,
      });
      navigate("/admin"); 
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };
  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">
                <div className='has-text-centered mb-5'>
                    <h1 className='title is-2'>
                        <span className='icon-text'>
                            <span className='icon is-large'>
                                <i className='fas fa-cog fa-2x'></i>
                            </span>
                            <span>Admin Login</span>
                        </span>
                    </h1>
                    <p className='subtitle is-6'>Vending Machine Management System</p>
                </div>
                
                <form onSubmit={Auth} className='box'>
                    <p className='has-text-centered'>{msg}</p>
                    <div className="field mt-5">
                        <label className='label'>Email Or Username</label>
                        <div className="controls">
                            <input type="text" className='input' placeholder='Username' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                    </div>
                    <div className="field mt-5">
                        <label className='label'>Password</label>
                        <div className="controls">
                            <input type="password" className='input' placeholder='******' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <button className='button is-success is-fullwidth'>Login</button>
                    </div>
                    <div>
                        <p>Belum Mempunyai Akun? </p>
                    </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login