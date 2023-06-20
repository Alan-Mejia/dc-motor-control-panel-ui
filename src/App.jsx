import { useRef, useState } from 'react'
import './App.css'
import { over } from 'stompjs'
import SockJS from 'sockjs-client'

var  stompClient = null
const serverNameWebSocket = "http://192.168.3.10:8080/iot-dc-motor-controller"

function App() {

  const deviceName = useRef("")
  const password = useRef("")

  const [isUserLogged, setIsUsserLoged] = useState(false)
  const [animationDuration, setAnimationDuration] = useState("0ms")
  const [rpmsSelected, setRpmSelected] = useState(0)

  const [maximumMotorRpm, setMaximumMotorRpm] = useState(0)
  const [rpmFromDevice, setRpmFromDevice] = useState(0)
  const [maximumRpmFromDevice, setMaximumMotorRpmFromDevice] = useState(0)
  const [pinPwmOutputVoltage, setPinPwdOutputVoltage] = useState(0)

  const [kpSelected, setKpSelected] = useState(0.0)
  const [kpFromDevice, setKpFromDevice] = useState(0.0)
  const [kiSelected, setKiSelected] = useState(0.0)
  const [kiFromDevice, setKiFromDevice] = useState(0.0)
  const [kdSelected, setKdSelected] = useState(0.0)
  const [kdFromDevice, setKdFromDevice] = useState(0.0)



  const handleOnClickRpm = ()=>{

    if(maximumMotorRpm >= rpmsSelected){
      const payload = {
        from: `react-ui-${deviceName.current}`,
        to: deviceName.current,
        action: "changeRpm",
        rpmDesired: rpmsSelected,
        maximumMotorRpm: maximumMotorRpm,
        kp: kpSelected,
        ki: kiSelected,
        kd: kdSelected
      }
  
      stompClient.send(`/iot-websocket/change-rpm/${deviceName.current}`,{},JSON.stringify(payload))
      setAnimationDuration("0ms")
    }else if(maximumMotorRpm < rpmsSelected && maximumMotorRpm>0){
      const payload = {
        from: `react-ui-${deviceName.current}`,
        to: deviceName.current,
        action: "changeRpm",
        rpmDesired: 0,
        maximumMotorRpm: maximumMotorRpm,
        kp: kpSelected,
        ki: kiSelected,
        kd: kdSelected
      }
  
      stompClient.send(`/iot-websocket/change-rpm/${deviceName.current}`,{},JSON.stringify(payload))
      setAnimationDuration("0ms")
    }/* else{
      const payload = {
        from: `react-ui-${deviceName.current}`,
        to: deviceName.current,
        action: "changeRpm",
        rpmDesired: rpmsSelected,
        maximumMotorRpm: 0
      }
  
      stompClient.send(`/iot-websocket/change-rpm/${deviceName.current}`,{},JSON.stringify(payload))
      setAnimationDuration("0ms")
    } */

    

  }

  const handleOnChangeRpm = (e)=>{
    const value = e.target.value === ''? 0 : parseInt(e.target.value)
    setRpmSelected(value)
  }

  const handleOnChangeUserName = (e)=>{
    deviceName.current = e.target.value
  }

  const handleOnChangePassword = (e)=>{
    password.current = e.target.value
  }

  const handleOnClickLogin = ()=>{
    if(deviceName.current === "alancho" && password.current === "equipomaquinas"){
      let sock = new SockJS(serverNameWebSocket)
      stompClient = over(sock)
      stompClient.connect({},onConnectedWebSocket, onErrorWebSocketConnection)
      setIsUsserLoged(true)
    }else{
      alert("Sorry credentials are incorrect")
    }
  }

  const onConnectedWebSocket = ()=>{
    console.log("Connected To Websocket")
    stompClient.subscribe(`/connection/deviceinfo/${deviceName.current}`, onStatusMessageRecieved)
  }

  const onStatusMessageRecieved = (payload)=>{
    const messageContent = JSON.parse(payload.body)
    if(messageContent.from === deviceName.current && messageContent.to === `react-ui-${deviceName.current}`){
      setRpmFromDevice(messageContent.rpmWorking)
      setMaximumMotorRpmFromDevice(messageContent.maximumMotorRpm)
      setKdFromDevice(Number(messageContent.kd))
      setKiFromDevice(messageContent.ki)
      setKpFromDevice(messageContent.kp)
      const time = parseInt(60000/messageContent.rpmWorking)
      setAnimationDuration(`${time}ms`)
      setPinPwdOutputVoltage(messageContent.pinVoltageOutput)
    } 
  }

  const onErrorWebSocketConnection = ()=>{
    console.log("Not COnnected to websocket")
  }

  const handleOnStartClick = ()=>{
    const payload = {
      from: `react-ui-${deviceName.current}`,
      to: deviceName.current,
      action: "changeRpm",
      rpmDesired: 2000, 
      maximumMotorRpm: maximumMotorRpm,
      kp: kpSelected,
      ki: kiSelected,
      kd: kdSelected
    }
    stompClient.send(`/iot-websocket/change-rpm/${deviceName.current}`,{},JSON.stringify(payload))
    setAnimationDuration("0ms")

  }

  const handleOnStopClick = ()=>{
    const payload = {
      from: `react-ui-${deviceName.current}`,
      to: deviceName.current,
      action: "changeRpm",
      rpmDesired: 0,
      maximumMotorRpm: maximumMotorRpm,
      kp: kpSelected,
        ki: kiSelected,
        kd: kdSelected
    }
    stompClient.send(`/iot-websocket/change-rpm/${deviceName.current}`,{},JSON.stringify(payload))
    setAnimationDuration("0ms")
  }

  const handleOnChangeMaximumRpm = (e)=>{
    const value = e.target.value === ''? 0 : parseInt(e.target.value)
    setMaximumMotorRpm(value)
  }

  const handleOnChangeKp = (e)=>{
    const value = e.target.value === ''? 0.0 : Number(e.target.value)
    setKpSelected(value)
  }

  const handleOnChangeKi = (e)=>{
    const value = e.target.value === ''? 0.0 : Number(e.target.value)
    setKiSelected(value)
  }

  const handleOnChangeKd = (e)=>{
    const value = e.target.value === ''? 0.0 : Number(e.target.value)
    setKdSelected(value)
  }

  const handleClickOnChangePid = ()=>{
    if(maximumMotorRpm >= rpmsSelected){
      const payload = {
        from: `react-ui-${deviceName.current}`,
        to: deviceName.current,
        action: "changeRpm",
        rpmDesired: rpmsSelected,
        maximumMotorRpm: maximumMotorRpm,
        kp: kpSelected,
        ki: kiSelected,
        kd: kdSelected
      }
  
      stompClient.send(`/iot-websocket/change-rpm/${deviceName.current}`,{},JSON.stringify(payload))
      setAnimationDuration("0ms")
    }else if(maximumMotorRpm < rpmsSelected && maximumMotorRpm>0){
      const payload = {
        from: `react-ui-${deviceName.current}`,
        to: deviceName.current,
        action: "changeRpm",
        rpmDesired: 0,
        maximumMotorRpm: maximumMotorRpm,
        kp: kpSelected,
        ki: kiSelected,
        kd: kdSelected
      }
  
      stompClient.send(`/iot-websocket/change-rpm/${deviceName.current}`,{},JSON.stringify(payload))
      setAnimationDuration("0ms")
    }
  }


  return (
    <>
      {isUserLogged?
      <div>
        <h1>DC MOTOR CONTROL PANEL</h1>
        <div className='motor-container'>
            <div className='motor-box'>
              <div className='slots-container'>
                <div className='inside-slot'></div>
                <div className='inside-slot'></div>
                <div className='inside-slot'></div>
                <div className='inside-slot'></div>
              </div>
              
            </div>
            <div className='motor-side-box'></div>
            <div className='motor-side2-box'></div>
            <div className='motor-rotor' style={{animationDuration: animationDuration}}></div>
            <div className='motor-base'></div>

            
          
        </div>
        <div className='control-panel'>
          <div className='panel-container'>
            <div className='buttons-container'>
              <button className='start-button' onClick={handleOnStartClick}>START</button>
              <button className='stop-button' onClick={handleOnStopClick}>STOP</button>
            </div>

            <div className='inputs-container'>
              <div className='inputs-box'>
                
                <div style={{display: "flex", width: "80%", justifyContent: "space-around", height: "40px", alignItems: "center"}}>
                  <label style={{fontSize: "18px", fontFamily: "sans-serif"}}>Set maximum motor RPM: </label>
                  <input type='number' min={0} max={7000} defaultValue={rpmsSelected} onChange={handleOnChangeMaximumRpm}></input>
                  <button onClick={handleOnClickRpm}>Accept</button>
                </div>
                
                <div style={{display: "flex", width: "80%", justifyContent: "space-around", height: "40px", alignItems: "center"}}>
                  <label style={{fontSize: "18px", fontFamily: "sans-serif"}}>How Many RPM? </label>
                  <input type='number' min={0} max={7000} defaultValue={rpmsSelected} onChange={handleOnChangeRpm}></input>
                  <button onClick={handleOnClickRpm}>Accept</button>
                </div>

                

                <div style={{fontSize: "20px", textAlign: "center", width: "100%", fontFamily: "sans-serif"}}>
                  <p>{`Maximum RPM selected: ${maximumRpmFromDevice}`}</p>
                  <p>{`Current RPM working: ${rpmFromDevice}`}</p>
                  <p>{`PWM pin output voltage: ${pinPwmOutputVoltage}`}</p>
                </div>
                
              </div>
            </div>


            <div className='inputs-container'>
              <div className='inputs-box'>
                
                <div style={{display: "flex", width: "80%", justifyContent: "space-around", height: "40px", alignItems: "center"}}>
                  <label style={{fontSize: "18px", fontFamily: "sans-serif"}}>Kp: </label>
                  <input type='number' min={0} max={7000} defaultValue={kpSelected} onChange={handleOnChangeKp}></input>
                  <button onClick={handleClickOnChangePid}>Accept</button>
                </div>
                
                <div style={{display: "flex", width: "80%", justifyContent: "space-around", height: "40px", alignItems: "center"}}>
                  <label style={{fontSize: "18px", fontFamily: "sans-serif"}}>Ki:  </label>
                  <input type='number' min={0} max={7000} defaultValue={kiSelected} onChange={handleOnChangeKi}></input>
                  <button onClick={handleClickOnChangePid}>Accept</button>
                </div>
                <div style={{display: "flex", width: "80%", justifyContent: "space-around", height: "40px", alignItems: "center"}}>
                  <label style={{fontSize: "18px", fontFamily: "sans-serif"}}>Kd:  </label>
                  <input type='number' min={0} max={7000} defaultValue={kdSelected} onChange={handleOnChangeKd}></input>
                  <button onClick={handleClickOnChangePid}>Accept</button>
                </div>

                

                <div style={{fontSize: "20px", textAlign: "center", width: "100%", fontFamily: "sans-serif"}}>
                  <p>{`Kp selected: ${kpFromDevice}`}</p>
                  <p>{`Ki selected: ${kiFromDevice}`}</p>
                  <p>{`kd selected: ${kdFromDevice}`}</p>
                </div>
                
              </div>
            </div>




          </div>
          
        </div>
      </div>
      :  
      <div>
        <h1>Find your device</h1>
        <div style={{width: "100%", textAlign: "center", fontSize: "30px", marginTop: "25px"}}>
          <label>Username: </label>
          <input type='text' style={{height: "25px", fontSize: "18px"}} onChange={handleOnChangeUserName}></input>
        </div>
        <div style={{width: "100%", textAlign: "center", fontSize: "30px", marginTop: "25px"}}>
          <label>Password: </label>
          <input type='password' style={{height: "25px", fontSize: "18px"}} onChange={handleOnChangePassword}></input>
        </div>
        <div style={{width: "100%", textAlign: "center", marginTop: "25px"}}>
          <button style={{margin: "0 auto", fontSize: "20px"}} onClick={handleOnClickLogin}>Login</button>
        </div>
        
      </div>

    }
      
    </>
  )
}

export default App
