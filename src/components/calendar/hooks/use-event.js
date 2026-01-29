import dayjs from 'dayjs';
import { useMemo } from 'react';

import { CALENDAR_COLOR_OPTIONS } from 'src/_mock';

// ----------------------------------------------------------------------

const notFoundEvent = { event: null, index: -1 };

export function useEvent(events, selectedEventId, selectedRange) {
  const currentEventIndex = events.findIndex((event) => event.id === selectedEventId);

  const defaultValues = useMemo(
    () => ({
      id: '',
      title: '',
      description: '',
      color: CALENDAR_COLOR_OPTIONS[1],
      allDay: false,
      start: selectedRange?.start ?? dayjs().valueOf(),
      end: selectedRange?.end ?? dayjs().valueOf(),
    }),
    [selectedRange]
  );

  if (currentEventIndex === -1) {
    return notFoundEvent;
  }

  const currentEvent = events[currentEventIndex] ?? null;

  if (currentEvent || selectedRange) {
    return {
      event: { ...defaultValues, ...currentEvent },
      index: currentEventIndex,
    };
  }

  return notFoundEvent;
}
