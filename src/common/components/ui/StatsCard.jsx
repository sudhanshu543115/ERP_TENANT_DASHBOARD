// components/StatsCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend = null,
  trendValue = null,
  subtitle = null,
  isLoading = false,
  onClick = null,
}) => {

  const colorVariants = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      iconBg: 'bg-blue-500',
      border: 'border-blue-100 dark:border-blue-500/20',
      text: 'text-blue-900 dark:text-blue-300',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-500/10',
      iconBg: 'bg-green-500',
      border: 'border-green-100 dark:border-green-500/20',
      text: 'text-green-900 dark:text-green-300',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      iconBg: 'bg-purple-500',
      border: 'border-purple-100 dark:border-purple-500/20',
      text: 'text-purple-900 dark:text-purple-300',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      iconBg: 'bg-orange-500',
      border: 'border-orange-100 dark:border-orange-500/20',
      text: 'text-orange-900 dark:text-orange-300',
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-500/10',
      iconBg: 'bg-pink-500',
      border: 'border-pink-100 dark:border-pink-500/20',
      text: 'text-pink-900 dark:text-pink-300',
    },
  };

  const colors = colorVariants[color] || colorVariants.blue;

  if (isLoading) {
    return (
      <div className={`p-6 rounded-xl border ${colors.border} ${colors.bg} animate-pulse`}>
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 dark:bg-slate-600 rounded"></div>
          </div>
          <div className={`p-3 rounded-lg ${colors.iconBg} opacity-50`}>
            <div className="w-6 h-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`
        relative p-6 rounded-xl border
        ${colors.border} ${colors.bg}
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:shadow-xl dark:hover:shadow-black/30' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={`text-sm font-medium ${colors.text} opacity-80`}>
            {title}
          </p>

          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </h3>

            {trend && (
              <span className={`
                text-sm font-semibold flex items-center
                ${trend === 'up'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'}
              `}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-lg ${colors.iconBg} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full ${colors.iconBg}`}
          />
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
