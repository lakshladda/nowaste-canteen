import React from 'react';

export const StatCard = ({ title, value, unit, subtitle, icon: Icon, color = 'forest', trend }) => {
  const colorMap = {
    forest: 'bg-forest-50 text-forest-700 border-forest-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80'
  };

  const badgeColor = colorMap[color] || colorMap.forest;

  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-900">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-semibold text-neutral-500">
                {unit}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl border ${badgeColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>{subtitle}</span>
          {trend && (
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
