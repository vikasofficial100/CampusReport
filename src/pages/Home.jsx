import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-76px)] px-6 text-center">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-structural tracking-tight">
            Campus Grievance Resolution, Simplified.
          </h1>
          <p className="text-lg text-structural-muted max-w-xl mx-auto">
            NIT Patna's official internal platform to report academic, hostel, and administrative issues. Track your complaint from submission to resolution.
          </p>
        </div>

        {/* The ONE Dominant Action */}
        <div className="pt-4">
          <Link 
            to="/report-issue" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-[14px] shadow-lg hover:bg-accent-hover transition-colors text-lg"
          >
            Report an Issue
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="flex items-center justify-center gap-6 pt-12 text-structural-muted">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck size={18} className="text-status-green" />
            <span>Internal & Secure</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border"></div>
          <div className="text-sm font-medium">
            Requires @nitp.ac.in Login
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;