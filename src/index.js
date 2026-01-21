import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 📁 **Correct Location:**
```
src/
├── App.jsx
├── index.css
└── index.js    ← CREATE THIS!
