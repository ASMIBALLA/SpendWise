'use client'

import { motion } from 'framer-motion'
import { IndianRupee, Wallet, PieChart, Coins, Rocket, Target, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AnimatedBackground() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50 dark:bg-slate-950">
      {/* Dynamic Animated Gradient Blobs - Bolder and bigger */}
      <motion.div
        className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-purple-500/40 dark:bg-purple-600/30 rounded-full blur-[100px]"
        animate={{
          x: [0, 100, -20, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[20%] -right-[15%] w-[600px] h-[600px] bg-emerald-400/30 dark:bg-emerald-500/20 rounded-full blur-[120px]"
        animate={{
          x: [0, -100, 40, 0],
          y: [0, -120, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[20%] left-[20%] w-[550px] h-[550px] bg-pink-400/30 dark:bg-pink-600/20 rounded-full blur-[100px]"
        animate={{
          x: [0, 120, -50, 0],
          y: [0, -80, 60, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] -right-[10%] w-[400px] h-[400px] bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-[90px]"
        animate={{
          x: [0, -50, 80, 0],
          y: [0, -40, 100, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Finance Icons - Playful Gen-Z Vibe */}
      <FloatingIcon
        Icon={IndianRupee}
        className="absolute top-[15%] left-[10%] text-emerald-500/40 dark:text-emerald-400/30 w-24 h-24"
        delay={0}
      />
      <FloatingIcon
        Icon={Wallet}
        className="absolute top-[20%] right-[15%] text-purple-500/40 dark:text-purple-400/30 w-28 h-28"
        delay={2}
      />
      <FloatingIcon
        Icon={PieChart}
        className="absolute bottom-[20%] left-[15%] text-pink-500/40 dark:text-pink-400/30 w-32 h-32"
        delay={4}
      />
      <FloatingIcon
        Icon={Coins}
        className="absolute bottom-[25%] right-[10%] text-amber-500/50 dark:text-amber-400/40 w-20 h-20"
        delay={1}
      />
      <FloatingIcon
        Icon={Rocket}
        className="absolute top-[40%] left-[5%] text-blue-500/40 dark:text-blue-400/30 w-16 h-16"
        delay={3}
      />
      <FloatingIcon
        Icon={Target}
        className="absolute top-[60%] right-[5%] text-red-500/30 dark:text-red-400/20 w-20 h-20"
        delay={2.5}
      />
      <FloatingIcon
        Icon={Zap}
        className="absolute bottom-[5%] left-[45%] text-yellow-500/40 dark:text-yellow-400/30 w-24 h-24"
        delay={1.5}
      />
    </div>
  )
}

function FloatingIcon({ Icon, className, delay }: { Icon: any, className: string, delay: number }) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0, rotate: 0 }}
      animate={{
        y: [-30, 30, -30],
        rotate: [-10, 20, -10],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      <Icon className="w-full h-full drop-shadow-xl" strokeWidth={1.5} />
    </motion.div>
  )
}
