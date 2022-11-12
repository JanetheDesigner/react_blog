import React, { useRef } from "react";
import { FiUploadCloud } from "react-icons/fi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { IArrowBack } from "../../utils/icons";
import Alert from '../../utils/alert'




export default function AddLocation() {
    const { state } = useLocation()
    const navigate = useNavigate();
    const form = useRef();

    const values = {
        title: state?.title || "",
        content: state?.content || "",
        image: state?.image || "",
        url: state?.image || "",
    };


    const [formData, setFormData] = React.useState(values),
        [isSubmitting, setSubmit] = React.useState(false);

    const action = state ?
        {
            url: "https://api-hackathon-blog.onrender.com/post/update/" + state?._id,
            method: "PUT",
        }
        :
        {
            url: "https://api-hackathon-blog.onrender.com/post/create",
            method: "POST",
        }

    const addData = ({ target: { name, value } }) => {
        if (name in values) {
            setFormData((state) => ({ ...state, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form.current);

        setSubmit(true);
        Alert({type: "info", message: state?"Updating post...":"Creating post...", timer: 10000})

        fetch(action.url, {
            method: action.method,
            body: formData,
            headers: {
                authorization: localStorage.getItem("token")
            }
        }).then(res => res.json())
            .then(({ success, message, ...rest }) => {
                Alert({ type: success ? "success" : "error", message })

                if (success) {
                    navigate(`/post/${rest.data._id}`, { state: rest.data })
                }
                setSubmit(false);
            })
            .catch(err => {
                setSubmit(false);
                console.error(err)
                Alert({type: "error", message: "Something went wrong"})
            })
    },
        handleImageUpload = ({ target: { files } }) => {
            const url = URL.createObjectURL(files[0]);
            setFormData((state) => ({ ...state, image: files[0], url }));
        };

    return (
        <div className="w-full h-screen ">
            <Header />

            <div className=" flex justify-center px-[10%] mt-20">
                <form
                    ref={form}
                    className="modal__one rounded-2xl  md:w-[600px] w-80 border-0  mb-5"
                    onSubmit={handleSubmit}>
                    <div className="mt-">
                        <div className="flex items-center">
                            <img
                                src={IArrowBack}
                                alt="arrow back"
                                className="w-9 cursor-pointer mr-2 sm:mr-5 mt-1 hover:bg-slate-500 p-2 rounded-full"
                                onClick={(_) => navigate(-1)}
                            />{" "}
                            <strong className="text-lg sm:text-2xl">{state ? "Update post" : "Create Post"}</strong>
                        </div>

                        <div>
                            <div
                                className="h-64 w-full flex mt-10 justify-center items-center border rounded relative" style={{ background: formData.url ? "" : "rgba(0,0,0, .3) center" }}>
                                <div
                                    className="cursor-pointer">
                                    {formData.url ? (
                                        <img alt="" src={formData.url} className="h-64 w-full" />
                                    ) : (
                                        <div className="relative w-40 h-[7em]  text-base  text-feint rounded flex-col items-center	justify-center">
                                            <div className="flex items-center justify-center mt-5">
                                                <FiUploadCloud size={40} className="text-slate-500" />
                                            </div>
                                            <p className="underline underline-offset-4 text-center text-slate-500">
                                                Select Image
                                            </p>
                                        </div>
                                    )}
                                    <input onChange={handleImageUpload} type="file" name="image" className="opacity-0 w-full absolute top-0 bottom-0 left-0 right-0 border cursor-pointer" />
                                </div>
                            </div>
                            <h2 className="mb-10 text-xl  pt-3  text-center text-md">
                                Post Image
                            </h2> 

                            <div className="w-full">
                                <label htmlFor="description" className="block text-sm font-bold mt-2 input-label text-left"> Post Title <span style={{ top: "2px", color: "red" }} className="relative">*</span></label>
                                <input
                                    value={formData.title}
                                    name={"title"}
                                    className={"shadow rounded text-base border-transparent  focus:border focus:border-black"}
                                    type="text"
                                    required={true}
                                    onChange={addData}
                                    placeholder="Enter post title..."
                                />
                            </div>

                            <label htmlFor="content" className="block text-sm font-bold mt-2 input-label text-left">Post Content <span
                                style={{ top: "2px", color: "red" }}
                                className="relative">
                                *
                            </span></label>
                            <textarea
                                className="border focus:border-black border rounded w-full text-base py-3 px-3 text-gray-700 leading-tight shadow focus:outline-none focus:shadow-outline resize-none outline-none"
                                rows={3}
                                id="content"
                                value={formData.content}
                                name={"content"}
                                placeholder={"Write your content here..."}
                                minLength={3}
                                onChange={addData}
                                required={true}
                            />



                        </div>

                        <div className="flex mx-auto justify-center  my-10 w-full">
                            <button
                                className="bg-slate-900 text-white shadow rounded-md w-full h-[40px]"
                                type={"submit"}
                                disabled={isSubmitting}>
                                {" "}
                                {isSubmitting ? "Sending..." : state ? "Update post" : "Create Post"}{" "}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}