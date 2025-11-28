"use client";

import { SiTypescript, SiReact, SiNextdotjs, SiTailwindcss, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiPython, SiPandas, SiNumpy, SiScikitlearn } from "react-icons/si";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tech = [
  { name: "TypeScript", icon: SiTypescript },
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Express", icon: SiExpress },
  { name: "MongoDB", icon: SiMongodb },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Python", icon: SiPython },
  { name: "Pandas", icon: SiPandas },
  { name: "NumPy", icon: SiNumpy },
  { name: "scikit-learn", icon: SiScikitlearn },
];

export function TechIcons() {
  return (
    <div className="flex flex-wrap gap-4 mt-10">
      {tech.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={i}
            whileHover={{ scale: 1.15, y: -4 }}
            transition={{ type: "spring", stiffness: 250, damping: 12 }}
            className={cn(
              "w-14 h-14 rounded-full border border-white/10",
              "bg-white/5 backdrop-blur-sm",
              "flex items-center justify-center cursor-pointer",
              "hover:border-white/30 hover:bg-white/10"
            )}
            title={item.name}
          >
            <Icon className="text-2xl text-white/80" />
          </motion.div>
        );
      })}
    </div>
  );
}
