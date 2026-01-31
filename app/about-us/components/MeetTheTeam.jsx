// components/MeetTheTeam.jsx
import Image from "next/image";

export default function MeetTheTeam() {
  return (
    <section className="relative min-h-[400px] bg-white flex flex-col lg:flex-row overflow-hidden">
      
      {/* Right decorative border */}
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent lg:block hidden" />

      {/* Left Sidebar */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center items-start p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-white border-r border-red-500/30">
        <div className="flex flex-col items-start space-y-6">
          
          <div className="flex items-center space-x-3">
            <div className="w-3 h-10 bg-red-600" />
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
              Our Brokers & Agents
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent leading-tight">
            MEET
            <br />
            <span className="text-5xl lg:text-6xl">THE TEAM</span>
          </h2>

          <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-red-700 font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-yellow-500">
            Learn More
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-full lg:w-2/3 p-8 lg:p-12 flex flex-col justify-center">
        <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-2xl font-light">
          The Oppenheimer Group, led Founder and Jason Oppenheimer, dominant force
          <br />
          Southern California luxury real estate market offices Hollywood, Newport Beach,
          <br />
          San Diego, Calo Luces.
        </p>
      </div>

    </section>
  );
}
