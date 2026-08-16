const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-6 text-center">
      <div className="w-10 h-10 border-4 border-structural/20 border-t-accent rounded-full animate-spin mb-4"></div>
      <h2 className="text-lg font-bold text-structural">{text}</h2>
      <p className="text-sm text-structural-muted mt-1">Please wait while CampusResolve prepares your data.</p>
    </div>
  );
};

export default Loader;