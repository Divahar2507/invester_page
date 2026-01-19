import React from "react";
import { useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";
import { getName } from "../auth.js";

function StatCard({ icon, label, value, delta, tint }) {
  return (
    <div className="dash-card">
      <div className="dash-card-top">
        <div className={`dash-icon ${tint}`}>{icon}</div>
        <div className="dash-delta">
          <span className="dash-delta-up">↗</span> {delta}
        </div>
      </div>
      <div className="dash-card-label">{label}</div>
      <div className="dash-card-value">{value}</div>
    </div>
  );
}

function PitchRow({ badge, title, desc, metaLeft, metaRight, imageKind }) {
  return (
    <div className="pitch-row">
      <div className={`pitch-thumb ${imageKind}`}>
        <div className="pitch-badge">{badge}</div>
      </div>

      <div className="pitch-body">
        <div className="pitch-head">
          <div className="pitch-title">{title}</div>
          <button className="kebab" type="button" aria-label="More">•••</button>
        </div>

        <div className="pitch-desc">{desc}</div>

        <div className="pitch-meta">
          <div className="pitch-meta-left">{metaLeft}</div>
          <div className="pitch-meta-right">{metaRight}</div>
        </div>
      </div>
    </div>
  );
}

function MatchRow({ name, role, match }) {
  return (
    <div className="match-row">
      <div className="avatarRound" />
      <div className="match-mid">
        <div className="match-name">{name}</div>
        <div className="match-role">{role}</div>
        <div className="match-pill">
          <span className="dot online" /> {match} Match
        </div>
      </div>
      <button className="btnGhost" type="button">Connect</button>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const name = getName();

  return (
    <DashShell>
      <div className="dash-content">
        <div className="dash-hero">
          <div>
            <h1>Good morning, {name}</h1>
            <p>Here is your startup’s daily brief and pitch performance.</p>
          </div>

          <div className="dash-status">
            <span className="chip"><span className="dot online" /> Online</span>
            <span className="chip">Oct 24, 2023</span>
          </div>
        </div>

        <div className="dash-stats">
          <StatCard tint="tintBlue" icon={<span className="emojiIcon">📁</span>} label="Total Pitches" value="4" delta="+20%" />
          <StatCard tint="tintPurple" icon={<span className="emojiIcon">👁️</span>} label="Investor Views" value="128" delta="+12%" />
          <StatCard tint="tintOrange" icon={<span className="emojiIcon">✳️</span>} label="Match Score" value="85%" delta="+5%" />
        </div>

        <div className="dash-grid">
          <div className="dash-panel">
            <div className="panel-head">
              <h3>Recent Pitches</h3>
              <a className="viewAll" href="#" onClick={(e) => e.preventDefault()}>View All</a>
            </div>

            <div className="panel-body">
              <PitchRow
                badge="V3.0"
                imageKind="imgChart"
                title="Series A Deck"
                desc="Updated financial projections and added new team slides based on feedback from last week’s meeting."
                metaLeft={
                  <>
                    <span className="tag amber">Editing</span>
                    <span className="metaDot" />
                    <span className="metaItem">👁 14</span>
                  </>
                }
                metaRight={<span className="metaItem">🕒 2h ago</span>}
              />

              <PitchRow
                badge="FINAL"
                imageKind="imgMeeting"
                title="Seed Round Teaser"
                desc="One-pager summary for cold outreach campaigns. Currently being viewed by 3 investors."
                metaLeft={
                  <>
                    <span className="tag green">Shared</span>
                    <span className="metaDot" />
                    <span className="metaItem">👁 85</span>
                  </>
                }
                metaRight={<span className="metaItem">🕒 1d ago</span>}
              />

              <PitchRow
                badge=" "
                imageKind="imgDoc"
                title="Q3 Board Update"
                desc="Quarterly report presentation draft."
                metaLeft={
                  <>
                    <span className="tag gray">Draft</span>
                    <span className="metaDot" />
                    <span className="metaItem">👁 0</span>
                  </>
                }
                metaRight={<span className="metaItem">🕒 5d ago</span>}
              />
            </div>
          </div>

          <div className="dash-rightcol">
            <div className="dash-panel">
              <div className="panel-head">
                <h3>Match Opportunities</h3>
                <a className="arrowLink" href="#" onClick={(e) => e.preventDefault()}>→</a>
              </div>

              <div className="panel-body compact">
                <MatchRow name="Michael Ross" role="Partner @ Ventura Capital" match="98%" />
                <div className="divider" />
                <MatchRow name="Sarah Jenning" role="Angel Investor" match="89%" />
              </div>
            </div>

            <div className="dash-panel" style={{ marginTop: 16 }}>
              <div className="panel-head">
                <h3>Recent Activity</h3>
              </div>

              <div className="panel-body activity">
                <div className="activity-row">
                  <span className="actDot" />
                  <div>
                    <div className="actLine"><b>John Doe</b> commented on slide 4 of “Series A Deck”</div>
                    <div className="actTime">10 min ago</div>
                  </div>
                </div>

                <div className="activity-row">
                  <span className="actDot muted" />
                  <div>
                    <div className="actLine">New match found: <b>TechStar Accelerator</b></div>
                    <div className="actTime">2 hours ago</div>
                  </div>
                </div>

                <div className="activity-row">
                  <span className="actDot muted" />
                  <div>
                    <div className="actLine">You uploaded “<b>Financials_2023.xlsx</b>”</div>
                    <div className="actTime">Yesterday</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dash-cta">
              <div className="dash-cta-icon">🚀</div>
              <div className="dash-cta-title">Boost Visibility</div>
              <div className="dash-cta-sub">
                Get your pitch in front of top-tier investors today.
              </div>
              <button className="dash-cta-btn" type="button" onClick={() => navigate("/upgrade")}>
                UPGRADE PLAN
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashShell>
  );
}