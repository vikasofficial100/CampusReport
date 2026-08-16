import { ShieldCheck, FileText, Send, Search, CheckCircle2 } from "lucide-react";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-[calc(100vh-76px)] flex flex-col bg-base">
      
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center px-6 py-16 md:py-24 space-y-20 w-full max-w-6xl mx-auto">
        
        {/* 1. Hero Section */}
        <section className="text-center max-w-3xl w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-structural text-white rounded-[10px] mb-6 shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-structural tracking-tight mb-6">
            About CampusResolve
          </h1>
          <p className="text-lg md:text-xl font-medium text-structural-muted leading-relaxed">
            A centralized platform for reporting and resolving campus issues at NIT Patna.
          </p>
        </section>

        {/* 2. What is CampusResolve? */}
        <section className="bg-white p-8 md:p-12 rounded-[10px] border border-border shadow-sm text-center max-w-4xl w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-structural mb-4">
            One platform. Every campus issue.
          </h2>
          <p className="text-[16px] text-structural-muted leading-relaxed max-w-2xl mx-auto">
            CampusResolve allows NIT Patna students to report campus-related problems, track their progress, and stay informed until resolution.
          </p>
        </section>

        {/* 3. How It Works */}
        <section className="w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-structural mb-10 text-center">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 01 — Report */}
            <div className="bg-white p-8 rounded-[10px] border border-border flex flex-col items-center text-center transition-shadow hover:shadow-sm">
              <span className="text-[12px] font-bold text-structural-muted uppercase tracking-widest mb-6 block">
                01 — Report
              </span>
              <div className="w-14 h-14 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural mb-5">
                <FileText size={28} />
              </div>
              <p className="text-[14px] text-structural-muted leading-relaxed">
                Describe the issue, select a category, provide the location, and submit your complaint.
              </p>
            </div>

            {/* 02 — Categorize & Route */}
            <div className="bg-white p-8 rounded-[10px] border border-border flex flex-col items-center text-center transition-shadow hover:shadow-sm">
              <span className="text-[12px] font-bold text-structural-muted uppercase tracking-widest mb-6 block">
                02 — Categorize & Route
              </span>
              <div className="w-14 h-14 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural mb-5">
                <Send size={28} />
              </div>
              <p className="text-[14px] text-structural-muted leading-relaxed">
                The complaint is categorized and directed to the appropriate department.
              </p>
            </div>

            {/* 03 — Track */}
            <div className="bg-white p-8 rounded-[10px] border border-border flex flex-col items-center text-center transition-shadow hover:shadow-sm">
              <span className="text-[12px] font-bold text-structural-muted uppercase tracking-widest mb-6 block">
                03 — Track
              </span>
              <div className="w-14 h-14 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural mb-5">
                <Search size={28} />
              </div>
              <p className="text-[14px] text-structural-muted leading-relaxed">
                Follow your complaint as it moves through the resolution process.
              </p>
            </div>

            {/* 04 — Resolve (Uses Status Green) */}
            <div className="bg-white p-8 rounded-[10px] border border-border flex flex-col items-center text-center transition-shadow hover:shadow-sm">
              <span className="text-[12px] font-bold text-[#22c55e] uppercase tracking-widest mb-6 block">
                04 — Resolve
              </span>
              <div className="w-14 h-14 bg-[#22c55e]/10 rounded-[10px] flex items-center justify-center text-[#22c55e] mb-5">
                <CheckCircle2 size={28} />
              </div>
              <p className="text-[14px] text-structural-muted leading-relaxed">
                The concerned official addresses the issue and records the resolution.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;