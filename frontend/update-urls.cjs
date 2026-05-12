const fs = require('fs');
const files = [
  './src/context/AuthContext.jsx',
  './src/pages/AdminDashboard.jsx',
  './src/pages/Home.jsx',
  './src/components/sections/Contact.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace hardcoded URLs with environment variable fallback
    content = content.replace(/'http:\/\/localhost:5000\/api/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}` + '");
    content = content.replace(/`http:\/\/localhost:5000\/api/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}` + `");
    
    // Clean up if it resulted in + '' or + ``
    content = content.replace(/ \+ ''/g, '');
    content = content.replace(/ \+ ``/g, '');

    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
