import { Link } from "react-router-dom";
import { ArrowRight, Camera, Search, CheckCircle2 } from "lucide-react";
import Footer from "../components/Footer"; // Importing the footer we built!

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-76px)] flex flex-col bg-base">
      
      {/* Main Content Area - flex-grow pushes the footer to the bottom */}
      <main className="flex-grow flex flex-col justify-center items-center px-6">
        
        {/* Hero Section: The 1-2 Second Zone */}
        <div className="max-w-3xl mx-auto pt-16 pb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-structural mb-6 tracking-tight leading-tight">
            Something broken on campus?
          </h1>
          <p className="text-lg text-structural-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            From a broken streetlight near the hostels to a waterlogged path by the academic block — report it with a photo and location, and follow it through to resolution.
          </p>
          
          <div className="flex flex-col items-center gap-5">
            {/* Primary CTA - The ONLY amber element on the screen */}
            <Link 
              to="/report-issue" 
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white font-bold text-[16px] px-10 py-4 rounded-[10px] shadow-sm transition-colors w-full sm:w-auto"
            >
              Report an Issue
            </Link>
            
            {/* Secondary CTA - Quiet and structural */}
            <Link 
              to="/track-complaint" 
              className="text-[14px] font-semibold text-structural-muted hover:text-structural transition-colors flex items-center gap-1.5"
            >
              Already reported something? Track it <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* "How it works" Strip */}
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-t border-border">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural mb-4">
              <Camera size={24} />
            </div>
            <h3 className="text-[16px] font-bold text-structural mb-1">Report</h3>
            <p className="text-[14px] text-structural-muted">Describe it, add a photo and location</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-[16px] font-bold text-structural mb-1">Track</h3>
            <p className="text-[14px] text-structural-muted">Get a reference number, watch its status</p>
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Status green is reserved ONLY for the resolved state */}
            <div className="w-12 h-12 bg-[#22c55e]/10 rounded-[10px] flex items-center justify-center text-[#22c55e] mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-[16px] font-bold text-structural mb-1">Resolved</h3>
            <p className="text-[14px] text-structural-muted">The right department handles it, you're notified</p>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="pb-12 text-center mt-auto">
          <p className="text-[13px] font-medium text-structural-muted">
            340+ issues resolved this semester · Avg. response time: 3 days
          </p>
        </div>
        
      </main>

      {/* Footer attached to the bottom */}
      <Footer />
    </div>
  );
};

export default Home;