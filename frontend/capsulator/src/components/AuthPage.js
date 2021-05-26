function AuthPage() {
    return (
        <div className="flex flex-col bg-secondary items-center justify-center h-80 sm:min-h-0 rounded-b-2xl p-4 rounded-tl-2xl">
            <div className="flex-grow flex justify-center items-center">    
                <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-primary ">Create a new account</h1>
            </div>
            <button className="rounded-md bg-primary text-secondary w-40 md:w-80 h-2 flex-grow font-bold text-2xl">With Google</button>
            <div className="flex-grow flex justify-center items-center">    
                <h1 className="text-2xl font-bold md:text-3xl md:font-extrabold text-primary ">Login</h1>
            </div>
            <button className="rounded-md bg-primary text-secondary w-40 md:w-80 h-2 flex-grow font-bold text-2xl">With Google</button>
            <div className="flex-grow flex justify-center items-center">
                <p className="text-primary text-xs font-semibold md:text-sm text-center">
                    Make sure that you use a google account that you'll likely be using for a few more years because the Time Capsule notification emails will be sent there.
                </p>
            </div>
        </div>
    )
}

export default AuthPage
