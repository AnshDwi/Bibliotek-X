import { motion } from "framer-motion";

import { AnimatedCounter } from "./AnimatedCounter.jsx";
import { Badge } from "./Badge.jsx";

export const MetricCard = ({ label, value, hint, tone = "info", suffix = "", prefix = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -6, scale: 1.01 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="glass-card hover-lift rounded-3xl p-5"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          {typeof value === "number" ? (
            <>
              {prefix}
              <AnimatedCounter value={value} suffix={suffix} />
            </>
          ) : (
            value
          )}
        </h3>
      </div>
      <Badge tone={tone}>{hint}</Badge>
    </div>
  </motion.div>
);
