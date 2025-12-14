import React from 'react';
import { ProcessedHospital, CoverageStatus } from '../types';
import { MapPin, Star, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface HospitalCardProps {
  hospital: ProcessedHospital;
  onClick: (hospital: ProcessedHospital) => void;
  onHover: (id: string | null) => void;
  isHovered: boolean;
}

const statusConfig = {
  CASHLESS: {
    color: 'border-l-status-success',
    badgeBg: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    icon: <CheckCircle size={16} className="text-green-600 dark:text-green-400" />,
    label: 'Cashless Partner'
  },
  REIMBURSEMENT: {
    color: 'border-l-status-warning',
    badgeBg: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    icon: <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400" />,
    label: 'Reimbursement'
  },
  UNAVAILABLE: {
    color: 'border-l-status-error',
    badgeBg: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    icon: <XCircle size={16} className="text-red-600 dark:text-red-400" />,
    label: 'Unavailable'
  }
};

export const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, onClick, onHover, isHovered }) => {
  const config = statusConfig[hospital.status];

  return (
    <motion.div
      layoutId={`card-${hospital.id}`}
      className={`
        bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700
        p-5 cursor-pointer transition-all duration-300 relative overflow-hidden
        border-l-4 ${config.color}
        ${isHovered ? 'shadow-md translate-x-1 dark:bg-slate-750' : 'hover:shadow-md'}
      `}
      onClick={() => onClick(hospital)}
      onMouseEnter={() => onHover(hospital.id)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">{hospital.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <MapPin size={14} /> {hospital.address}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            {hospital.rating}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{hospital.distance}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 items-center">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${config.badgeBg}`}>
          {config.icon}
          {config.label}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          {hospital.tier}
        </span>
      </div>
      
      {hospital.status !== 'UNAVAILABLE' && (
        <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Matches: <span className="font-medium text-slate-600 dark:text-slate-300">{hospital.specialties.join(', ')}</span>
        </div>
      )}
    </motion.div>
  );
};