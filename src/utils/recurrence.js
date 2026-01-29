import { dayjs } from './format-time';

/**
 * Calculate recurring meeting instances based on recurrence settings
 * @param {Object} meeting - The meeting object with recurrence settings
 * @param {Date|number} viewStart - Start of the view range (optional)
 * @param {Date|number} viewEnd - End of the view range (optional)
 * @returns {Array} Array of meeting instances with calculated dates
 */
export function calculateRecurringInstances(meeting, viewStart = null, viewEnd = null) {
  if (!meeting.is_recurring) {
    return [];
  }

  const instances = [];
  const {
    start_at,
    end_at,
    recurrence_frequency,
    recurrence_interval = 1,
    recurrence_by_week_day,
    recurrence_by_month_day,
    recurrence_end_type,
    recurrence_count,
    recurrence_until,
  } = meeting;

  const duration = dayjs(end_at).diff(dayjs(start_at));
  const maxOccurrences = recurrence_count || 100; // Default max for 'never' type
  let currentDate = dayjs(start_at);

  // Move to next occurrence (skip the first one as it's the original meeting)
  currentDate = getNextOccurrence(
    currentDate,
    recurrence_frequency,
    recurrence_interval,
    recurrence_by_week_day,
    recurrence_by_month_day
  );

  let count = 0;
  const maxIterations = 1000; // Safety limit

  while (count < maxIterations) {
    // Check end conditions
    if (recurrence_end_type === 'count' && instances.length >= maxOccurrences - 1) {
      break;
    }

    if (recurrence_end_type === 'date' && recurrence_until) {
      if (currentDate.isAfter(dayjs(recurrence_until))) {
        break;
      }
    }

    if (recurrence_end_type === 'never' && instances.length >= maxOccurrences - 1) {
      break;
    }

    // If view range is specified, only include instances within range
    if (viewStart && viewEnd) {
      if (currentDate.isAfter(dayjs(viewEnd))) {
        break;
      }
      if (currentDate.isBefore(dayjs(viewStart))) {
        currentDate = getNextOccurrence(
          currentDate,
          recurrence_frequency,
          recurrence_interval,
          recurrence_by_week_day,
          recurrence_by_month_day
        );
        count++;
        continue;
      }
    }

    // Create instance
    const instanceStart = currentDate.valueOf();
    const instanceEnd = currentDate.add(duration, 'millisecond').valueOf();

    instances.push({
      ...meeting,
      id: `${meeting.id}_recurrence_${count}`, // Virtual ID for recurring instance
      start_at: instanceStart,
      end_at: instanceEnd,
      is_recurring_instance: true,
      recurrence_parent_id: meeting.id,
    });

    currentDate = getNextOccurrence(
      currentDate,
      recurrence_frequency,
      recurrence_interval,
      recurrence_by_week_day,
      recurrence_by_month_day
    );

    count++;
  }

  return instances;
}

/**
 * Get the next occurrence date based on recurrence rules
 */
function getNextOccurrence(currentDate, frequency, interval, byWeekDay, byMonthDay) {
  let next = currentDate.clone();

  switch (frequency) {
    case 'DAILY':
      next = next.add(interval, 'day');
      break;

    case 'WEEKLY':
      if (byWeekDay && byWeekDay.length > 0) {
        // Find next matching weekday
        const weekDayMap = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
        const targetDays = byWeekDay.map((d) => weekDayMap[d]).sort((a, b) => a - b);
        const currentDay = next.day();

        let foundNext = false;
        // Check remaining days in current week
        for (const targetDay of targetDays) {
          if (targetDay > currentDay) {
            next = next.day(targetDay);
            foundNext = true;
            break;
          }
        }

        // If no day found in current week, go to first day of next interval week
        if (!foundNext) {
          const daysUntilNextWeek = 7 - currentDay + targetDays[0];
          next = next.add(daysUntilNextWeek + (interval - 1) * 7, 'day');
        }
      } else {
        next = next.add(interval, 'week');
      }
      break;

    case 'MONTHLY':
      if (byMonthDay && byMonthDay.length > 0) {
        // Find next matching month day
        const currentMonthDay = next.date();
        const sortedDays = [...byMonthDay].sort((a, b) => a - b);

        let foundNext = false;
        // Check remaining days in current month
        for (const targetDay of sortedDays) {
          if (targetDay > currentMonthDay) {
            next = next.date(targetDay);
            foundNext = true;
            break;
          }
        }

        // If no day found in current month, go to first day of next interval month
        if (!foundNext) {
          next = next.add(interval, 'month').date(sortedDays[0]);
        }
      } else {
        next = next.add(interval, 'month');
      }
      break;

    case 'YEARLY':
      next = next.add(interval, 'year');
      break;

    default:
      next = next.add(interval, 'day');
  }

  return next;
}

/**
 * Expand all recurring meetings in a list to include their instances
 * @param {Array} meetings - Array of meetings
 * @param {Date|number} viewStart - Start of the view range (optional)
 * @param {Date|number} viewEnd - End of the view range (optional)
 * @returns {Array} Expanded array with all meetings and their recurring instances
 */
export function expandRecurringMeetings(meetings, viewStart = null, viewEnd = null) {
  const expanded = [];

  meetings.forEach((meeting) => {
    // Add the original meeting
    expanded.push(meeting);

    // Add recurring instances if applicable
    if (meeting.is_recurring) {
      const instances = calculateRecurringInstances(meeting, viewStart, viewEnd);
      expanded.push(...instances);
    }
  });

  return expanded;
}
