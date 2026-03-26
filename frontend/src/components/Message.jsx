import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Message = ({ variant = 'blue', children }) => {
  const styles = {
    red: {
      container: 'bg-red-50 text-red-800 border-red-200',
      icon: <AlertCircle className="text-red-600" size={20} />
    },
    green: {
      container: 'bg-green-50 text-green-800 border-green-200',
      icon: <CheckCircle2 className="text-green-600" size={20} />
    },
    blue: {
      container: 'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]',
      icon: <Info className="text-[#0ea5e9]" size={20} />
    },
    yellow: {
      container: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      icon: <AlertTriangle className="text-yellow-600" size={20} />
    },
  };

  const current = styles[variant] || styles.blue;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-4 p-4 mb-6 border-2 rounded-2xl shadow-sm ${current.container}`}
    >
      <div className="shrink-0 mt-0.5">{current.icon}</div>
      <div className="text-sm font-black italic uppercase leading-tight tracking-tight">{children}</div>
    </motion.div>
  );
};
export default Message;
