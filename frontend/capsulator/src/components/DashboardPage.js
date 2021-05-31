import {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import classname from 'classnames'

import {selectCapsules, selectCapsulesIds, selectCapsulesStatus} from '../store/capsulesSlice'
import { selectMembers, selectMembersIds } from '../store/membersSlice'
import { Link, useHistory } from 'react-router-dom'
import { selectProfile } from '../store/profileSlice'

function CapsuleDetailsModal({name, creationDate, unlockDate, creators, toggleModal}) {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-primary bg-opacity-70">
            {/* The Modal */}
            <div className="text-secondary bg-primary w-128 h-128 rounded-2xl p-6 flex flex-col shadow-xl border-seondary border-2 m-4"> 
                {/* Logo */}
                <div className="flex-grow h-3/12 flex justify-center items-center">
                    <div className="h-full" >
                        <img src="logo.png" className="h-full"/>
                    </div>
                </div>
                {/* Name */}
                <div className="flex-grow h-1/12 flex justify-center items-center">
                    <p  className="text-secondary text-md font-extrabold md:text-2xl">{name}</p>
                </div>
                {/* Content */}
                <div className="flex-grow h-7/12 flex flex-col justify-center items-center">
                    {/* Creation date */}
                    <div className="flex flex-grow flex-col justify-center items-center">
                        <div className="flex-grow flex justify-center items-center ">
                            <p className="text-secondary text-xs font-bold md:text-bold md:text-xl">Creation Date:</p>
                        </div>
                        <div className="flex-grow flex justify-center items-center">
                            <p className="text-secondary text-xs font md:text-bold md:text-xl">{creationDate}</p>
                        </div>
                    </div>
                    {/* Unlock date */}
                    <div className="flex flex-grow flex-col justify-center items-center">
                        <div className="flex-grow flex justify-center items-center ">
                            <p className="text-secondary text-xs font-bold md:text-bold md:text-xl">Unlock Date:</p>
                        </div>
                        <div className="flex-grow flex justify-center items-center">
                            <p className="text-secondary text-xs font md:text-bold md:text-xl">{unlockDate}</p>
                        </div>
                    </div>
                    {/* Creators */}
                    <div className="h-4/6 w-full flex-grow justify-center items-center m-4 bg-secondary text-primary rounded-2xl overflow-hidden">
                        <div className="h-1/6 flex-grow flex justify-center items-center">
                            <p className="text-primary text-xs font-bold md:text-bold md:text-xl">Creators:</p>
                        </div>
                        <div className="h-5/6 overflow-y-auto">
                            {
                                creators.map(creator => {
                                    return (
                                        <p className="text-center" key={creators.indexOf(creator)}>
                                            {creator}
                                        </p>

                                    )})
                            }
                            
                        </div>
                    </div>
                </div>
                {/* Ok Button */}
                <div className="flex-grow h-1/12 flex justify-center items-center">
                    <button className="bg-secondary text-primary h-full w-full rounded-2xl" onClick={toggleModal}>Close</button>
                </div>
            </div>
        </div>
    )
}

function Capsule({capsule, countdown, toggleModal, handleLock}) {
    return(
        <div className="flex justify-center items-center h-16 bg-primary rounded-2xl overflow-hide">
            {/* Logo */}
            <div className="h-full w-3/12 flex-grow flex items-center justify-center bg-secondary rounded-l-2xl border-2 border-primary">
                <div className="h-full" >
                    <img src="logo.png" className="h-full"/>
                </div>
            </div>
            {/* Title + Countdown */}
            <div className="flex flex-col flex-grow w-6/12 cursor-pointer" onClick={toggleModal}>
                {/* Title */}
                <div className="flex-grow flex justify-center items-center">
                    <p  className="text-secondary text-md font-extrabold md:text-2xl text-center">{capsule.name}</p>
                </div>
                {/* Countdown */}
                <div className="flex-grow flex justify-center items-center">
                    <p className="text-secondary text-xs font-semibold md:text-bold md:text-xl">{countdown}</p>
                </div>
            </div >
            {/* Lock/Unlock button */}
            <div className="flex-grow flex justify-center items-center h-full w-3/12 bg-secondary rounded-r-2xl border-2 border-primary">
                <button 
                    id={capsule.id}
                    className={classname("text-primary text-xs font-semibold md:text-bold md:text-xl w-full h-full outline-none", {"opacity-50 cursor-not-allowed": capsule.state === 1})}
                    onClick={(e) => capsule.state === 0 && handleLock(e)}
                >
                    {capsule.state === 0 && "Lock"}
                    {capsule.state === 1 && "Locked"}
                </button>
            </div>
        </div>
    )
}

function Dashboard() {

    const [modalIsActive, setModalIsActive] = useState(false)
    const [modalCapsuleId, setModalCapsuleId] = useState(null)

    const dispatch = useDispatch()
    
    const history = useHistory()

    const members = useSelector(selectMembers)
    const membersIds = useSelector(selectMembersIds)


    const profile = useSelector(selectProfile)

    const capsules = useSelector(selectCapsules)
    const capsulesIds = useSelector(selectCapsulesIds)
    const capsulesStatus = useSelector(selectCapsulesStatus)

    function toggleModal(isActive, id){
        setModalCapsuleId(id)
        setModalIsActive(isActive)
    }

    function getMemberId(capsuleMembersIds){
        // Gets the current user's member id from the capsule members list 

        const userMembersIds = membersIds.filter((memberId) => members[memberId].userId === profile.id)
        const memberId = capsuleMembersIds.filter((memberId) => userMembersIds.includes(memberId))[0]
        return memberId
    }

    function handleLock(e){
        const capsule = capsules[e.target.id]
        if (capsule){
            const memberId = getMemberId(capsule.members)
            history.push(`/edit/${memberId}`)
        }
    }

    return (
        // dummy div for modal
        <div> 
            {modalIsActive && modalCapsuleId !== null &&
                <CapsuleDetailsModal 
                    toggleModal={() => toggleModal(!modalIsActive)}
                    name={capsules[modalCapsuleId].name}
                    creationDate={capsules[modalCapsuleId].creationDate}    
                    unlockDate={capsules[modalCapsuleId].unlockDate}
                    creators={capsules[modalCapsuleId].members.map(id => members[id].user_name)}    
                />}
            <div className="bg-secondary min-h-128 rounded-b-2xl p-6 space-y-2">
                {
                    capsulesStatus === 'pending' && !capsules &&
                        
                        <p>Loading</p>
                }
                {
                    capsules &&
                        capsulesIds.map(capsule => {
                            return (
                                <Capsule 
                                    key={capsules[capsule].id} 
                                    capsule={capsules[capsule]} 
                                    handleLock={handleLock}
                                    countdown={"zby"} toggleModal={() => toggleModal(!modalIsActive, capsules[capsule].id)
                                }/>
                        )})
                }
            </div>
        </div>
    )
}

export default Dashboard
