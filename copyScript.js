

const fs = require('fs');
const path = require('path');

// Define source and destination directories
const buildDir = path.join(__dirname, '/build/contracts');
const frontendContractsDir = path.join(__dirname, '/client/src/contracts');

console.log('Starting contract ABI copy process...');

/**
 * Main function to copy contract ABIs
 */
function copyContractABIs() {
  try {
    // Check if build directory exists
    if (!fs.existsSync(buildDir)) {
      console.error('Build directory not found!');
      console.log('Run "truffle compile" first to generate contract artifacts');
      process.exit(1);
    }

    // Create frontend contracts directory if it doesn't exist
    if (!fs.existsSync(frontendContractsDir)) {
      fs.mkdirSync(frontendContractsDir, { recursive: true });
    }

    // Get list of contract files
    const contractFiles = fs.readdirSync(buildDir).filter(file => file.endsWith('.json'));
    
    if (contractFiles.length === 0) {
      console.error('No contract files found in build directory!');
      console.log('Run "truffle compile" to generate contract artifacts');
      process.exit(1);
    }

    console.log(`Found ${contractFiles.length} contract files to copy:`);
    
    // Copy each contract file
    let copiedCount = 0;
    let skippedCount = 0;

    contractFiles.forEach(file => {
      try {
        const sourcePath = path.join(buildDir, file);
        const destPath = path.join(frontendContractsDir, file);
        
        // Read the contract artifact
        const contractData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
        
        // Skip if no networks (not deployed)
        if (!contractData.networks || Object.keys(contractData.networks).length === 0) {
          console.log(`Skipping ${file} (not deployed)`);
          skippedCount++;
          return;
        }
        
        // Copy the file
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file}`);
      
        copiedCount++;
        
      } catch (error) {
        console.error(`Error copying ${file}:`, error.message);
      }
    });

    // Summary
    console.log('='.repeat(40));
    console.log(`Successfully copied: ${copiedCount} files`);
    console.log(`Skipped (not deployed): ${skippedCount} files`);
    console.log(`Total files processed: ${contractFiles.length}`)


  } catch (error) {
    console.error('Fatal error during copy process:', error);
    process.exit(1);
  }
}
console.log('Copying contracts to folder:', frontendContractsDir);



copyContractABIs();
