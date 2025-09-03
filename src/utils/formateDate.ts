function formatDateToPeruMySQL(date:Date) {
  const peruOffsetMinutes = -5 * 60; // GMT-5
  const localDate = new Date(date.getTime() + peruOffsetMinutes * 60000);

  const isoString = localDate.toISOString();
  const formatted = isoString.slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:mm:ss"

  return formatted;
}

export default formatDateToPeruMySQL;