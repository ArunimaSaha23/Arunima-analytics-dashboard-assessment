import React, { useEffect, useState, useRef } from 'react';
import Header from './components/Header';
import InsightCard from './components/InsightCard';
import ModelYearLineChart from './components/ModelYearLineChart';
import MakeBarChart from './components/MakeBarChart';
import CAFVPieChart from './components/CAFVPieChart';
import ModelTable from './components/ModelTable';
import TopCitiesBarChart from './components/TopCitiesBarChart';
import parseCSV from './data/ParseCSV';
import EVTypeBarChart from './components/EVTypeBarChart';
import DonutChart from "./components/DonutChart";
import HeatMap from './components/HeatMap';
import ModelYearTrend from './components/ModelYearTrend';
import BubbleChart from './components/BubbleChart';
import RangeVariationChart from './components/RangeVariationChart';
import TopRangeModelsChart from './components/TopRangeModelsChart';
import DonutChart2 from './components/DonutChart2';

// LazyLoad component to handle intersection observer
const LazyLoad = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When element enters viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing after it's visible
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className="w-full h-full">
      {isVisible ? children : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg" style={{ minHeight: '400px' }}>
          <div className="animate-pulse text-gray-500">Loading chart...</div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [evData, setEvData] = useState([]);

  useEffect(() => {
    parseCSV('/Electric_Vehicle_Population_Data.csv')
      .then(data => setEvData(data))
      .catch(err => console.error("CSV parsing error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 font-sans">
      <Header title="Electric Vehicle Data Analysis" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 ml-12">
        <InsightCard evData={evData} />
      </div>

      {/* Each row in the grid has a consistent height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <ModelYearLineChart evData={evData} />
          </LazyLoad>
        </div>
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <MakeBarChart evData={evData} />
          </LazyLoad>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <CAFVPieChart evData={evData}/>
          </LazyLoad>
        </div>
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <EVTypeBarChart evData={evData} />
          </LazyLoad>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <TopCitiesBarChart evData={evData} />
          </LazyLoad>
        </div>
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <ModelTable evData={evData} />
          </LazyLoad>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <DonutChart data={evData} type="model" />
          </LazyLoad>
        </div>
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <DonutChart data={evData} type="make" />
          </LazyLoad>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <HeatMap data={evData} />
          </LazyLoad>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <ModelYearTrend data={evData} />
          </LazyLoad>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <BubbleChart data={evData} />
          </LazyLoad>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div className="bg-white rounded-lg shadow-md h-full w-[650px]">
          <LazyLoad>
            <RangeVariationChart data={evData} />
          </LazyLoad>
        </div>
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <DonutChart2 data={evData} />
          </LazyLoad>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md h-full">
          <LazyLoad>
            <TopRangeModelsChart data={evData} />
          </LazyLoad>
        </div>
      </div>
      
    </div>
  );
}

export default App;