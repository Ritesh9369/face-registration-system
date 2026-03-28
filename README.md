⚡ Install ka sahi tarika (v3)

👉 Run karo:

npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
📁 Kaun kaun si files banti hai?
1️⃣ tailwind.config.js

👉 Ye main Tailwind config file hai

👉 Isme tum define karte ho:

Kaunse files me Tailwind use hoga
Custom design (colors, spacing)

👉 Example:

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
2️⃣ postcss.config.js

👉 Ye PostCSS config file hai

👉 Ye kaam karta hai:

Tailwind ko process karta hai
Browser compatibility handle karta hai

👉 Example:

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}