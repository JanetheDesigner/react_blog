import dayjs from 'dayjs'
import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { IAvatar } from '../../utils/icons'
import Alert from "../../utils/alert"
import Modal from '../../components/Modal'
import "./index.css"

export default function Posts() {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [postId, setPostId] = useState('')

    function getPosts (){
        fetch("https://api-hackathon-blog.onrender.com/post/all").then(res => res.json())
            .then(({ success, data }) => {
                if (success) setPosts(data)
            }).catch(console.error)
    }

    useEffect(() => {
        fetch("https://api-hackathon-blog.onrender.com/auth/user", { headers: { authorization: localStorage.getItem("token") } }).then(res => res.json())
            .then(({ success, data }) => {
                setLoading(false)
                if (success) {
                    localStorage.setItem("user", JSON.stringify(data))
                    setUser(data)
                }
                else if (data === undefined) {
                    localStorage.clear()
                    navigate("/")
                    Alert({ type: "error", message: "Something went wrong" })
                }
            }).catch(err => {
                setLoading(false)
                if (localStorage.getItem("user")) setUser(JSON.parse(localStorage.getItem("user")))
                console.error(err)
                Alert({ type: "error", message: "Something went wrong" })
            })


            getPosts()

    }, [])

    function handleEdit(data) {
        navigate("/create", { state: data })
    }
    const handleDelete = post => {
        setOpen(true)
        setPostId(post._id)
    }

    function confirmDelete() {
        Alert({ type: "info", message: "Deleting post...", timer: 10000 })
        fetch("https://api-hackathon-blog.onrender.com/post/delete/" + postId,{
            method: "DELETE",
            headers: {
                authorization: localStorage.getItem("token")
            }
        }).then(res => res.json())
            .then(({ success, message }) => {
                Alert({ type: success ? "success" : "error", message })
                if (success) {
                    setOpen(false)
                    getPosts()
            }
            }).catch(err=>{
                console.error(err)
                Alert({ type: "error", message: "Something went wrong" })
            })
    }

    const action = {
        btnText: "Delete",
        send: confirmDelete
    }

    const handleShowPopUp = (e, user) => {
        let val = e.type === 'mouseover' ? 1 : 0;
        e.currentTarget.firstElementChild.style.opacity = user?.role !== 'user' ? val : null
    }

    return (
        <div>
            <Header {...{ userData: user }} />

            {loading ? <h2 className='text-center mt-20 italic'>Loading posts...</h2> : !posts.length && <h2 className='text-center mt-20'>No post in the system at the moment</h2>}
            <div className="flex flex-wrap justify-center md:mx-0 mx-auto sm:justify-between mt-10 px-[8%]">
                {
                    posts.length ? posts.map((data, index) => {
                        return (
                            <div key={index} className="card-wrapper relative my-5 shadow-sm cursor-pointer" onMouseOver={e =>handleShowPopUp(e, user)} onMouseLeave={e => handleShowPopUp(e, user)}>
                                {user?.role !== 'user' && <div className="flex justify-end absolute top-0 right-0 left-0 bg-[rgba(0,0,0,.5)] py-2 pr-3 opacity-0 transition-opacity z-5">
                                    <button onClick={_ => handleEdit(data)} className='mr-3 px-2 py-1 w-20 text-center text-black bg-white'>Edit</button>
                                    <button className='bg-[red] py-1 w-20 text-center px-2 text-white' onClick={_=>handleDelete(data)}>Delete</button>
                                </div>}
                                <div onClick={() => navigate(`/post/${data._id}`, { state: data })}>
                                    <div className="card-img">
                                        <img src={data.image} alt="" />
                                    </div>
                                    <div className="content p-3">
                                        <h2 className="text-lg">{data.title}</h2>
                                        <p className='truncate text-left'>{data.content}</p>

                                        <div className="flex justify-end">
                                            <div className='flex items-center'>
                                                <img className='mr-3 rounded-full w-9 h-9' src={data?.user?.profileImage || IAvatar} alt="" />
                                                <span className='flex-col mt-2'>
                                                    <small className='block my-0'>{data?.user?.firstName} {data?.user?.lastName}</small>
                                                    <small className='my-0'>{dayjs(data.createdAt).format("MMM DD, YYYY")}</small>
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )
                    }) : ""
                }
            </div>
            <Modal {...{ setOpen, open, title: "Delete Post", type: "delete", action }} />
            <Footer />
        </div>
    )
}