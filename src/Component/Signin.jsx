import React, { useState } from 'react'

import { app } from '../Firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(app);

export default function Signin() {
     const [email,setEmail]=useState()
        const [password,setPassword]=useState()

      function Login(){
           signInWithEmailAndPassword(auth,email,password)
           .then((userCredential)=>{
            alert("success")
           })
           .catch((error)=>{
            console.log(error)
           })
      }  
  return (
    <div>
       <h1>Sign In</h1>
       <input type="text" value={email} name="email" onChange={(e)=>{setEmail(e.target.value)}} />
       <input type="text" value={password} name="password" onChange={(e)=>{setPassword(e.target.value)}} />
       <button  onClick={Login} >Click</button>
    </div>
  )
}
