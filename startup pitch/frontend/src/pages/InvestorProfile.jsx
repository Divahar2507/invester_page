import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";

export default function InvestorProfile() {
  const { id } = useParams();
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await api.getInvestor(id);
        if (mounted) setInvestor(res);
      } catch (err) {
        setError(err.message || "Failed to load investor");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  if (loading) return <div>Loading investor…</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!investor) return <div>No investor found.</div>;

  return (
    <div>
      <h2>{investor.name}</h2>
      <p><strong>About:</strong> {investor.bio}</p>
      <p><strong>Focus:</strong> {investor.focus}</p>
      <h3>Recent Investments</h3>
      <ul>
        {investor.recent_investments?.map((r) => (
          <li key={r.id}>{r.name} — {r.amount}</li>
        ))}
      </ul>
    </div>
  );
}
