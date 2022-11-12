import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import "./index.css"
import LoginImg from './index.svg'
import Alert from '../../utils/alert'

export default function Login() {
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate();

  const [state, setState] = useState({ loading: false, message: "", isError: false })

  function collectInputData({ target: { name, value } }) {
    setPayload(state => ({ ...state, [name]: value }))
  }

  async function submitFormDataToBackend(e) {
    e.preventDefault()

    Alert({ type: "info", message: "Logging in...", timer: 10000 })

    setState(state => ({ ...state, message: "", loading: true, isError: false }))
    try {
      const res = await fetch("http://localhost:3001/auth/login", { method: "post", body: JSON.stringify(payload), headers: { "content-type": "application/json" } })
      const jsonResponse = await res.json();

      setState(state => ({ ...state, loading: false, isError: !jsonResponse.success }))

      Alert({ type: jsonResponse.success ? "success" : "error", message: jsonResponse.message })

      if (jsonResponse.success) {
        localStorage.setItem("token", jsonResponse.token)
        setTimeout(() => navigate("/posts"), 2000)
      }
    }
    catch (err) {
      console.error(err);
      Alert({ type: "error", message: "Something went wrong" })
    }
  }

  return (
    <>
      <Header />

      <main className="w-full flex flex-col sm:flex-row justify-center items-center mt-10">
        <div className="md:block hidden flex-1 sm:mr-20">
          <img src={LoginImg} alt="img" />
        </div>
        <div className="main_form flex-1">
          <form id="signInForm" className="md:mx-0 mx-auto shadow-md" onSubmit={submitFormDataToBackend}>
            <p className="form_title">Login your account</p>
            <p id="msg" style={{ color: !state.isError && state.loading ? "black" : state.isError && !state.loading ? "tomato" : "green" }}>{state.message}</p>
            <div className="input_group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" required onChange={collectInputData} value={payload.email} id="email" />
            </div>
            <div className="input_group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" required onChange={collectInputData} value={payload.password} id="password" />
            </div>
            <div className="input_group">
              <input type="submit" className='cursor-pointer' id="signupBtn" value="Login" />
            </div>

            <div className="flex">
              <p className="mr-1">Don't have an account?</p>
              <Link to={"/signup"} className="text-[#ef4444]"> Signup </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}