import supabase from "../config/supabaseClient"
import { useEffect,useState } from "react"
import { useSearchParams } from "react-router-dom"
import Header from "./components/Header"

const Inventario = () => {
  const[searchparams] = useSearchParams();
  const[user_id] = useState(searchparams.get('id'));
  
  const[fetchError, setFetchError]=useState(null)
  const[rol, setRol]=useState(null)
  const[estab, setEstab]=useState(null)
  const[test, setTest]=useState(null)
  const[sesion, setSesion]=useState('')
  const [insumoIngreso, setInsumoIngreso] =useState('')
  const [listaInsumos, setListaInsumos] = useState(null)
  const[nombre, setNombre]=useState('')
  const[estab_ins, setEstab_ins]=useState('')
  const[cant_ins, setCant_ins]=useState('')
  const [estabSelected, setEstabSelected]=useState('')
  const [dataInsumos, setDataInsumos] = useState(null)
  const [isRegistro, setIsRegistro]=useState(false)
  const [isIngreso, setIsIngreso]=useState(false)
  const [isLista, setIsLista]=useState(true)

  useEffect(()=>{
    const fetchTest= async ()=>{
      const {data,error}=await supabase
      .rpc('get_medico_using_user_id',{user_id:user_id})

        if(error){
          setFetchError('Could not fetch')
          setTest(null)
          console.log(fetchError)
        }
        if(data){
          setTest(data)
          setFetchError(null)
          setSesion(data[0].user_mail)
          if(data[0].user_rol==='admin'){
            setRol(true)
          }
        }

    }
    fetchTest()
  },[user_id,fetchError])

  //fetch establecimientos
  useEffect(()=>{
    const fetchTest= async ()=>{
      const {data,error}=await supabase
      .rpc('get_establecimientos')

      if(error){
        setFetchError('Could not fetch')
        setEstab(null)
        console.log(error)
      }
      if(data){
        setEstab(data)
        setFetchError(null)
      }

    }
    fetchTest()
  },[])

  //fetch insumos
  useEffect(()=>{
    const fetchTest= async ()=>{
      const {data,error}=await supabase
      .rpc('get_insumos')

      if(error){
        setFetchError('Could not fetch')
        setListaInsumos(null)
        console.log(error)
      }
      if(data){
        setListaInsumos(data)
        setFetchError(null)
      }

    }
    fetchTest()
  },[isIngreso,isLista,isRegistro])

  
  //registro de insumo
  const handleSubmit = async (e) =>{
    e.preventDefault();

    const {data,error}=await supabase
    .rpc('set_insumo',{
      nombre:nombre,
      log_mail:sesion,
      log_info:"Se registró el insumo "+nombre
    })

    if(error){
      console.log(error)
    }else{
      setNombre('')
      alert("Ingresado correctamente")
    }
    if(data){
      //alert("Ingresado correctamente")
    }
  
  }

  //ingreso de insumo
  const handleSubmit2 = async (e) =>{
    e.preventDefault();

    const {data,error}=await supabase
    .rpc('get_number_insumo_estab',{
      id_estab: estab_ins,
      id_insumo: insumoIngreso
    })

    if(error){
      console.log(error)
    }else{
      //si se ha registrado el insumo
      if(data[0]){
        var new_cant=parseInt(cant_ins)+parseInt(data[0].cantidad)
      }
      if(data[0]){
        const {data,error}=await supabase
        .rpc('set_insumo_estab',{
          id_estab: estab_ins,
          id_insumo: insumoIngreso,
          cantidad_ins: new_cant,
          log_mail:sesion,
          log_info:"Se agregaron "+cant_ins+" unidades del insumo con ID: "+insumoIngreso+", al establecimiento con ID: "+estab_ins
        })
        if(error){
          console.log(error)
        }else{
          setEstab_ins('')
          setInsumoIngreso('')
          setCant_ins('')
          alert("Cantidad agregada correctamente")
        }
        if(data){

        }
      }//no se ha registrado el insumo
      else{
        const {data,error}=await supabase
        .rpc('set_new_insumo_estab',{
          id_estab: parseInt(estab_ins),
          id_insumo: parseInt(insumoIngreso),
          cantidad: parseInt(cant_ins),
          log_mail:sesion,
          log_info:"Se ingresó "+cant_ins+" unidades del insumo con ID: "+insumoIngreso+", al establecimiento con ID: "+estab_ins
        })
        if(error){
          console.log(error)
        }else{
          setEstab_ins('')
          setInsumoIngreso('')
          setCant_ins('')
          alert("Ingresado correctamente")
        }
        if(data){

        }
      }
    }
  
  }

  const handleRadio1 =(e)=>{
    setIsRegistro(true)
    setIsIngreso(false)
    setIsLista(false)
    setEstabSelected('')
    setDataInsumos(null)
  }
  const handleRadio2 =(e)=>{
    setIsRegistro(false)
    setIsIngreso(true)
    setIsLista(false)
  }
  const handleRadio3 =(e)=>{
    setIsRegistro(false)
    setIsIngreso(false)
    setIsLista(true)
  }



  const handleEstabSelection = async (e)=>{
    e.preventDefault();
    const {data,error}=await supabase
    .rpc('get_inventario',{
      id_estab:estabSelected
    })
    if(error){
      console.log(error)
    }
    if(data){
      setDataInsumos(data)
    }
  }

  return (
    <div className="page registro insumo">
      <Header user_id={user_id} test={test} rol={rol} pageTitle={"Inventario"}/>
      <div className="body">
        <form className="radio-selection">
          {rol&&(
            <>
            <div className="radio-button">
            <input type="radio" onChange={handleRadio3} id="listaInsumo" checked={isLista===true}/>
            <label htmlFor="listaInsumo">Inventario</label>
            </div>
            <div className="radio-button">
            <input type="radio" onChange={handleRadio1} id="registroInsumo" checked={isRegistro===true}/>
            <label htmlFor="registroInsumo">Registrar insumo</label>
            </div>
            <div className="radio-button">
            <input type="radio" onChange={handleRadio2} id="ingresoInsumo" checked={isIngreso===true}/>
            <label htmlFor="ingresoInsumo">Ingresar insumo</label>
            </div>
            </>
          )}
          
        </form>
        {/*Registro de insumo */}
        {isRegistro&&(
          <form className="form-registro" onSubmit={handleSubmit}>
          <h2 className='login_title'>Registro de insumo</h2>
            <div className="text-box">
              <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <label>Nombre</label>
            </div>
            <div className="submit-button">
              <button className='btn' type='submit'>Registrar</button>
            </div>
          </form>
        )}
        {/*Ingreso de insumos */}
        {isIngreso&&(
          <form className="form-registro" onSubmit={handleSubmit2}>
          <h2 className='login_title'>Establecimiento</h2>
            <div className="select-box">
              <select name="Establecimientos" required value={estab_ins} onChange={(e) => setEstab_ins(e.target.value)}>
                {estab&&(
                  <>
                    <option value="">Seleccione un Establecimiento</option>
                    {estab.map(e=>(
                      <>
                        <option value={e.id}>{e.estab+", "+e.direccion+", "+e.departamento+", "+e.municipio}</option>
                      </>
                    ))}
                  </>
                )}
              </select>
            </div>
            <br></br>
            <h2 className='login_title'>Ingreso de insumo</h2>
            <div className="select-box">
              <select name="Insumos" required value={insumoIngreso} onChange={(e) => setInsumoIngreso(e.target.value)}>
                {listaInsumos&&(
                  <>
                    <option value="">Seleccione un Insumo</option>
                    {listaInsumos.map(insumo=>(
                      <>
                        <option value={insumo.id_insumo}>{insumo.nombre_insumo}</option>
                      </>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div className="text-box">
              <input type="text" required value={cant_ins} onChange={(e) => setCant_ins(e.target.value)} />
              <label>Cantidad</label>
            </div>
            <div className="submit-button">
              <button className='btn' type='submit'>Registrar</button>
            </div>
          </form>
        )}
        {/*Despliega el inventario de insumos */}
        {isLista&&(
          <>
          <form className="estab-selection" onSubmit={handleEstabSelection}>
            <select name="Establecimientos" required value={estabSelected} onChange={(e) => setEstabSelected(e.target.value)}>
              {estab&&(
                <>
                  <option value="">Seleccione un Establecimiento</option>
                  {estab.map(e=>(
                    <>
                      <option value={e.id}>{e.estab+", "+e.direccion+", "+e.departamento+", "+e.municipio}</option>
                    </>
                  ))}
                </>
              )}
            </select>
            <button type="submit">Mostrar</button>
          </form>
          {dataInsumos&&(
              <div className="table-area">
                <table className="rwd-table">
                    <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Establecimiento</th>
                        <th>Cantidad</th>
                    </tr>
                    {dataInsumos.map(dins=>(
                        <>
                        <tr>
                            <td>{dins.id_insumo}</td>
                            <td>{dins.nombre_insumo}</td>
                            <td>{dins.estab_insumo}</td>
                            <td>{dins.cant_insumo}</td>
                        </tr>
                        </>
                    ))}
                    </tbody>
                </table>
              </div>
          )}
            </>
        )}
      </div>
    </div>
  )
}

export default Inventario