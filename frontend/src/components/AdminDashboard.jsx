import { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Reviews: {stats.total}</p>
      <p>Fake Reviews: {stats.fake}</p>
      <p>Genuine Reviews: {stats.genuine}</p>
    </div>
  );
}