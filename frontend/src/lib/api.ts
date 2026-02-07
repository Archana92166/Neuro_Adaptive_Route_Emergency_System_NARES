export async function getSensoryRoutes(body: any) {
  const res = await fetch("http://localhost:5000/api/navigation/routes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to fetch routes");

  return await res.json(); // MUST be array
}

export async function sendNavigationFeedback(body: {
  routeId: string;
  comfortable: boolean;
  stressPoints: string[];
}) {
  const res = await fetch("http://localhost:5000/api/navigation/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to send feedback");
  }

  return res.json();
}
