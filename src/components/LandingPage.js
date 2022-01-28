import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useHistory } from "react-router"

function LandingPage() {

    const history = useHistory()
    function handleSignup(){
        history.push("/auth")
    }

    return (
        <div className="flex flex-col space-y-6">
            {/* About TimeCapsulator */}
            <div className="flex flex-col justify-center items-center bg-secondary rounded-b-2xl p-4">
                <div className="flex justify-center items-center felx-grow">    
                    <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-primary">Time Capsulator</h1>
                </div>

                <div className="flex justify-center items-center felx-grow">    
                    <p className="text-primary text-xs font-semibold md:text-bold md:text-xl text-center ">
                        You're taking a sip from your favourite drink on a beautiful weekend evening. While swiming in an ocean of thoughts,
                        you remember a precious memory from a few years ago, and... you just smile and continue with your beautiful evening.
                        That's what Time Capsulator is all about. You put some precious memories here to be reminded of them once they're forgotten! 
                    </p>
                </div>
            </div>
            {/* Features */}
            <div className="flex flex-col justify-center items-center">
                    <div className="flex justify-center items-center flex-grow mb-4">    
                        <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-secondary ">Key Features</h1>
                    </div>
                    {/* dummy div to use margin in child div */}
                    <div className="w-full flex-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-start items-center mr-8 md:mr-32 lg:mr-48 mb-4">
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl text-center">
                                Sending images and messages to your future self.
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-start items-center ml-4 md:ml-16 lg:ml-24 mb-4 mr-4 md:mr-16 lg:mr-24 text-center">
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">
                            Getting an email when the capsule is open.
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-start items-center ml-8 md:ml-32 lg:ml-48 mb-4 text-center">
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">
                                Making a shared Time Capsule with firends.
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-start items-center ml-4 md:ml-16 lg:ml-24 mb-4 mr-4 md:mr-16 lg:mr-24 text-center">
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">
                                Hiding stuff from firends till the capsule is opened.
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-start items-center mr-8 md:mr-32 lg:mr-48 text-center">
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">
                                Making time capsules public or private.
                            </p>
                        </div>
                    </div>
            </div>

            {/* How To Start */}
            <div className="bg-secondary flex flex-col items-center justify-center rounded-2xl space-y-2 p-4">
                {/* div to center text */}
                <div className="flex-grow flex justify-center items-center">    
                    <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-primary ">How To Start</h1>
                </div>
                <button 
                    className="rounded-md bg-primary text-secondary w-40 md:w-80 h-16 flex-grow font-bold text-2xl"
                    onClick={handleSignup}
                >
                    <div className="h-full w-full flex items-center justify-center space-x-2">
                        <FontAwesomeIcon icon={faUser} />
                        <p>
                            Sign Up
                        </p>
                    </div>
                </button>
                <div className="flex-grow flex justify-center items-center">
                    <p className="text-primary text-xs font-semibold md:text-bold md:text-xl text-center">Create an account and enjoy the app right away!</p>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
