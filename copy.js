const fs = require('fs');
const path = require('path');
const buildDir = path.join(__dirname, '/build/contracts');
const frontendContractsDir = path.join(__dirname, '/client/src/contracts');


function copyfunc() {
  try {
    if (!fs.existsSync(buildDir)) {
      process.exit(1);
    }

    if (!fs.existsSync(frontendContractsDir)) {
      fs.mkdirSync(frontendContractsDir, { recursive: true });
    }

    const contractFiles = fs.readdirSync(buildDir).filter(file => file.endsWith('.json'));
    
    if (contractFiles.length === 0) {
      process.exit(1);
    }
    
    contractFiles.forEach(file => {
      try {
        const sourcePath = path.join(buildDir, file);
        const destPath = path.join(frontendContractsDir, file);
       
        const contractData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
        
        if (!contractData.networks || Object.keys(contractData.networks).length === 0) {
          return;
        }
        fs.copyFileSync(sourcePath, destPath);
  
      } catch (error) {
        console.error(error.message);
      }
    });
  } catch (error) {
    process.exit(1);
  }
}

copyfunc();
