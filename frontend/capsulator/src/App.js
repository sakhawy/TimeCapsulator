import './App.css';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar'


function App() {
  return (
    <div className="bg-primary min-h-screen p-6">
      {/* skeleton */}
      <div className="md:w-5/6 m-auto h-full">
        {/* navbar */}
        <div className="h-20 bg-red-100">
          <Navbar></Navbar>
        </div>
        {/* body */}
        <div className="rounded-b-2xl">

          {/* Landing page */}
          <LandingPage />


        </div>
      </div>
    </div>
  );
}

export default App;
