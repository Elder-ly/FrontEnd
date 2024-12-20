import { React, useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import './Header.css'
import Logo from '../../assets/img/logo.svg'
import HeaderDropdown from './HeaderDropdown/HeaderDropdown'
import GoogleBtn from './GoogleBtn/GoogleBtn';
import { USERTYPE } from '../../services/enums';
import { UserContext } from '../../App'
import { useEffect } from 'react'

function Header() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isAdm, setIsAdm] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('userType') == USERTYPE.ADM) {
      setIsAdm(true);
    }
  }, [user])
  
  return (
    <header>
        <img className="logo" src={Logo} alt="Elder.ly Logo"/>
        <nav>
          <button className='btnNoBg' onClick={() => navigate("/")}>Home</button>
          <button className='btnNoBg' onClick={() => navigate("/Cuidadores")}>Cuidadores</button>
          {user ? <button className='btnNoBg' onClick={() => navigate("/Chat")}>Chat</button> : null}
          {isAdm ? 
            <>
              <button className='btnNoBg' onClick={() => navigate("/CadastroCuidador")}>Cadastro de Cuidadores</button>
              <button className='btnNoBg' onClick={() => navigate("/RelatorioCuidador")}>Relatório</button>
              <button className='btnNoBg' onClick={() => navigate("/Dashboard")}>Dashboard</button>
              <button className='btnNoBg' onClick={() => navigate("/Settings")}>Gerenciamento</button>
            </> : null}
        </nav>
        { user ? <HeaderDropdown /> : 
          <div className='user'>
            <GoogleBtn />
          </div>
        }
    </header>
  )
}

export default Header