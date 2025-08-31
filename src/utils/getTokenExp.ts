function getTokenExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return null;
    return payload.exp * 1000; // devuelve la fecha exacta en ms
    // return Date.now() + 11 * 60 * 1000; //para prueba
  } catch {
    return null;
  }
}
export default getTokenExp;
