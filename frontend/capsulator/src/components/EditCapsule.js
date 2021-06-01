import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useHistory, useLocation, useRouteMatch } from "react-router"
import classname from 'classnames'

import { lockCapsule, selectCapsules, selectCapsulesIds, selectCapsulesStatus } from "../store/capsulesSlice"
import { fetchCapsuleResources, fetchResource, fetchResources, selectResources, selectResourcesIds, selectResourcesStatus, updateResource, uploadResource } from "../store/resourcesSlice"
import { selectMembers, selectMembersIds, selectMembersStatus, fetchCapsuleMembers, updateMemberState, updateMemberStatus } from "../store/membersSlice"
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


function Accordion(props){
    const [collapse, setCollapse] = useState(false)

    return (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-3">
            <div className="w-full flex items-center justify-start">
                <div 
                    className="text-primary font-bold text-lg md:font-extrabold md:text-xl outline-none cursor-pointer select-none"
                    onClick={() => setCollapse(!collapse)}
                >
                    {props.name}
                </div>
            </div>
            {collapse === false && props.children}
        </div>
    )

}

function Requests({requestingMembers, handleRequestAction, loading}){
    return (

        <div className="relative flex flex-col items-center justify-center w-full space-y-3">
            {loading && <Loading />}
            {requestingMembers.map((member) => (
                <div className="h-20 w-full flex items-center justify-center bg-primary rounded-2xl p-4 space-x-2" key={member.id}>
                    {/* Profile pic */}
                    <div className="flex items-center justify-center">
                        <div className="w-16 h-18 rounded-full overflow-hidden bg-secondary">
                            <img src="../logo.png" className="object-contain"/>
                        </div>
                    </div>
                    {/* Name */}
                    <div className="flex items-center justify-start flex-grow">
                        <p className="md:text-xl font-bold text-sm md:font-extrabold text-secondary">
                            {member.userName}
                        </p>
                    </div>
                    {/* Button */}
                    <div className="flex items-center justify-center space-x-1">
                        <button className="w-10 h-10 bg-secondary text-primary rounded-l-2xl" onClick={() => handleRequestAction(member.id, true)}>1</button>
                        <button className="w-10 h-10 bg-secondary text-primary rounded-r-2xl" onClick={() => handleRequestAction(member.id, false)}>1</button>
                    </div>
                </div>
            ))}

        </div>
    )
}

export function OtherMembers(props){
    const [toggleContent, setToggleContent] = useState([]) // List for each member

    function MemberHeader(props){
        const [toggle, setToggle] = useState(true)
        return(
            <div className="w-full h-full">

                <div 
                    className={classname("flex-grow flex space-x-2 justify-center cursor-pointer select-none w-full", {"border-primary border-b-2": toggle})}
                    onClick={() => setToggle(!toggle)}
                    >
                    <div className="flex items-center justify-center">
                        <div className="w-16 h-18 rounded-tl-2xl overflow-hidden bg-primary">
                            <img src="../logo.png" className="object-contain"/>
                        </div>
                    </div>
                    <div className="flex items-center justify-start flex-grow">
                        <p className="md:text-xl font-bold md:font-extrabold text-primary">
                            {props.member.userName}
                        </p>
                    </div> 
                </div>
                <div className={classname("w-full h-full", {"p-6": toggle})}>
                    {toggle === true && props.children}
                </div>
            </div>
        )
    }

    function MemberBody(props){
        const [toggleModal, setToggleModal] = useState(false)
        const [modalImage, setModalImage] = useState(false)
        
        return (
            <div className="w-full h-full">
                {toggleModal === true && <ImageModal image={modalImage} images={props.resource.images} toggleModal={() => setToggleModal(!toggleModal)}/>}

            <div className="w-full h-fullflex flex-col items-start justify-center space-y-3">
                {/* Message */}
                <div className="flex-grow text-primary">
                    <div>
                        <p className="text-sm md:text-xl font-semibold md:font-bold ">
                            Message
                        </p>
                        <p className="text-sm md:text-xl italic">
                            {props.resource.message}
                        </p>
                    </div>
                </div>
                {/* Images */}
                <div className="flex-grow text-primary">
                        <p className="text-sm md:text-xl font-semibold md:font-bold ">
                            Images
                        </p>
                        <div className="flex items-center justify-start flex-wrap">
                            {props.resource.images.map(image => {return (
                                <div 
                                    className="flex md:h-44 md:w-44 w-24 h-24 bg-primary m-1 p-1 rounded-xl cursor-pointer" 
                                    key={props.resource.images.indexOf(image)}
                                    onClick={() => { setToggleModal(true); setModalImage(props.resource.images.indexOf(image))}}    
                                >
                                    <img src={image} className="rounded-xl object-cover"/>
                                </div>
                            )})}
                        </div>
                </div>
            </div>
        </div>
        )
    }

    return (
        <div className="flex flex-col space-y-2 items-center justify-center w-full">
            {/* Member */}
            <div className="flex flex-col justify-center items-start w-full space-y-3"
                // onClick={}
            >
                {props.members.map(member => {
                    const resource = props.resources.filter(resource => resource.memberId === parseInt(member.id))
                    return (
                        <div className="border-primary border-2 w-full h-full rounded-3xl overflow-hidden" key={member.id}>
                            <MemberHeader key={member.id} member={member} key={member.id}>
                                {resource.length > 0 && <MemberBody resource={resource[0]}/>}
                                {resource.length === 0 && <p className="text-sm md:text-xl font-semibold md:font-bold text-primary">Nothing was submitted.</p>}
                            </MemberHeader>
                        </div>

                )})}
            </div>
        </div>    
    )
}

