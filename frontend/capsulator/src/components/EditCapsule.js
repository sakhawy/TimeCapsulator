import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useHistory, useLocation, useRouteMatch } from "react-router"

import { selectCapsules, submitCapsule } from "../store/capsulesSlice"
import { selectMembers, selectMembersIds } from "../store/membersSlice"
import { selectProfile } from "../store/profileSlice"


function EditCapsule() {

    const [message, setMessage] = useState("")
    const [imagesURLs, setImagesURLs] = useState([])
    const [images, setImages] = useState([])
    const [notFound, setNotFound] = useState(0)

    const dispatch = useDispatch()

    const history = useHistory()

    // const profile = useSelector(selectProfile)
    // const capsules = useSelector(selectCapsules)
    const members = useSelector(selectMembers)
    const membersIds = useSelector(selectMembersIds)

    const {id} = useParams()

    useEffect(() => {
        // Validate the memeber in the dynamic url
        if (!members[id]){
            setNotFound(1)
        }
    }, [members])

    function handleSubmit(){
        dispatch(submitCapsule({memberId:id, images:images}))
    }


    function handleImageChange(e){
        if (e.target.files){
            setImages(e.target.files)

            const files = Array.from(e.target.files).map(file => URL.createObjectURL(file)) 
            setImagesURLs(files)
    
            // Prevent leaks
            Array.from(e.target.files).map(file => URL.revokeObjectURL(file))
        }
    }

    if (notFound){
        return (
            <div>
                Not found!
            </div>
        )
    }

    return (
        <div>
            {/* Dummy Flex */}
            <div className="flex flex-col justify-center items-center bg-secondary p-4">
                {/* Edit Portion */}
                <div className="flex flex-col flex-grow justify-center items-center w-full space-y-2">
                    {/* Message */}
                    <div className="w-full flex flex-grow flex-col justify-center items-center">
                        <div className="flex flex-grow justify-center items-center w-full h-1/12">
                            <div className="flex justify-center items-center w-2/6 bg-primary rounded-t-lg h-full p-2">
                                <p className="text-secondary font-semibold md:font-bold md:text-xl">Message</p>
                            </div>
                        </div>
                        <div 
                            type="text" 
                            className="p-2 bg-primary text-secondary text-sm font-semibold md:font-bold md:text-lg outline-none flex-grow w-full h-11/12 rounded-2xl overflow-hidden" 
                        >
                            <textarea 
                                className="resize-none bg-primary text-secondary w-full h-full rounded-2xl outline-none"
                                onChange={(e) => {setMessage(e.target.value)}}
                            ></textarea>

                        </div>
                    </div>
                    {/* File upload */}
                    <div className="w-full flex flex-grow flex-col justify-center items-center">
                        {/* Title */}
                        <div className="flex flex-grow justify-center items-center w-full h-1/12">
                            <div className="flex justify-center items-center w-2/6 bg-primary rounded-t-lg h-full p-2">
                                <p className="text-secondary font-semibold md:font-bold md:text-xl">Upload</p>
                            </div>
                        </div>
                        {/* Body */}
                        <div 
                            type="text" 
                            className="space-y-2 flex flex-col p-2 bg-primary text-secondary text-sm font-semibold md:font-bold md:text-lg outline-none flex-grow w-full h-11/12 rounded-2xl" 
                        >
                            {/* Upload button */}
                            <div className="flex flex-grow justify-center items-center w-full h-1/6">
                                <label 
                                    className="flex items-center justify-center rounded-md bg-secondary text-primary h-10 w-48 font-bold text-2xl cursor-pointer"
                                >
                                    <p>

                                        Select Files
                                    </p>
                                    <input type="file" className="hidden" onChange={handleImageChange} multiple/>
                                </label>
                            </div>
                            <div className="flex flex-grow flex-wrap justify-center items-center w-full h-5/6 ">
                                {imagesURLs && imagesURLs.map(image => {return (
                                    <div className="flex md:h-44 md:w-44 w-24 h-24 bg-secondary m-1 p-1 rounded-xl" key={imagesURLs.indexOf(image)}>
                                        <img src={image} className="rounded-xl object-cover"/>
                                    </div>
                                )})}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-grow h-16 w-full items-center justify-center">
                        <div className="flex flex-row flex-grow justify-center items-center w-full h-full space-x-2">
                            <button 
                                className="h-10 flex-grow rounded-md bg-primary text-secondary font-bold text-2xl"
                                onClick={() => handleSubmit()}
                            >
                                Submit
                            </button>
                            
                            <button 
                                className="h-10 flex-grow rounded-md bg-primary text-secondary font-bold text-2xl"
                            >
                                Lock
                            </button>
                            
                        </div>
                    </div>
                </div>
                {/* Requests */}
                {/* Other Members */}
            </div>
        </div>
    )
}

export default EditCapsule
