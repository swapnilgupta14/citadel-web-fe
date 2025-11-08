import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Rocket, Zap, Package, TestTube, Palette, Code } from 'lucide-react'

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['welcome'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { message: 'Welcome to your modern React app! 🚀' }
    },
  })

  const features = [
    { icon: Zap, text: 'Vite for blazing fast builds', color: 'text-yellow-600' },
    { icon: Package, text: 'PNPM for fast package management', color: 'text-orange-600' },
    { icon: Code, text: 'React Query for data management', color: 'text-blue-600' },
    { icon: Palette, text: 'Tailwind CSS for styling', color: 'text-cyan-600' },
    { icon: Rocket, text: 'Framer Motion for animations', color: 'text-purple-600' },
    { icon: TestTube, text: 'Vitest + ESLint + Prettier', color: 'text-green-600' },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent"
        >
          React + TypeScript + Tailwind
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 space-y-2"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-2 text-gray-700"
            >
              <feature.icon className={`h-5 w-5 ${feature.color}`} />
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary-600 flex items-center gap-2"
          >
            <Loader2 className="animate-spin" />
            <span>Loading...</span>
          </motion.div>
        ) : error ? (
          <div className="text-red-600">Error loading data</div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="border-primary-100 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-4"
          >
            <p className="text-primary-900 font-medium">{data?.message}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          Edit <code className="rounded bg-gray-100 px-2 py-1">src/App.tsx</code> to get started
        </motion.div>
      </motion.div>
    </div>
  )
}

export default App
