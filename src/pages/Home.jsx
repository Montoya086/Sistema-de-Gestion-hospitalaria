import supabase from "../config/supabaseClient"
import { useEffect,useState } from "react"
import { useSearchParams, createSearchParams } from "react-router-dom"
import { BrowserRouter, Link } from "react-router-dom"

const Home = () => {
  //get user id
  const [searchparams] = useSearchParams();
  const [user_id] = useState(searchparams.get('id'));

  //variables
  const[fetchError, setFetchError]=useState(null)
  const[test, setTest]=useState(null)
  const[rol, setRol]=useState(null)
  const [dni, setDni] = useState('');
  const [patient, setPatient] = useState('');

  //fetch
  useEffect(()=>{
    const fetchTest= async ()=>{
      //query returns table medico using user_id
      const {data,error}=await supabase
        .rpc('get_medico_using_user_id',{user_id:user_id})

        //on error
        if(error){
          setFetchError('Could not fetch')
          setTest(null)
          console.log(error)
        }
        //on data returned
        if(data){
          setTest(data)
          setFetchError(null)
          //checks if the user has the admin rol
          if(data[0].user_rol==='admin'){
            setRol(true)
          }
        }

    }
    //fecth
    fetchTest()
  },[user_id])

  //on submit
  const handleSubmit = async (e) =>{
    e.preventDefault();

    //fetch all the data of paciente in the database
    const {data,error}=await supabase
    .rpc('get_info_from_paciente_with_dni',{p_dni:dni})
    //on error
    if(error){
      console.log(error)
    }
    //on data returned
    if(data){
      setPatient(data)
    }
  }

  return (
    <div className="page home">
      <div className="header">
        {/*Navigation bar*/}
        <nav>
          <h1>Página principal</h1>
          {test&&(<h6>Bienvenido {test[0].nombre}</h6>)}
          {/*Public paths*/}
          <Link to={{pathname:'/home',search: createSearchParams({id: user_id}).toString()}}>Home</Link>
          <Link to={{pathname:'/reportes',search: createSearchParams({id: user_id}).toString()}}>Reportes</Link>
          <Link to={{pathname:'/registro_paciente',search: createSearchParams({id: user_id}).toString()}}>Registro de paciente</Link>
          <Link to={{pathname:'/ingreso_paciente',search: createSearchParams({id: user_id}).toString()}}>Ingreso de paciente</Link>
          <Link to={{pathname:'/inventario',search: createSearchParams({id: user_id}).toString()}}>Inventario</Link>
          <Link to={{pathname:'/act_datos',search: createSearchParams({id: user_id}).toString()}}>Act. de datos</Link>
          {/*Private paths*/}
          {test&&rol&&(
            <>
              <Link to={{pathname:'/registro',search: createSearchParams({id: user_id}).toString()}}>Registro de médicos</Link>
              <Link to={{pathname:'/logs',search: createSearchParams({id: user_id}).toString()}}>Logs</Link>
            </>
          )}
          <Link to="/" className="logout">Logout</Link>
        </nav>
      </div>
      <div className="body">
        {/*Search paciente form*/}
        <div className="search">
          <form onSubmit={handleSubmit}>
            <h2>Buscar paciente</h2>
            <input className='search-input' placeholder='DNI' type="text" value={dni} onChange={(e) => setDni(e.target.value)}/>
            <button className='search-button' type='submit'>Buscar</button>
          </form>
        </div>
        {/*Info about paciente*/}
        <div className='result-div'>
          {patient[0]&&(
            <div className='result-area'>
              <div className='result-text'>
                <h2>Información de paciente</h2>
                <h5>Nombre:</h5>
                <p>{patient[0].nombre_paciente}</p>
                <h5>Índice de masa corporal:</h5>
                <p>{patient[0].ind_masa_paciente}</p>
                <h5>Altura (m):</h5>
                <p>{patient[0].altura}</p>
                <h5>Peso (Lb):</h5>
                <p>{patient[0].peso}</p>
                <h5>Adicciones:</h5>
                {!patient[0].adicciones&&(
                  <p>No</p>
                )}
                {patient[0].adicciones&&(
                  <p>Sí</p>
                )}
                <h5>Dirección:</h5>
                <p>{patient[0].direccion_paciente}</p>
                <h5>Teléfono:</h5>
                <p>{patient[0].telefono_paciente}</p>
                <h3>Intervenciones:</h3>
                {patient.map(inter=>(
                  <>
                    <h4 className="subtitle">Información del médico</h4>
                    <h5>Nombre:</h5>
                    <p>{inter.nombre_medico}</p>
                    <h5>No. Colegiado:</h5>
                    <p>{inter.num_colegiado}</p>
                    <h5>Teléfono:</h5>
                    <p>{inter.telefono}</p>
                    <h5>Especialidad:</h5>
                    <p>{inter.especialidad}</p>
                    <h4 className="subtitle">Información de intervención</h4>
                    <h5>Lugar de realización:</h5>
                    <p>{inter.nombre_establecimiento}</p>
                    <h5>Dirección:</h5>
                    <p>{inter.direccion_establecimiento}</p>
                    <h5>Status:</h5>
                    <p>{inter.status}</p>
                    {inter.nombre_enfermedad&&(
                      <>
                        <h5>Descripción de diagnóstico:</h5>
                        <p>{inter.descripcion_diagnostico}</p>
                        <h5>Enfermedad:</h5>
                        <p>{inter.nombre_enfermedad}</p>
                        <h5>Descripción de enfermedad:</h5>
                        <p>{inter.descripcion_enfermedad}</p>
                        <h5>Precedentes:</h5>
                        <p>{inter.precedentes}</p>
                      </>
                    )}
                    {inter.nombre_insumo&&(
                      <>
                        <h5>Insumo utilizado:</h5>
                        <p>{inter.nombre_insumo}</p>
                        <h5>Cantidad utilizada:</h5>
                        <p>{inter.cantidad}</p>
                      </>
                    )}
                    {inter.nombre_examen&&(
                      <>
                        <h5>Descripción de resultado:</h5>
                        <p>{inter.descripcion_resultado}</p>
                        <h5>Examen:</h5>
                        <p>{inter.nombre_examen}</p>
                        <h5>Descripción de examen:</h5>
                        <p>{inter.descripcion_examen}</p>
                      </>
                    )}
                    {inter.nombre_cirugia&&(
                      <>
                        <h5>Descripción de realización de cirugía:</h5>
                        <p>{inter.descripcion_realizacion}</p>
                        <h5>Cirugía:</h5>
                        <p>{inter.nombre_cirugia}</p>
                        <h5>Descripción de cirugia:</h5>
                        <p>{inter.descripcion_cirugia}</p>
                      </>
                    )}
                    <hr/>
                  </>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home