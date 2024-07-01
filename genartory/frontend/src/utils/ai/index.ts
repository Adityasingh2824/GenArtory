// frontend/src/utils/ai/index.ts

// Re-export all functions and types from sub-modules
export * from './generation';
export * from './types';

// Explicit exports for convenience and clarity (optional)
export { generateArt } from './generation'; 
export { GenerateArtRequest } from './types'; //and more based on what is defined in generation and types
