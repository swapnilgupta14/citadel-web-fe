import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Rocket,
  Zap,
  Package,
  TestTube,
  Palette,
  Code,
} from "lucide-react";

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["welcome"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { message: "Welcome to your mobile app! 📱" };
    },
  });

  const features = [
    { icon: Zap, text: "Vite for blazing fast builds", color: "text-primary" },
    { icon: Package, text: "PNPM for fast packages", color: "text-primary" },
    { icon: Code, text: "React Query for data", color: "text-primary" },
    { icon: Palette, text: "Tailwind CSS styling", color: "text-primary" },
    { icon: Rocket, text: "Framer Motion animations", color: "text-primary" },
    { icon: TestTube, text: "Vitest + ESLint", color: "text-primary" },
  ];

  return (
    <div className="flex h-full flex-col bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-text-primary">
          Mobile React App
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Optimized for mobile screens
        </p>
      </motion.div>

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
              className="flex items-center gap-3 rounded-xl bg-background-secondary p-4 border border-border"
            >
              <div className="flex-shrink-0">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <span className="text-sm font-medium text-text-primary">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-background-secondary p-6 border border-border">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-text-secondary">Loading...</span>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-950 p-6 border border-red-900">
              <p className="text-sm text-red-400">Error loading data</p>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="rounded-xl bg-background-tertiary p-6 border border-border"
            >
              <p className="text-center text-sm font-medium text-text-primary">
                {data?.message}
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 rounded-xl bg-background-secondary p-4 text-center border border-border"
        >
          <p className="text-xs text-text-secondary">
            Edit{" "}
            <code className="rounded bg-background-tertiary px-2 py-1 text-text-primary">
              src/App.tsx
            </code>{" "}
            to get started
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
