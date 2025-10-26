// Simple toast utility for use before toast context is fully integrated
export const showToast = {
  success: (message) => {
    // For now, use browser alert - will be replaced with proper toast system
    console.log(' SUCCESS:', message);
  },
  error: (message) => {
    console.log(' ERROR:', message);
  },
  warning: (message) => {
    console.log(' WARNING:', message);
  },
  info: (message) => {
    console.log('ℹ INFO:', message);
  }
};
