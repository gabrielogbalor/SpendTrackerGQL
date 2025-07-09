/**
 * Date utility functions for consistent date formatting across the application
 */

/**
 * Formats a date for display in tables and cards
 * @param date - Date string, timestamp, or Date object
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export const formatDisplayDate = (date: string | number | Date): string => {
  try {
    let dateObj: Date;
    
    // Handle different input types
    if (typeof date === 'string') {
      // Check if it's a timestamp string (all digits)
      if (/^\d+$/.test(date)) {
        // Convert timestamp string to number, then to Date
        dateObj = new Date(parseInt(date));
      } else {
        // Regular date string
        dateObj = new Date(date);
      }
    } else {
      // Number or Date object
      dateObj = new Date(date);
    }
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date received:', date);
      return 'Invalid Date';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error, 'Input was:', date);
    return 'Invalid Date';
  }
};

/**
 * Formats a date for input fields (YYYY-MM-DD format)
 * @param date - Date string, timestamp, or Date object
 * @returns Date string in YYYY-MM-DD format
 */
export const formatInputDate = (date: string | number | Date): string => {
  try {
    let dateObj: Date;
    
    // Handle different input types
    if (typeof date === 'string') {
      // Check if it's a timestamp string (all digits)
      if (/^\d+$/.test(date)) {
        // Convert timestamp string to number, then to Date
        dateObj = new Date(parseInt(date));
      } else {
        // Regular date string
        dateObj = new Date(date);
      }
    } else {
      // Number or Date object
      dateObj = new Date(date);
    }
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date received:', date);
      return '';
    }
    
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting input date:', error, 'Input was:', date);
    return '';
  }
};

/**
 * Formats a date for GraphQL queries (ISO string format)
 * @param date - Date string, timestamp, or Date object
 * @returns ISO string format
 */
export const formatGraphQLDate = (date: string | number | Date): string => {
  try {
    let dateObj: Date;
    
    // Handle different input types
    if (typeof date === 'string') {
      // Check if it's a timestamp string (all digits)
      if (/^\d+$/.test(date)) {
        // Convert timestamp string to number, then to Date
        dateObj = new Date(parseInt(date));
      } else {
        // Regular date string
        dateObj = new Date(date);
      }
    } else {
      // Number or Date object
      dateObj = new Date(date);
    }
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }
    
    return dateObj.toISOString();
  } catch (error) {
    console.error('Error formatting GraphQL date:', error, 'Input was:', date);
    throw error;
  }
};

/**
 * Gets today's date in YYYY-MM-DD format for default input values
 * @returns Today's date string
 */
export const getTodayInputDate = (): string => {
  return formatInputDate(new Date());
};

/**
 * Checks if a date is valid
 * @param date - Date to validate
 * @returns boolean indicating if date is valid
 */
export const isValidDate = (date: any): boolean => {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      if (/^\d+$/.test(date)) {
        dateObj = new Date(parseInt(date));
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = new Date(date);
    }
    
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
}; 