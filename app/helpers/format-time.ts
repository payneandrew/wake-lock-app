import { helper } from '@ember/component/helper';

export default helper(function formatTime([timestamp]: [Date]) {
  if (!timestamp) return '';
  
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  // If less than 1 minute ago, show "just now"
  if (diff < 60000) {
    return 'just now';
  }
  
  // If less than 1 hour ago, show minutes
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Otherwise show time in HH:MM format
  return timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
});