export default function generateIQ() {
    // Parameters for the IQ distribution
    const mean = 100; // Average IQ
    const standardDeviation = 15; // Standard deviation for IQ scores
  
    // Generate two uniform random numbers
    const u1 = Math.random();
    const u2 = Math.random();
  
    // Apply the Box-Muller transform to generate a standard normal distribution
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  
    // Scale and shift to the desired mean and standard deviation
    const iq = Math.round(z * standardDeviation + mean);
  
    // Ensure IQ is within a reasonable range (e.g., 55 to 145)
    return Math.max(45, Math.min(170, iq));
  }