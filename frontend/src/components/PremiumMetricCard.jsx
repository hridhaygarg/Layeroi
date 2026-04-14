import { motion } from 'framer-motion';

export function PremiumMetricCard({
  label,
  value,
  unit = '',
  icon = '📊',
  trend = null,
  color = 'green',
  delay = 0,
}) {
  const colorMap = {
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    purple: 'from-purple-500 to-pink-600',
    orange: 'from-orange-500 to-red-600',
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
    >
      {/* Background Gradient Blob */}
      <motion.div
        className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-r ${colorMap[color]} rounded-full opacity-10 blur-3xl`}
        animate={{
          x: [0, 15, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
              <motion.span
                className="text-4xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: delay + 0.3 }}
              >
                {value}
              </motion.span>
              {unit && <span className="text-lg text-gray-500">{unit}</span>}
            </div>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>

        {trend && (
          <motion.div
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              trend.direction === 'up'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.4 }}
          >
            <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
            <span>{trend.percent}% from last month</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
