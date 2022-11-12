import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import '../Login/index.css'
import SignupImg from './index.svg'
import Alert from '../../utils/alert'

export default function Signup() {
    const [payload, setPayload] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "user"
    })
    const navigate = useNavigate();

    const [state, setState] = useState({ loading: false, message: "", isError: false })

    function collectInputData({ target: { name, value } }) {
        setPayload(state => ({ ...state, [name]: value }))
    }

    async function submitFormDataToBackend(e) {
        e.preventDefault()
        Alert({ type: "info", message: "Registering...", timer: 10000 })
        setState(state => ({ ...state, loading: true, isError: false }))
        try {
            const res = await fetch("http://localhost:3001/auth/signup", { method: "post", body: JSON.stringify(payload), headers: { "content-type": "application/json" } })
            const jsonResponse = await res.json();


            setState(state => ({ ...state, loading: false, isError: !jsonResponse.success }))
            Alert({ type: jsonResponse.success ? "success" : "error", message: jsonResponse.message })
            if (jsonResponse.success) navigate("/")
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
                    <img src={SignupImg} alt="img" />
                </div>
                <div className="main_form flex-1">
                    <form className='md:mx-0 mx-auto shadow-md' id="signUpForm" onSubmit={submitFormDataToBackend}>
                        <p className="form_title">Register with us!</p>
                        <p id="msg" style={{ color: !state.isError && state.loading ? "black" : state.isError && !state.loading ? "tomato" : "green" }}>{state.message}</p>
                        <div className="input_group">
                            <label htmlFor="firstname">First Name</label>
                            <input minLength={3} type="text" value={payload.firstName} onChange={collectInputData} required name="firstName" id="firstname" />
                        </div>
                        <div className="input_group">
                            <label htmlFor="lastname">Last Name</label>
                            <input type="text" minLength={3} required onChange={collectInputData} name="lastName" id="lastname" />
                        </div>
                        <div className="input_group">
                            <label htmlFor="email">Email</label>
                            <input type="email" required name="email" onChange={collectInputData} id="email" />
                        </div>
                        <div className="input_group">
                            <label htmlFor="password">Password</label>
                            <input type="password" minLength={8} onChange={collectInputData} required name="password" id="password" />
                        </div>
                        <div className="input_group">
                            <input type="submit" className='cursor-pointer' id="signupBtn" value="Submit" />
                        </div>
                        <div className="flex">
                            <p className="mr-1">Already have an account?</p>
                            <Link to={"/"} className="text-[#ef4444]"> Login </Link>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </>
    )
}
