import { useEffect, useState } from "react"
import classname from 'classnames'
import { useDispatch, useSelector } from "react-redux"
import { createCapsule } from "../store/capsulesSlice"
import { fetchProfile, selectProfile } from "../store/profileSlice"

function Create() {
    const [shareButton, setShareButton] = useState(0)
    const [publicButton, setPublicButton] = useState(0)
    const [name, setName] = useState("")
    const [unlockDate, setUnlockDate] = useState("")

    const profile = useSelector(selectProfile)

    const dispatch = useDispatch()

    function handleCreateCapsule(){
        dispatch(createCapsule({name: "test", unlockDate: '2000-11-11', member: profile.id}))
    }

    return (
        <div className="bg-secondary h-128 rounded-b-2xl p-4 ">
            <div className="flex flex-col space-y-2">
                {/* Create Capsule */}
                <div className="flex justify-center items-center felx-grow">    
                        <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-primary">Create a Time Capsule</h1>
                </div>
                {/* Choose Name */}
                <div className="flex justify-center items-center felx-grow h-16">
                    <div className="text-primary text-sm font-bold md:text-bold md:text-xl flex flex-grow justify-center items-center rounded-l-2xl h-full w-2/6 border-primary border-2 rounder-l-2xl">
                        <p>Name</p>
                    </div>
                    <input 
                        className="bg-primary text-secondary text-sm font-bold md:text-bold md:text-xl outline-none flex-grow w-4/6 h-full rounded-r-2xl" 
                        type="text"
                        onChange={(e) => {setName(e.target.value)}}
                    />
                </div>
                {/* Choose unlock date */}
                <div className="flex justify-center items-center felx-grow h-16">
                    <div className="text-primary text-sm font-bold md:text-bold md:text-xl flex flex-grow justify-center items-center rounded-l-2xl h-full w-2/6 border-primary border-2 rounder-l-2xl">
                        <p>Unlock Date</p>
                    </div>
                    <input 
                        className="bg-primary text-secondary text-sm font-bold md:text-bold md:text-xl outline-none flex-grow w-4/6 h-full rounded-r-2xl" 
                        type="date"
                        onChange={(e) => {setName(e.target.value)}}
                    />
                </div>
                {/* Choose share & make public */}
                <div className="flex justify-center items-start felx-grow flex-col space-y-2">
                    <div className="flex-grow flex justify-center items-center"> 
                        <button 
                            className="flex-grow flex justify-center items-center space-x-2"
                            onClick={() => setShareButton(!shareButton)}
                        >
    
                            <button className={classname("border-2 border-primary h-6 w-6 rounded-lg", {"bg-primary": shareButton, "bg-secondary": !shareButton})}></button>
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">Shareable with friends</p>

                        </button>
                    </div>

                    <div className="flex-grow flex justify-center items-center">
                        <button className="flex-grow flex justify-center items-center space-x-2"
                            onClick={() => setPublicButton(!publicButton)} 
                        >
                            <button className={classname("border-2 border-primary h-6 w-6 rounded-lg", {"bg-primary": publicButton, "bg-secondary": !publicButton})}></button>
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">Viewable for public</p>
                        </button>
                    </div>
                </div>

                {/* Create Button */}
                <div className="flex flex-col flex-grow w-full items-center justify-center h-16">
                    <button 
                        className="rounded-md bg-primary text-secondary w-full h-full font-bold text-2xl"
                        onClick={handleCreateCapsule} 
                    >Create</button>
                </div>
            </div>
        </div>
    )
}

export default Create
