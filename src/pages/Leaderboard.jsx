import { useState, useEffect } from 'react'
import './Leaderboard.css'

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [rankStats, setRankStats] = useState([])
  const [viewMode, setViewMode] = useState('revenue') // revenue or units

  useEffect(() => {
    // Load orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const scouts = JSON.parse(localStorage.getItem('scouts') || '[]')

    // Calculate sales per scout
    const salesByScout = {}

    orders.forEach(order => {
      if (order.scoutId) {
        if (!salesByScout[order.scoutId]) {
          salesByScout[order.scoutId] = {
            revenue: 0,
            units: 0
          }
        }
        salesByScout[order.scoutId].revenue += order.total
        salesByScout[order.scoutId].units += order.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    })

    // Create leaderboard array
    const leaderboardData = scouts.map(scout => ({
      ...scout,
      revenue: salesByScout[scout.id]?.revenue || 0,
      units: salesByScout[scout.id]?.units || 0
    }))

    // Sort by selected view mode
    leaderboardData.sort((a, b) => b[viewMode] - a[viewMode])

    setLeaderboard(leaderboardData)

    // Calculate rank statistics
    const rankData = {}
    leaderboardData.forEach(scout => {
      if (!rankData[scout.rank]) {
        rankData[scout.rank] = {
          rank: scout.rank,
          totalRevenue: 0,
          totalUnits: 0,
          scoutCount: 0
        }
      }
      rankData[scout.rank].totalRevenue += scout.revenue
      rankData[scout.rank].totalUnits += scout.units
      rankData[scout.rank].scoutCount += 1
    })

    // Convert to array and calculate averages
    const rankStatsData = Object.values(rankData).map(rank => ({
      ...rank,
      avgRevenue: rank.scoutCount > 0 ? rank.totalRevenue / rank.scoutCount : 0,
      avgUnits: rank.scoutCount > 0 ? rank.totalUnits / rank.scoutCount : 0
    }))

    // Sort by total revenue (descending)
    rankStatsData.sort((a, b) => b[viewMode === 'revenue' ? 'totalRevenue' : 'totalUnits'] - a[viewMode === 'revenue' ? 'totalRevenue' : 'totalUnits'])

    setRankStats(rankStatsData)
  }, [viewMode])

  const getRankBadge = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return null
  }

  const getMilestoneBadge = (units) => {
    if (units >= 50) return '⭐⭐⭐'
    if (units >= 25) return '⭐⭐'
    if (units >= 10) return '⭐'
    return null
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-content">
        <h1>Scout Leaderboard</h1>
        <p className="leaderboard-subtitle">
          Outstanding effort from our Cub Scouts!
        </p>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'revenue' ? 'active' : ''}`}
            onClick={() => setViewMode('revenue')}
          >
            By Revenue
          </button>
          <button
            className={`toggle-btn ${viewMode === 'units' ? 'active' : ''}`}
            onClick={() => setViewMode('units')}
          >
            By Units Sold
          </button>
        </div>

        {leaderboard.length === 0 ? (
          <div className="no-data">
            <p>No sales data yet. Be the first scout to make a sale!</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((scout, index) => (
              <div
                key={scout.id}
                className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}
              >
                <div className="rank-section">
                  <div className="rank-number">#{index + 1}</div>
                  {getRankBadge(index) && (
                    <div className="rank-badge">{getRankBadge(index)}</div>
                  )}
                </div>

                <div className="scout-info">
                  <h3>{scout.name}</h3>
                  <span className="scout-rank">{scout.rank}</span>
                </div>

                <div className="scout-stats">
                  <div className="stat">
                    <span className="stat-value">
                      {viewMode === 'revenue' ? `$${scout.revenue.toFixed(2)}` : scout.units}
                    </span>
                    <span className="stat-label">
                      {viewMode === 'revenue' ? 'Revenue' : 'Units'}
                    </span>
                  </div>
                  {getMilestoneBadge(scout.units) && (
                    <div className="milestone-badge">
                      {getMilestoneBadge(scout.units)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rank Statistics */}
        {rankStats.length > 0 && (
          <div className="rank-stats-section">
            <h2>Sales by Rank</h2>
            <p className="section-subtitle">
              Performance breakdown by Cub Scout rank
            </p>

            <div className="rank-stats-grid">
              {rankStats.map((rankStat, index) => (
                <div key={rankStat.rank} className="rank-stat-card">
                  <div className="rank-stat-header">
                    <h3>{rankStat.rank}</h3>
                    <span className="scout-count">{rankStat.scoutCount} scout{rankStat.scoutCount !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="rank-stat-body">
                    <div className="stat-row">
                      <span className="stat-label">Total Sales:</span>
                      <span className="stat-value total">
                        {viewMode === 'revenue'
                          ? `$${rankStat.totalRevenue.toFixed(2)}`
                          : `${rankStat.totalUnits} units`}
                      </span>
                    </div>

                    <div className="stat-row">
                      <span className="stat-label">Average per Scout:</span>
                      <span className="stat-value average">
                        {viewMode === 'revenue'
                          ? `$${rankStat.avgRevenue.toFixed(2)}`
                          : `${rankStat.avgUnits.toFixed(1)} units`}
                      </span>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="top-rank-badge">🏆 Top Rank</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="leaderboard-footer">
          <p>Keep up the great work, scouts!</p>
          <p className="footer-note">
            Leaderboard updates in real-time as orders are placed.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
