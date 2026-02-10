import { format as formatDate, formatDistance, formatDistanceToNow, isAfter, isBefore } from 'date-fns';

export function formatTimestamp(timestamp: number, formatStr: string = 'PPpp'): string {
  try {
    return formatDate(new Date(timestamp), formatStr);
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid date';
  }
}

export function getRelativeTime(timestamp: number): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'Unknown';
  }
}

export function getRoleStatus(startTime: number, expiryTime: number): 'upcoming' | 'active' | 'expired' {
  const now = Date.now();
  
  if (now < startTime) {
    return 'upcoming';
  } else if (now >= startTime && now <= expiryTime) {
    return 'active';
  } else {
    return 'expired';
  }
}

export function isExpired(timestamp: number): boolean {
  return Date.now() > timestamp;
}

export function isScheduledForExecution(scheduledTime: number): boolean {
  return Date.now() >= scheduledTime;
}
