const apiUrl =
  process.env.NODE_ENV === "production"
    ? "http://api.reactsns.kro.kr"
    : "http://localhost:8080";

export { apiUrl };
