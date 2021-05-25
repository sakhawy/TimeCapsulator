function LandingPage() {
    return (
        <div>
            {/* About TimeCapsulator */}
            <div className="flex flex-col justify-center items-center sm:h-48 bg-secondary rounded-b-2xl">
                <div className="flex justify-center items-center felx-grow">    
                    <h1 className="text-3xl font-extrabold text-primary ">Time Capsulator</h1>
                </div>

                <div className="flex justify-center items-center felx-grow p-4">    
                    <p className="text-primary font-semibold md:font-bold text-center ">
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
                    <div className="flex justify-center items-center felx-grow mb-4">    
                        <h1 className="text-3xl font-extrabold text-secondary ">Key Features</h1>
                    </div>
                    {/* dummy div to use margin in child div */}
                    <div className="w-full felx-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-center items-center sm:w-128 mb-4">
                            <p className="text-primary text-sm md:text-lg font-bold ">
                                Sending images and messages to your future self.
                            </p>
                        </div>
                    </div>
                    <div className="w-full felx-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-center items-center sm:w-128 ml-4 md:ml-16 lg:ml-24 mb-4">
                            <p className="text-primary text-sm md:text-lg font-bold ">
                            Getting notified on a frequently used email of yours.
                            </p>
                        </div>
                    </div>
                    <div className="w-full felx-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-center items-center sm:w-128 ml-8 md:ml-32 lg:ml-48 mb-4">
                            <p className="text-primary text-sm md:text-lg font-bold ">
                                Making a shared Time Capsule with firends.
                            </p>
                        </div>
                    </div>
                    <div className="w-full felx-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-center items-center sm:w-128 ml-4 md:ml-16 lg:ml-24 mb-4">
                            <p className="text-primary text-sm md:text-lg font-bold ">
                                Hiding content from firends till the Capsule is opened.
                            </p>
                        </div>
                    </div>
                    <div className="w-full felx-grow">
                        <div className="bg-secondary  p-2 rounded-2xl flex justify-center items-center sm:w-128">
                            <p className="text-primary text-sm md:text-lg font-bold ">
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
                    <h1 className="text-3xl font-extrabold text-primary ">How To Start</h1>
                </div>
                <button className="rounded-md bg-primary text-secondary w-80 h-2 flex-grow font-bold text-2xl">Sign Up</button>
                <div className="flex-grow flex justify-center items-center">
                    <p className="text-primary font-semibold md:font-bold">Create an account and enjoy the app right away!</p>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
