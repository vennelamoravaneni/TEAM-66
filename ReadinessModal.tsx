import React, { useEffect, useState } from 'react';
import { ProcessedHospital, AIAnalysisResult } from '../types';
import { X, Download, Sparkles, CheckCircle2, UserCheck, FileCheck, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeCoverage } from '../services/aiService';

interface ReadinessModalProps {
  hospital: ProcessedHospital | null;
  onClose: () => void;
  userPolicy: string;
  specialty: string;
}

export const ReadinessModal: React.FC<ReadinessModalProps> = ({ 
  hospital, 
  onClose, 
  userPolicy,
  specialty
}) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const preAuthId = React.useMemo(() => `PRE-${Math.floor(Math.random() * 1000000)}`, []);

  useEffect(() => {
    if (hospital) {
      setAnalysis(null);
      setLoading(true);
      setShowSuccessToast(false);
      
      let estimatedDiagnosis = "General Consultation";
      if (specialty === "Orthopedics") estimatedDiagnosis = "Total Knee Arthroplasty";
      if (specialty === "Cardiology") estimatedDiagnosis = "Coronary Angiography";
      if (specialty === "Neurology") estimatedDiagnosis = "MRI Brain Contrast";
      if (specialty === "Gastroenterology") estimatedDiagnosis = "Endoscopy";
      
      analyzeCoverage(userPolicy, hospital.name, estimatedDiagnosis, hospital.tier, hospital.status)
        .then(setAnalysis)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [hospital, userPolicy, specialty]);

  const handleDownload = () => {
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 3000);
  };

  if (!hospital) return null;

  const isCashless = hospital.status === 'CASHLESS';

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col border dark:border-slate-800"
        >
          {/* Success Toast */}
          <AnimatePresence>
            {showSuccessToast && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg z-50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} />
                <span className="font-semibold text-sm">Pre-Auth Packet Downloaded!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className={`p-6 text-white relative overflow-hidden shrink-0 ${isCashless ? 'bg-medical-600' : hospital.status === 'REIMBURSEMENT' ? 'bg-yellow-600' : 'bg-red-600'}`}>
            <div className="absolute -bottom-2 left-0 right-0 h-4 bg-transparent border-t-4 border-dotted border-white/30"></div>
            
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldIcon size={120} />
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white/90 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                  {isCashless ? 'Admission Pass' : 'Network Alert'}
                </span>
                <span className="text-white/60 text-[10px]">{new Date().toLocaleDateString()}</span>
              </div>
              <h2 className="text-2xl font-bold leading-tight">{hospital.name}</h2>
              <p className="text-white/80 text-sm mt-1">{hospital.address.split(',')[0]}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950">
            
            {/* Details Grid */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-2 gap-y-4 gap-x-2">
               <div>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Patient Name</p>
                 <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">John Doe</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Insurance</p>
                 <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{userPolicy}</p>
               </div>
               <div>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Procedure</p>
                 <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{specialty}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Pre-Auth ID</p>
                 <p className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{isCashless ? preAuthId : 'N/A'}</p>
               </div>
            </div>

            {/* AI Insight */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
               <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide">Velix AI Analysis</h3>
              </div>
              
              {loading ? (
                 <div className="space-y-3 py-1">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
                 </div>
              ) : analysis ? (
                <div className="space-y-3">
                    <p className={`text-sm font-medium ${analysis.isCovered ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                      {analysis.reason}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-700">
                       <span className="text-xs text-slate-500 dark:text-slate-400">Est. Out-of-Pocket</span>
                       <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{analysis.estimatedOutOfPocket}</span>
                    </div>
                </div>
              ) : null}
            </div>

            {/* Checklist */}
            {isCashless && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-3 px-1">Required for TPA Desk</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <UserCheck size={18} className="text-medical-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">Government ID (Aadhaar/PAN)</span>
                    <CheckCircle2 size={16} className="ml-auto text-green-500" />
                  </div>
                   <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <FileCheck size={18} className="text-medical-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">Original Policy Document</span>
                    <CheckCircle2 size={16} className="ml-auto text-green-500" />
                  </div>
                   <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <ClipboardCheck size={18} className="text-medical-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">Past 2 Years Consultation Papers</span>
                    <div className="ml-auto w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button 
                onClick={handleDownload}
                disabled={!isCashless}
                className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm uppercase tracking-wide
                  ${isCashless 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 hover:shadow-xl hover:-translate-y-0.5' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}
                `}
              >
                <Download size={18} />
                {isCashless ? 'Download Pre-Auth Packet' : 'Network Unavailable'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ShieldIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
  </svg>
);