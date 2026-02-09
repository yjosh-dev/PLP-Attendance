import "./home.css"
import img from "../../assets/img/plp.webp"
import plplogo from "../../assets/logo/plp.png"
export default function Home() {
    return (
        <div 
          className="background-image w-screen h-screen flex items-center justify-center"
          style={{backgroundImage: `url(${img})`}}>
            {/* GREEN OVERLAY FOR BACKGROUND IMAGE */}
          <div className="w-screen h-screen absolute opacity-70 bg-green-800 flex items-center justify-center "></div>
            {/* LOGIN BOX CONTAINER */}
          <div className="z-50 w-[40%] h-[80%] bg-white rounded-sm flex flex-col items-center mt-10 gap-5">
            {/* WHITE CIRCLE OVERLAY FOR PLP ICON*/}
            <div className="w-28 h-28 rounded-full bg-white -mt-15 flex justify-center items-center">
              <img src={plplogo} className="w-24 h-24"/> 
            </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="mt-3 text-3xl font-bold inter">Welcome!</h1>
                <h1 className="text-md text-gray-500 inter">Please enter your PLP account.</h1>
              </div>
              <div className="flex flex-col gap-6">
                <input type="text" className="w-80 h-8 bg-gray-300 rounded-md pl-3 text-black" placeholder="Email"></input>
                <input type="text" className="w-80 h-8 bg-gray-300 rounded-md pl-3" placeholder="Password"></input>
                <input type="checkbox" className="w-5 h-5 border-2 border-gray-500 rounded-md"></input>
              </div>
          </div>
        </div>
    )
}