import React, { useState } from 'react'
import Header from '../components/Header/Header'
import Card from '../components/Card/Card'
import Search from '../components/Search/Search'
import Pipefy from '../components/Pipefy/Pipefy'
import api from '../services/api'
import { toast } from 'react-toastify'
import Loading from '../components/Loading/Loading'
import GoogleLoginModal from '../components/GoogleLoginModal/GoogleLoginModal'

function Cuidadores() {
  const [loading, setLoading] = useState(false);
  const [cuidadores, setCuidadores] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cardsData, setCardsData] = useState([]);

  const handleSearch = async (startDate, endDate, especialidades) => {
    setLoading(true);
    if(!localStorage.getItem('accessToken')){
      setLoading(false);
      setShowModal(true);
      return;
    }
    const especialidadesArray = await getEspecialidades(especialidades.especialidades);
    try {
      const response = await api.post('/usuarios/colaboradores-disponiveis', {
        especialidades: especialidadesArray,
        dataHoraInicio: startDate,
        dataHoraFim: endDate
      },
      { 
        headers: {
          'accessToken': localStorage.getItem('accessToken')
        }
      });
      setCuidadores(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if(error.response.status === 404){
        setCuidadores([]);
        return;
      }
      toast.error('Erro ao buscar cuidadores');
      console.error('Failed to fetch:', error);
    }
  }

  //Return all users
  // const handleSearch = async (startDate, endDate, especialidades) => {
  //   setLoading(true);
  //   api.get('/usuarios/colaboradores').then((response) => {
  //       setLoading(false);
  //       const { data } = response;
  //       setCardsData(data);
  //   }).catch(() => {
  //       setLoading(false);
  //       console.log('Erro ao buscar os dados do BackEnd: ')
  //       toast.error("Erro ao recuperar os valores da API, tente novamente");
  //   });
  // }

  const getEspecialidades = async (especialidades) => {
    let especialidadesArray = [];
    try {
      const response = await api.get('/especialidades');
      for (let i = 0; i < response.data.length; i++) {
        for (let j = 0; j < especialidades.length; j++) {
          if(response.data[i].id === especialidades[j]) {
            especialidadesArray.push(response.data[i].nome);
          }
        }
      }
    } catch (error) {
      toast.error('Erro ao buscar especialidades');
      console.error('Failed to fetch:', error);
    }
    return especialidadesArray;
  }

  return (
    <>
        <Pipefy />
        <Header />
        <Search handler={handleSearch} />
        <Loading show={loading} />
        <GoogleLoginModal
          isOpen={showModal}
          setIsOpen={setShowModal}
        />
        {!cuidadores && !cardsData &&
          <div className="chat-empty" style={{height: '75vh'}}>
            <div className="chat-empty-icon">🔍</div>
            <div className="chat-empty-text">Busque por um Cuidador.</div>
          </div>
        }
        {cuidadores && cuidadores.length === 0 && cardsData && cardsData.length == 0 &&
          <div className="chat-empty" style={{height: '75vh'}}>
            <div className="chat-empty-icon">😔</div>
            <div className="chat-empty-text">Nenhum Cuidador encontrado.</div>
          </div>
        }
        {cuidadores && !cuidadores.length === 0 &&
          <div style={{ display: 'flex', margin: '0 auto', width: '95%', flexDirection: 'row', gap: '1em', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center'}}>
            {cuidadores.map((cuidador, index) => (
                <Card 
                  key={index}
                  id={cuidador.id}
                  nome={cuidador.nome}
                  biografia={cuidador.biografia}
                  fotoPerfil={cuidador.fotoPerfil}
                  endereco={cuidador.endereco}
                  especialidades={cuidador.especialidades}
                  btn
                />
            ))}
          </div>
        }
        {cardsData &&
          <div style={{ display: 'flex', margin: '0 auto', width: '95%', flexDirection: 'row', gap: '1em', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center'}}>
            {cardsData && cardsData.map((data, index) => (
                    <Card key={index}
                        id={data.id}
                        nome={data.nome}
                        email={data.email}
                        documento={data.documento}
                        dataNascimento={data.dataNascimento}
                        biografia={data.biografia}
                        fotoPerfil={data.fotoPerfil}
                        tipoUsuario={data.tipoUsuario}
                        genero={data.genero}
                        endereco={data.endereco}
                        especialidades={data.especialidades}
                        price='false'
                    />
            ))}
          </div>
        }
        
    </>
  )
}

export default Cuidadores