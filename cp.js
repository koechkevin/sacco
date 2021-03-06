const fs = require('fs');
const data = {
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "outDir":"dist",
    "jsx": "react"
  },
  "include": [
    "src", "api"
  ]
}
fs.writeFile('tsconfig.json', JSON.stringify(data), (err) => { if (err) throw err;});
