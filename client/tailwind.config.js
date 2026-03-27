export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090b",
        panel: "#111827",
        aurora: "#34d399",
        pulse: "#38bdf8",
        ember: "#fb7185"
      },
      boxShadow: {
        glow: "0 0 40px rgba(56, 189, 248, 0.18)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(56,189,248,0.28), transparent 32%), radial-gradient(circle at top right, rgba(52,211,153,0.2), transparent 24%), linear-gradient(140deg, rgba(15,23,42,0.95), rgba(2,6,23,1))"
      }
    }
  },
  plugins: []
};

