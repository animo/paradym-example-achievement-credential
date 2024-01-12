const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const fetchHighScoreFromAPI = async () => {
  const response = await fetch(`${API_URL}/highscore`);
  const data = await response.json();
  return data;
};

export const postScoreToAPI = async (score: number) => {
  const response = await fetch(`${API_URL}/highscore`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score }),
  });
  const data = await response.json();
  return data;
};
