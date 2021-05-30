import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useHistory, useLocation, useRouteMatch } from "react-router"
import classname from 'classnames'

import { selectCapsules, selectCapsulesStatus } from "../store/capsulesSlice"
import { fetchResource, selectResources, selectResourcesIds, selectResourcesStatus, uploadResource } from "../store/resourcesSlice"
import { selectMembers, selectMembersIds, selectMembersStatus } from "../store/membersSlice"
import { selectProfile } from "../store/profileSlice"


function Loading(){
    return (
        <div className="flex justify-center items-center absolute w-full h-full bg-secondary z-40">
            <p className="text-primary">Loading...</p>
        </div>
    )
}

function  ImageModal({images, image, toggleModal}){
    const [currentImage, setCurrentImage] = useState(image)

    function handleChangeImage(amount){
        if ( 0 <= currentImage + amount && currentImage + amount < images.length ){
            console.log(currentImage + amount)
            setCurrentImage(currentImage + amount)
        } 

    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-primary bg-opacity-70">
            {/* The Modal */}
            <div className="text-secondary bg-primary w-128 h-11/12 rounded-2xl p-6 flex flex-col shadow-xl border-seondary border-2 m-4">
                <div className="flex flex-grow items-center justify-center h-11/12">
                    <img src={images[currentImage]} className="object-contain"/>
                </div>
                <div className="flex-grow h-1/12 flex justify-center items-center space-x-1">
                    <button 
                        className={classname("bg-secondary text-primary h-full w-full rounded-l-2xl", {"opacity-50 cursor-not-allowed": currentImage === 0})}
                        onClick={() => handleChangeImage(-1)}
                    >
                        Left
                    </button>
                    <button className="bg-secondary text-primary h-full w-full " onClick={toggleModal}>Close</button>
                    <button 
                        className={classname("bg-secondary text-primary h-full w-full rounded-r-2xl", {"opacity-50 cursor-not-allowed": currentImage === images.length - 1})}
                        onClick={() => handleChangeImage(1)}
                    >
                        Right
                    </button>
                </div>
                
            </div>
        </div>
    )
}


function EditCapsule() {

    const [message, setMessage] = useState("")
    const [imagesURLs, setImagesURLs] = useState([])
    const [images, setImages] = useState([])
    const [emptySubmission, setEmptySubmission] = useState(0)
    
    const [notFound, setNotFound] = useState(0)
    const [toggleModal, setToggleModal] = useState(0)
    const [modalImage, setModalImage] = useState(0)
    
    const dispatch = useDispatch()

    const history = useHistory()

    const members = useSelector(selectMembers)
    const capsulesStatus = useSelector(selectCapsulesStatus)
    
    const {id} = useParams()
    useEffect(() => {
        // Validate the memeber in the dynamic url
        if (!members[id]){
            setNotFound(1)
        }
    }, [members])

    const resources = useSelector(selectResources)
    const resourcesIds = useSelector(selectResourcesIds)
    const resourcesStatus = useSelector(selectResourcesStatus)

    useEffect(() => {
        // Fetch resource if we don't have it

        const memberResource = resourcesIds.filter(resource => resources[resource].member === parseInt(id))
        if (!memberResource.length){
            dispatch(fetchResource({memberId: id}))
        } else {
            // We have the resource; render its content
            setImagesURLs(resources[memberResource[0]].images)
        }

    }, [resources])

    function handleSubmit(){
        if (message && images){
            setEmptySubmission(0)

            // POST request when no existing resource
            const memberResource = resourcesIds.filter(resource => resources[resource].member === parseInt(id))
            if (!memberResource.length){
                dispatch(uploadResource({memberId:id, images:images}))
            }
        } else {
            setEmptySubmission(1)
        }
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

    function handleToggleModal(){
        setToggleModal(0)
    }

    // if (notFound){
    //     return (
    //         <div>
    //             Not found!
    //         </div>
    //     )
    // }

    // if (capsulesStatus === 'pending'){
    //     console.log("PENDING....")
    //     return (
    //         <div>
    //             Loading...
    //         </div>
    //     )
    // }

    return (
        <div className="bg-secondary relative overflow-hidden rounded-2xl">
            {toggleModal === 1 && <ImageModal images={imagesURLs} image={modalImage} toggleModal={handleToggleModal}/>}
            {/* Dummy Flex */}
            <div className="flex flex-col justify-center items-center p-4">
                {resourcesStatus === 'pending' && <Loading />}
                {/* Edit Portion */}
                <div className="flex flex-col flex-grow justify-center items-center w-full space-y-2">
                    {/* Message */}
                    <div className="w-full flex flex-grow flex-col justify-center items-center">
                        <div className="flex flex-grow justify-center items-center w-full h-1/12">
                            <div className="flex justify-center items-center w-2/6 bg-primary rounded-t-lg h-full p-2">
                                <p className="text-secondary font-semibold md:font-bold md:text-xl">Message {emptySubmission === 1 && "*"}</p>
                            </div>
                        </div>
                        <div 
                            type="text" 
                            className={classname("p-2 bg-primary text-secondary text-sm font-semibold md:font-bold md:text-lg flex-grow w-full h-11/12 rounded-2xl overflow-hidden", {"outline-primary": emptySubmission && !message})}
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
                                <p className="text-secondary font-semibold md:font-bold md:text-xl">Upload {emptySubmission === 1 && "*"}</p>
                            </div>
                        </div>
                        {/* Body */}
                        <div 
                            type="text" 
                            className={classname("space-y-2 flex flex-col p-2 bg-primary text-secondary text-sm font-semibold md:font-bold md:text-lg outline-none flex-grow w-full h-11/12 rounded-2xl", {"outline-primary": emptySubmission && !imagesURLs.length})}
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
                                    <div 
                                        className="flex md:h-44 md:w-44 w-24 h-24 bg-secondary m-1 p-1 rounded-xl" 
                                        key={imagesURLs.indexOf(image)}
                                        onClick={() => { setToggleModal(1); setModalImage(imagesURLs.indexOf(image))}}    
                                    >
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
