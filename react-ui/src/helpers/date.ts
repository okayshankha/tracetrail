import DayJs from 'dayjs'
import AdvancedDayJsFormat from 'dayjs/plugin/advancedFormat'

DayJs.extend(AdvancedDayJsFormat)

export function FormatTime(isoString: string): string {
  const date = DayJs(isoString)
  const now = DayJs()

  // If the date is more than 60 minutes ago, return the formatted date-time
  if (now.diff(date, 'minute') > 60) {
    return formatDate(date)
  }

  // Otherwise, return the human-readable time
  const diffInMs = now.diff(date)
  const diffInSec = Math.round(diffInMs / 1000)
  const diffInMin = Math.round(diffInSec / 60)

  if (diffInMin >= 1) {
    return `${diffInMin} minutes ago`
  } else {
    return `${diffInSec} seconds ago`
  }
}

function formatDate(date: DayJs.Dayjs): string {
  return date.format('Do MMM, YYYY h:mm A')
}
