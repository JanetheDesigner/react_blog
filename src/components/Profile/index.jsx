import React, { useState } from 'react'
import { useEffect } from 'react'
import Modal from '../Modal'
import Alert from "../../utils/alert"
import './index.css'


export default function Profile({ open, setOpen, setUser }) {
  const className = ''
  const [payload, setPayload] = useState({})

  useEffect(()=> { 
    if(localStorage.getItem("user")) {
      const {firstName, lastName, email, role} = JSON.parse(localStorage.getItem("user"))
      setPayload(state=> ({firstName, lastName, email, role}))
      setUser(payload) 
    }
  }, [open])

  const action = {
    btnText: "Update",
    send: e => {
      Alert({type: "info", message: "Updating profile...", timer: 10000})
      fetch("http://localhost:3001/auth/user", {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token")
        }
      }).then(res => res.json())
      .then(({data, success, message}) => {
        Alert({type: success ? "success" : "error", message})
        if(success){
          setUser(data)
        localStorage.setItem("user", JSON.stringify(data))
        setOpen(false)
        }
      })
      .catch(error=>{
        Alert({type: "error", message: "Something went wrong"})
      })
    }
  }

  function handleChange ({target: {name, value}}) {
    setPayload(state=>({...state, [name]: value}))
  }
  return (
    <form>
      <Modal {...{ open, setOpen, title: "Preview Profile", type: 'profile', action}}>
        <div {...{ className }}>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={payload.firstName}
            onChange={handleChange}
            minLength="3"
            required
            className="block w-full capitalize rounded-md border-gray-300 px-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div {...{ className }}>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
          value={payload.lastName}
          onChange={handleChange}
            type="text"
            name="lastName"
            id="lastName"
            minLength="3"
            required
            className="block w-full capitalize rounded-md border-gray-300 px-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div {...{ className }}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            value={payload.email}
            onChange={handleChange}
            type="email"
            name="email"
            id="email"
            minLength="3"
            required
            className="block w-full rounded-md border-gray-300 px-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div {...{ className }}>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            minLength="5"
            value={payload.password}
            onChange={handleChange}
            required
            className="block w-full rounded-md border-gray-300 px-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div {...{ className }}>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            type="text"
            name="role"
            id="role"
            minLength="5"
            value={payload.role}
            onChange={handleChange}
            required
            disabled
            className="block capitalize w-full rounded-md border-gray-300 px-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </Modal>
    </form>
  )
}