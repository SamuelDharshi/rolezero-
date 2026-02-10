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

export type RoleStatusKey = 'upcoming' | 'active' | 'expired';

export function getRoleStatus(startTime: number, expiryTime: number): { key: RoleStatusKey; label: string; color: string } {
  const now = Date.now();

  if (now < startTime) {
    return { key: 'upcoming', label: 'Upcoming', color: '#F59E0B' };
  } else if (now >= startTime && now <= expiryTime) {
    return { key: 'active', label: 'Active', color: '#10B981' };
  } else {
    return { key: 'expired', label: 'Expired', color: '#EF4444' };
  }
}

export function isExpired(timestamp: number): boolean {
  return Date.now() > timestamp;
}

export function isScheduledForExecution(scheduledTime: number): boolean {
  return Date.now() >= scheduledTime;
}
