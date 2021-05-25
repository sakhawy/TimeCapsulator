function Navbar() {
    return (
        <nav class="h-full">
          <div class="flex overflow-hidden h-full ">
            <div class="h-full rounded-t-2xl lg:w-80 bg-secondary flex-grow flex items-center justify-center">
              <img src="./logo.png" alt="" className="h-full"/>
            </div>
            <div class="h-full lg:w-80 bg-gray-500 flex-grow flex items-center justify-center">
              <p1 class="text-secondary text-2xl md:text-4xl font-bold">Logo</p1>
            </div>
            <div class="h-full lg:w-80 bg-gray-500 flex-grow flex items-center justify-center">
              <p1 class="text-secondary text-2xl md:text-4xl font-bold">Logo</p1>
            </div>

          </div>
        </nav>
    )
}

export default Navbar
