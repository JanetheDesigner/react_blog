import dayjs from 'dayjs'
import React from 'react'
import Header from '../../components/Header'
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import "../Posts/index.css"
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../../components/Footer';
import { IAvatar } from '../../utils/icons';

export default function SingleBlog() {
    const [like, setLike] = useState(false)
    let [likes, setLikes]= useState(0);
    const { state } = useLocation()
    const data = state

    function handleLike() {
        setLike(!like)
        let v = like ? 0 : 1
        setLikes(v)
    }
    return (
        <div>
            <Header />

            <div className=" mt-5 px-[8%] mb-30">
                <div className="">

                    <img src={data.image} className="w-full max-h-full sm:h-[60vh]" alt="" />
                    <div className="flex justify-center sm:justify-end">
                            <div className='flex items-center mt-2'>
                                <img className='mr-3 rounded-full w-9 h-9' src={data?.user?.avatar || IAvatar} alt="" />
                                <span className='flex-col mt-2'>
                                    <small className='my-0'>{data?.user?.firstName}</small>
                                    <small className='my-0 mx-5'>{dayjs(data.createdAt).format("MMM DD, YYYY")}</small>
                                </span>
                            </div>
                        </div>  
                </div>
                <div className="mt-5 shadow-md py-3">
                    <div className="content p-3">
                        <h2 className="text-2xl">{data.title}</h2>
                        <p className='truncat text-center'>{data.content}</p>

                        
                    </div>
                   <strong className='flex items-center mt-10 ml-5'> <span className='mr-2'>{likes}</span> <span onClick={handleLike}> {like ? <FcLike className='cursor-pointer' size={25} /> : <FcLikePlaceholder className='cursor-pointer' size={25} />} </span></strong>
                </div>

            </div>

            <Footer />
        </div>
    )
}