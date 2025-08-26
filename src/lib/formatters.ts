const DATE_TIME_FORMATTER = new Intl.DateTimeFormat(undefined , {
  dateStyle:"medium",
  timeStyle:"short"
})
export function formateDateTime(dateTime : Date){
  return DATE_TIME_FORMATTER.format(dateTime)
}