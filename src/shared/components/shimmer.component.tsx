import React from 'react';

interface ShimmerProps {
  className?: string;
  height?: string;
  width?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ 
  className = "", 
  height = "h-4", 
  width = "w-full" 
}) => {
  return (
    <div 
      className={`${width} ${height} bg-gray-200 rounded ${className}`}
      style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }}
    />
  );
};

export const ShimmerHomeScreen: React.FC = () => {
  return (
    <div className="w-full h-full min-h-screen bg-white overflow-y-auto">
      <div className="w-full min-h-full p-4">
        {/* Header Shimmer */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shimmer className="w-10 h-10 rounded-lg" />
            <Shimmer className="w-20 h-8 rounded-lg" />
          </div>
          <Shimmer className="w-10 h-10 rounded-full" />
        </div>

        {/* Search Bar Shimmer */}
        <div className="w-full px-0.3 py-4 ml-4">
          <Shimmer className="w-full h-12 rounded-lg" />
        </div>

        {/* Banner Shimmer */}
        <div className="w-screen -mx-4 mb-4 rounded-lg bg-gray-100">
          <div className="flex gap-3 overflow-x-auto pb-4 pt-4 pl-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0">
                <Shimmer className="w-88 h-40 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Offer Shimmer */}
        <div className="mb-6">
          <Shimmer className="w-full h-28 rounded-xl mb-4" />
        </div>

        {/* Categories Shimmer */}
        {[1, 2].map((categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            {/* Category Title Shimmer */}
            <div className="flex items-center justify-between mb-4">
              <Shimmer className="w-32 h-8" />
              <Shimmer className="w-8 h-8 rounded-full" />
            </div>

            {/* Products Shimmer */}
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((productIndex) => (
                <div key={productIndex} className="w-full h-36 rounded-xl bg-white flex gap-6">
                  <Shimmer className="w-24 h-24 rounded-xl" />
                  <div className="flex-1 p-4 flex flex-col gap-2">
                    <Shimmer className="w-3/4 h-4" />
                    <Shimmer className="w-full h-3" />
                    <Shimmer className="w-full h-3" />
                    <div className="flex gap-2 mt-2">
                      <Shimmer className="w-16 h-4" />
                      <Shimmer className="w-24 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
             </div>
     </div>
   );
 };