function Edit(props){
    const [emptySubmission, setEmptySubmission] = useState(false)
    const [message, setMessage] = useState(props.message)
    const [renderImages, setRenderImages] = useState(props.renderImages)
    const [uploadImages, setUploadImages] = useState([])
    const [toggleModal, setToggleModal] = useState(false)
    const [modalInitImage, setModalInitImage] = useState(0) // Index into renderImages
    const [disableSubmit, setDisableSubmit] = useState(0)
    const [disableReady, setDisableReady] = useState(1)
    const [disableLock, setDisableLock] = useState(1)

    useEffect(() => {
        if (message){
            if (message === props.message && uploadImages.length === 0){
                setDisableSubmit(1)
                // User must upload a resource to be Ready
                if (props.members[props.memberId].resourceId !== undefined)
                    setDisableReady(0)
            }
        }
    }, [])

    useEffect(() => {
        if (props.members[props.memberId].status === "R") {
            setDisableLock(0) 
        } else {
            setDisableLock(1)
        }
    }, [props.members[props.memberId].status])

    function handleImageChange(e){
        // sets the uploadImages & renderImages

        if (e.target.files){
            // For uploading
            setUploadImages(e.target.files)

            // For previewing
            const files = Array.from(e.target.files).map(file => URL.createObjectURL(file)) 
            setRenderImages(props.renderImages ? files.concat(props.renderImages) : files)  // Concatenate with images from the server
    
            // Prevent leaks
            Array.from(e.target.files).map(file => URL.revokeObjectURL(file))
        }
        handleFormValidation()
    }

    function handleMessageChange(e){
        setMessage(e.target.value)
        handleFormValidation()
    }

    function handleFormValidation(){
        // Updating anything will enable the submit button again.
        if (disableSubmit){
            setDisableSubmit(0)
            setEmptySubmission(0)
        }
    }

    function handleToggleModal(){
        setToggleModal(!toggleModal)
    }

    return (
        <div className="w-full h-full">
            {toggleModal === 1 && <ImageModal images={renderImages} image={modalInitImage} toggleModal={handleToggleModal}/>}
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
                        className={
                            classname(
                                "p-2 bg-primary text-secondary text-sm font-semibold md:font-bold md:text-lg flex-grow w-full h-11/12 rounded-2xl overflow-hidden", 
                                {
                                    "outline-primary": emptySubmission && message === props.message
                                }
                            )}
                    >
                        <textarea 
                            className="resize-none bg-primary text-secondary w-full h-full rounded-2xl outline-none"
                            onChange={handleMessageChange}
                            value={message}
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
                        className={classname(
                                "space-y-2 flex flex-col p-2 bg-primary text-secondary text-sm font-semibold md:font-bold md:text-lg outline-none flex-grow w-full h-11/12 rounded-2xl", 
                                {"outline-primary": emptySubmission && !uploadImages.length}
                            )}
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
                            {renderImages && renderImages.map(image => {return (
                                <div 
                                    className="flex md:h-44 md:w-44 w-24 h-24 bg-secondary m-1 p-1 rounded-xl cursor-pointer" 
                                    key={renderImages.indexOf(image)}
                                    onClick={() => { setToggleModal(1); setModalInitImage(renderImages.indexOf(image))}}    
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
                            className={
                                classname(
                                    "h-10 flex-grow rounded-md bg-primary text-secondary font-bold text-2xl w-3/6",
                                    {"opacity-50 cursor-not-allowed": disableSubmit}
                                )
                            }
                            onClick={
                                () => {
                                    // Detect change
                                    if (message && uploadImages.length > 0 && !disableSubmit){
                                        setEmptySubmission(0)
                                        props.handleSubmit(message, uploadImages)
                                        }
                                    else {
                                        setEmptySubmission(1)
                                    }
                                }
                            }
                        >
                            Submit
                        </button>
                        
                        <button 
                            className={
                                classname(
                                    "h-10 flex-grow rounded-md bg-primary text-secondary font-bold text-2xl w-3/6",
                                    {"opacity-50 cursor-not-allowed": disableReady}
                                )
                            }
                            onClick={(e) => {!disableReady && props.handleReady(e)}}
                        >
                            {props.members[props.memberId] && props.members[props.memberId].status === "R" ? "Not-Ready" : "Ready"}
                        </button>

                        {props.isAdmin && 
                            <button 
                            className={
                                classname(
                                    "h-10 flex-grow rounded-md bg-primary text-secondary font-bold text-2xl w-3/6",
                                    {"opacity-50 cursor-not-allowed": disableLock}
                                )
                            }
                            onClick={(e) => {!disableLock && props.handleLock(e)}}
                            >
                                Lock
                            </button>
                        }
                        
                    </div>
                </div>
            </div>
        </div>

    )
}

function EditCapsule() {   
    const [notFound, setNotFound] = useState(0)

    const [isAdmin, setIsAdmin] = useState(false)

    const [requestingMembers, setRequestingMembers] = useState([])

    const dispatch = useDispatch()

    const {id} = useParams()
    
    const capsules = useSelector(selectCapsules)
    const capsulesIds = useSelector(selectCapsulesIds)
    const members = useSelector(selectMembers)
    const membersStatus = useSelector(selectMembersStatus)
    const membersIds = useSelector(selectMembersIds)
    const resources = useSelector(selectResources)
    const resourcesIds = useSelector(selectResourcesIds)
    const resourcesStatus = useSelector(selectResourcesStatus)
    const profile = useSelector(selectProfile)
    
    const memberCapsule = capsulesIds.filter(capsule => capsules[capsule].members.includes(parseInt(id)))
    const capsuleMembers = membersIds.filter(member => members[member].capsuleId === parseInt(memberCapsule[0]))
    const capsuleResources = resourcesIds.filter(resource => resources[resource])

    useEffect(() => {
        // Validate the memeber in the dynamic url
        if (!membersIds.includes(parseInt(id))){
            if (membersIds.length > 0){
                setNotFound(1)
            }    
        }
        else {
            // Set isAdmin state
            setIsAdmin(members[id].state === 'A')   
            setRequestingMembers(membersIds.filter(member => members[member].capsuleId === members[id].capsuleId && members[member].state === "W"))
        }
    }, [members])

    useEffect(() => {
        if (memberCapsule.length !== 0){
            // To make sure we're up to date
            dispatch(fetchCapsuleMembers({capsuleKey: capsules[memberCapsule[0]].key}))
            // Getting the resources
            dispatch(fetchCapsuleResources({capsuleKey:capsules[memberCapsule[0]].key})) 
        } 
    }, [memberCapsule[0]])

    const memberResource = resourcesIds.filter(resource => resources[resource].memberId === parseInt(id))
    
    function handleSubmit(message, uploadImages){
        // POST request when no existing resource
        const resourceExists = !(memberResource.length === 0)
        if (!resourceExists){
            dispatch(uploadResource({memberId:id, message: message, images:uploadImages}))
        } else {
            dispatch(updateResource({memberId:id, message: message, images:uploadImages}))
        }
    }

    function handleRequestAction(requestingMemberId, isApproved){
        dispatch(updateMemberState({memberId: requestingMemberId, state: isApproved ? "M" : "B"}))
    }

    function handleReady(){
        const newStatus = members[id].status === "R" ? "N" : "R" 
        dispatch(updateMemberStatus({memberId: id, status: newStatus}))
    }

    function handleLock(){
        dispatch(lockCapsule({capsuleKey: capsules[memberCapsule[0]].key}))
    }

    if (notFound === 1){
        return (
            <div className="flex flex-col items-center justify-center bg-secondary">
                <p className="flex-grow text-primary">
                    Capsule is not found.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-secondary relative overflow-hidden rounded-b-2xl">
            {/* Dummy Flex */}
            <div className="flex flex-col justify-center items-center p-4">
                {resourcesStatus === 'pending' && <Loading />}
                {membersIds.length > 0 && <Edit 
                    handleSubmit={handleSubmit}
                    handleReady={handleReady}
                    handleLock={handleLock}
                    members={members}
                    memberId={id}
                    isAdmin={isAdmin}
                    renderImages={memberResource.length > 0 ? resources[memberResource[0]].images : null}
                    message={memberResource.length > 0 ? resources[memberResource[0]].message : null}
                    key={memberResource}     // Re-render the Component everytime memberResource gets updated
                />}
                {isAdmin &&
                    <Accordion name="Requests">
                        {/* Requests */}
                        <Requests 
                            requestingMembers={requestingMembers.map(member => members[member])} 
                            handleRequestAction={handleRequestAction} 
                            loading={membersStatus === 'pending'}
                        />
                    </Accordion>
                }
                {/* Other Members */}
                <Accordion name="Other Members">
                    {capsuleMembers.length > 0 && capsuleResources.length > 0 && <OtherMembers members={capsuleMembers.map(member => members[member]).filter(member => member.userId !== profile.id)} resources={capsuleResources.map(resource => resources[resource])}/>}
                </Accordion>
            </div>
        </div>
    )
}

export default EditCapsule
