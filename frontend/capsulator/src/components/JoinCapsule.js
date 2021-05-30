import { useEffect, useState } from "react"
import classname from 'classnames'
import { joinCapsule, selectMembersError, selectMembersStatus, setMember } from "../store/membersSlice"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router"

function Join({handleJoin}){
    const [key, setKey] = useState("")
    const [emptySubmission, setEmptySubmission] = useState(0)

    return (
        <div className="flex w-full justify-center items-center h-16">
            <input 
                className={classname("outline-none p-2 text-primary text-sm font-bold md:text-bold md:text-xl flex flex-grow justify-center items-center rounded-l-2xl h-full w-5/6 border-primary border-2 rounder-l-2xl overflow-hidden bg-secondary", {"outline-primary": emptySubmission && !key})}
                onChange={(e) => {setKey(e.target.value)}}
            />

            <button 
                className="bg-primary text-secondary text-sm font-bold md:text-bold md:text-xl outline-none flex-grow w-1/6 h-full rounded-r-2xl" 
                onClick={() => {
                    if (!key){
                        setEmptySubmission(1)
                    }
                    else {
                        handleJoin(key)
                        setEmptySubmission(0)
                    }
                }}
            >Join</button>
        </div>
    )
}

function Feedback({message, buttonMessage, handleFeedbackOnClick}){
    return (
        <div className="flex flex-col w-full justify-center items-center flex-grow">
            <div className="flex flex-grow items-center justify-center">
                <p  className="text-primary text-md font-bold md:text-xl text-center">{message}</p>
            </div>
            <div className="flex flex-grow items-end justify-start h-10 w-3/6">
                <button 
                    className="bg-primary text-secondary text-md font-bold md:text-xl outline-none flex-grow w-full h-full rounded-2xl" 
                    onClick={handleFeedbackOnClick}
                >
                    {buttonMessage}
                </button>
            </div>
        </div>
    )
}

function JoinCapsule() {
    const [toggleFeedback, setToggleFeedback] = useState(0)
    const [feedbackData, setFeedbackData] = useState(null)
    const [statusUpdated, setStatusUpdated] = useState(0) // Gets set when memberStatus is pending. Quick fix for not having an `idle` status

    const dispatch = useDispatch()

    const history = useHistory()

    const membersStatus = useSelector(selectMembersStatus)
    const membersError = useSelector(selectMembersError)

    function handleFeedbackOnClick(){
        if (membersStatus === 'rejected'){
            // Retry

            setToggleFeedback(0)
            setFeedbackData(null)
        } else if (membersStatus === 'fulfilled'){
            // Redirect to dashboard
            history.push("/dashboard")
        }
    }

    function handleJoin(key){
        dispatch(joinCapsule({capsuleKey: key}))
    }

    useEffect(() => {
        if (membersStatus === 'pending'){
            setStatusUpdated(1)
        }
        if (statusUpdated){
            if (membersStatus === 'fulfilled'){
                setFeedbackData({
                    message: "Request has been sent!",
                    buttonMessage: "Back to Dashboard",
                })
                setToggleFeedback(1)
            } else if (membersStatus === 'rejected' && membersError){
                if (parseInt(membersError.status) === 404){
                    setFeedbackData({
                        message: "Capsule is not found.",
                        buttonMessage: "Retry"
                    })
                    setToggleFeedback(1)
                }
            }
        }
        
    }, [membersStatus])

    return (
        <div className="h-40 w-full bg-secondary flex flex-col justify-center items-center p-4 rounded-b-2xl">
            {toggleFeedback === 0 && <Join handleJoin={handleJoin}/>}
            {toggleFeedback === 1 && <Feedback message={feedbackData.message} buttonMessage={feedbackData.buttonMessage} handleFeedbackOnClick={handleFeedbackOnClick}/>}
        </div>
    )
}

export default JoinCapsule
