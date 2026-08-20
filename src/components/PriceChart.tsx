import React from 'react';

interface PriceData {
  time: string;
  price: number;
  type: 'peak' | 'normal' | 'solar';
}

const PriceChart: React.FC = () => {
  const priceData: PriceData[] = [
    { time: '6 AM', price: 8.5, type: 'solar' },
    { time: '9 AM', price: 10.2, type: 'normal' },
    { time: '12 PM', price: 11.8, type: 'normal' },
    { time: '3 PM', price: 13.5, type: 'normal' },
    { time: '6 PM', price: 18.2, type: 'peak' },
    { time: '9 PM', price: 16.8, type: 'peak' },
    { time: '12 AM', price: 9.5, type: 'normal' },
    { time: '3 AM', price: 7.2, type: 'solar' },
  ];

  const maxPrice = Math.max(...priceData.map(d => d.price));
  const minPrice = Math.min(...priceData.map(d => d.price));
  const range = maxPrice - minPrice;

  const getBarColor = (type: string) => {
    switch (type) {
      case 'peak': return 'bg-red-500 dark:bg-red-400';
      case 'solar': return 'bg-green-500 dark:bg-green-400';
      default: return 'bg-blue-500 dark:bg-blue-400';
    }
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case 'peak': return 'stroke-red-500 dark:stroke-red-400';
      case 'solar': return 'stroke-green-500 dark:stroke-green-400';
      default: return 'stroke-blue-500 dark:stroke-blue-400';
    }
  };

  const getBarHeight = (price: number) => {
    return ((price - minPrice) / range) * 100;
  };

  const getYPosition = (price: number) => {
    return 100 - ((price - minPrice) / range) * 100;
  };

  // Generate SVG path for the line graph
  const generateLinePath = () => {
    const points = priceData.map((data, index) => {
      const x = (index / (priceData.length - 1)) * 100;
      const y = getYPosition(data.price);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="w-full">
      {/* Chart Container */}
      <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 w-12">
          <span>₹{maxPrice}</span>
          <span>₹{Math.round((maxPrice + minPrice) / 2)}</span>
          <span>₹{minPrice}</span>
        </div>

        {/* Chart area with bars and line graph */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0">
            <div className="h-full flex flex-col justify-between">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border-t border-gray-200 dark:border-gray-600"></div>
              ))}
            </div>
          </div>

          {/* SVG for line graph */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Line graph */}
            <path
              d={generateLinePath()}
              stroke="currentColor"
              className="text-gray-400 dark:text-gray-500"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {priceData.map((data, index) => {
              const x = (index / (priceData.length - 1)) * 100;
              const y = getYPosition(data.price);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  className={`${getLineColor(data.type)} fill-current`}
                />
              );
            })}
          </svg>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {priceData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative w-full">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 hover:opacity-80 ${getBarColor(data.type)} opacity-30`}
                    style={{ height: `${getBarHeight(data.price)}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      ₹{data.price}/kWh
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                  {data.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Normal Hours</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Peak Hours</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Solar Hours</span>
        </div>
      </div>

      {/* Chart Type Toggle */}
      <div className="flex justify-center mt-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button className="px-3 py-1 text-xs rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm">
            Bar + Line
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceChart; 