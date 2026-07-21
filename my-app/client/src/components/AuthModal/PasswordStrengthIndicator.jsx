import React from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrengthIndicator = ({ password }) => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let strengthScore = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
  
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-400';
  
  if (strengthScore >= 4) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-400';
  } else if (strengthScore >= 2) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-amber-400';
  }

  if (password.length === 0) {
    strengthScore = 0;
  }

  const requirements = [
    { label: '8+ characters', met: hasMinLength },
    { label: 'Uppercase', met: hasUpperCase },
    { label: 'Lowercase', met: hasLowerCase },
    { label: 'Number', met: hasNumber },
  ];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden flex gap-1">
          <div className={`h-full flex-1 transition-all duration-300 ${password.length > 0 ? strengthColor : 'bg-transparent'}`} />
          <div className={`h-full flex-1 transition-all duration-300 ${strengthScore >= 2 ? strengthColor : 'bg-transparent'}`} />
          <div className={`h-full flex-1 transition-all duration-300 ${strengthScore >= 4 ? strengthColor : 'bg-transparent'}`} />
        </div>
        {password.length > 0 && (
          <span className={`text-[10px] font-medium uppercase tracking-wider w-12 text-right ${strengthColor.replace('bg-', 'text-')}`}>
            {strengthLabel}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {req.met ? (
              <Check size={11} className="text-emerald-500" strokeWidth={3} />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full border border-slate-200 flex items-center justify-center">
                {password.length > 0 && <X size={7} className="text-slate-300" />}
              </div>
            )}
            <span className={`text-[11px] ${req.met ? 'text-slate-700' : 'text-slate-400'}`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
