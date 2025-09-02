const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        {/* Rotating blocks */}
        <div className="w-12 h-12 relative animate-spin">
          <div className="absolute top-0 left-0 w-3 h-3 bg-minecraft-grass animate-pulse"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-minecraft-gold animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-minecraft-diamond animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-minecraft-redstone animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>
        
        {/* Center block */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-minecraft-stone animate-bounce"></div>
      </div>
      
      <span className="ml-4 font-minecraft text-muted-foreground">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;