function LandingPage() {
    return (
        <div>
            {/* About TimeCapsulator */}
            <div className="flex flex-col h-48 md:h-64 justify-center items-center bg-secondary rounded-b-2xl p-4">
                <div className="flex justify-center items-center felx-grow">    
                    <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-primary">Time Capsulator</h1>
                </div>

                <div className="flex justify-center items-center felx-grow">    
                    <p className="text-primary text-xs font-semibold md:text-bold md:text-xl text-center ">
                        You're taking a sip from your favourite drink at a beautiful weekend evening. While swiming in an ocean of thoughts,
                        you remember a precious memory from a few years ago, and... you just smile and continue with your beautiful evening.
                        That's what Time Capsulator is all about. You put some precious memories here to be reminded of them once they're forgotten! 
                    </p>
                </div>
            </div>
            {/* Features */}
            <div className="flex flex-col justify-center items-center h-96">
                {/* dummy div to center childern */}
                <div> 
                    <div className="flex justify-center items-center flex-grow mb-4">    
                        <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-secondary ">Key Features</h1>
                    </div>
                    {/* dummy div to use margin in child div */}
                    <div className="w-full flex-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-start items-center sm:w-128 mb-4">
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">
                                Sending images and messages to your future self.
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-start items-center sm:w-128 ml-4 md:ml-16 lg:ml-24 mb-4">
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">
                            Getting an email when the capsule is open.
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-start items-center sm:w-128 ml-8 md:ml-32 lg:ml-48 mb-4">
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">
                                Making a shared Time Capsule with firends.
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-start items-center sm:w-128 ml-4 md:ml-16 lg:ml-24 mb-4">
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">
                                Hiding stuff from firends till the capsule is opened.
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-start items-center sm:w-128">
                            <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">
                                Making time capsules public or private.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How To Start */}
            <div className="bg-secondary flex flex-col items-center justify-center h-48 rounded-2xl">
                {/* div to center text */}
                <div className="flex-grow flex justify-center items-center">    
                    <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-primary ">How To Start</h1>
                </div>
                <button className="rounded-md bg-primary text-secondary w-40 md:w-80 h-2 flex-grow font-bold text-2xl">Sign Up</button>
                <div className="flex-grow flex justify-center items-center">
                    <p className="text-primary text-xs font-semibold md:text-bold md:text-xl">Create an account and enjoy the app right away!</p>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
