import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Rocket, Zap, Package, TestTube, Palette, Code } from 'lucide-react'

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['welcome'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { message: 'Welcome to your mobile app! 📱' }
    },
  })

  const features = [
    { icon: Zap, text: 'Vite for blazing fast builds', color: 'text-yellow-600' },
    { icon: Package, text: 'PNPM for fast packages', color: 'text-orange-600' },
    { icon: Code, text: 'React Query for data', color: 'text-blue-600' },
    { icon: Palette, text: 'Tailwind CSS styling', color: 'text-cyan-600' },
    { icon: Rocket, text: 'Framer Motion animations', color: 'text-purple-600' },
    { icon: TestTube, text: 'Vitest + ESLint', color: 'text-green-600' },
  ]

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Mobile App Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
          Mobile React App
        </h1>
        <p className="mt-1 text-sm text-gray-600">Optimized for mobile screens</p>
      </motion.div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex-shrink-0">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white p-6 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-6 shadow-sm">
              <p className="text-sm text-red-600">Error loading data</p>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-sm"
            >
              <p className="text-center text-sm font-medium text-primary-900">
                {data?.message}
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 rounded-xl bg-white p-4 text-center shadow-sm"
        >
          <p className="text-xs text-gray-500">
            Edit <code className="rounded bg-gray-100 px-2 py-1">src/App.tsx</code> to get
            started
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default App
