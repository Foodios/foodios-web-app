/**
 * Utility to generate metadata for API requests matching specific regex patterns.
 * 
 * requestId: [0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}
 * requestDateTime: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[-+]\d{2}:\d{2}
 * channel: (ONL|OFF)
 */

export const generateApiMetadata = (channel: 'ONL' | 'OFF' = 'OFF') => {
  const requestId = crypto.randomUUID();
  
  const now = new Date();
  
  // Local time parts
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
  
  // Get timezone offset in +/-HH:mm
  const offsetMinutes = -now.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60).toString().padStart(2, '0');
  const offsetMins = (Math.abs(offsetMinutes) % 60).toString().padStart(2, '0');
  const timezoneOffset = `${offsetSign}${offsetHours}:${offsetMins}`;

  const requestDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffset}`;

  return {
    requestId,
    requestDateTime,
    channel
  };
};
