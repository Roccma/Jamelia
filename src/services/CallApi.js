import Environment from "../environment/Environment";

export async function CallApi(endpoint, token = "", options = {}) {
  options.headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`
  };

  const url = Environment.BASE_URL + endpoint;
  const response = await fetch(url, options);
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    if (options.method === "DELETE") return { result: "ok" };
  }
}
