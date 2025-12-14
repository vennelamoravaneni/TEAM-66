import React, { useContext, useMemo } from 'react';
import { AppContext } from '../types';
import { HospitalCard } from './HospitalCard';
import { MapComponent } from './MapComponent';
import { ProcessedHospital, CoverageStatus } from '../types';
import { Filter, Search } from 'lucide-react';
import { hospitals } from '../data/hospitals';

export const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  
  if (!context) return null;

  const { 
    userPolicy, setUserPolicy, 
    requiredSpecialty, setRequiredSpecialty,
    selectedHospital, setSelectedHospital,
    hoveredHospitalId, setHoveredHospitalId
  } = context;

  // Derived State / Filter Logic
  const processedHospitals = useMemo(() => {
    return hospitals.map((h): ProcessedHospital => {
      let status: CoverageStatus = 'UNAVAILABLE';
      
      const hasSpecialty = h.specialties.includes(requiredSpecialty);
      const hasPartner = h.network_partners.includes(userPolicy);

      if (hasSpecialty && hasPartner) {
        status = 'CASHLESS';
      } else if (hasSpecialty && !hasPartner) {
        status = 'REIMBURSEMENT';
      } else {
        status = 'UNAVAILABLE';
      }

      return { ...h, status };
    }).sort((a, b) => {
      const score = (status: string) => {
        if (status === 'CASHLESS') return 3;
        if (status === 'REIMBURSEMENT') return 2;
        return 1;
      };
      return score(b.status) - score(a.status);
    });
  }, [userPolicy, requiredSpecialty]);

  const stats = {
    cashless: processedHospitals.filter(h => h.status === 'CASHLESS').length,
    total: processedHospitals.length
  };

  return (
    <div className="flex-1 flex pt-16 overflow-hidden relative h-full">
      {/* Left Panel - Scrollable List */}
      <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 h-full transition-colors duration-300">
        
        {/* Filters Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-20 shrink-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Find Care</h1>
            <p className="text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-medical-600 dark:text-medical-400">{stats.cashless}</span> cashless hospitals found nearby
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Insurance Provider</label>
              <div className="relative">
                <select 
                  value={userPolicy}
                  onChange={(e) => setUserPolicy(e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium transition-colors"
                >
                  <option>Star Health</option>
                  <option>HDFC Ergo</option>
                  <option>ICICI Lombard</option>
                  <option>Niva Bupa</option>
                </select>
                <Filter className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Treatment For</label>
              <div className="relative">
                <select 
                  value={requiredSpecialty}
                  onChange={(e) => setRequiredSpecialty(e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium transition-colors"
                >
                  <option>Orthopedics</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Gastroenterology</option>
                </select>
                <Search className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Card List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth">
          {processedHospitals.map(hospital => (
            <HospitalCard 
              key={hospital.id}
              hospital={hospital}
              onClick={setSelectedHospital}
              onHover={setHoveredHospitalId}
              isHovered={hoveredHospitalId === hospital.id}
            />
          ))}
          <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm">
            End of results for {requiredSpecialty}
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="hidden md:block flex-1 h-full relative bg-slate-100 dark:bg-slate-950">
        <MapComponent 
          hospitals={processedHospitals}
          hoveredHospitalId={hoveredHospitalId}
          selectedHospital={selectedHospital}
          onSelect={setSelectedHospital}
        />
        
        <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 z-[400] text-xs font-medium space-y-2 pointer-events-none text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span> Cashless
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Reimbursement
          </div>
            <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400"></span> Unavailable
          </div>
        </div>
      </div>
    </div>
  );
};