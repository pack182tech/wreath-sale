import { useState, useEffect } from 'react'
import { getScouts, getOrders } from '../utils/dataService'
import './Leaderboard.css'

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [rankStats, setRankStats] = useState([])
  const [viewMode, setViewMode] = useState('revenue') // revenue or units
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboardData()
  }, [viewMode])

  const loadLeaderboardData = async () => {
    setLoading(true)
    try {
      // Load orders and scouts from production backend
      const orders = await getOrders()
      const scouts = await getScouts()

    // Calculate sales per scout
    const salesByScout = {}

    orders.forEach(order => {
      if (order.scoutId && !order.isDonation) {
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
    } catch (error) {
      console.error('[Leaderboard] Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

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
      {/* Animated Background Elements */}
      <div className="camping-background">
        {/* Starry Night Sky */}
        <div className="stars-layer">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`
            }} />
          ))}
        </div>

        {/* Moon */}
        <div className="moon"></div>

        {/* Pine Trees */}
        {[...Array(43)].map((_, i) => (
          <div
            key={i}
            className="pine-tree"
            style={{
              left: `${(i * 2.4)}%`,
              transform: `scale(${0.4 + Math.random() * 0.5})`,
              animationDelay: `${i * 0.3}s`,
              bottom: `${10 + Math.random() * 10}%`
            }}
          />
        ))}

        {/* Camping Tents - 6 large family tents and 3 small ones */}
        <div className="tent tent-large tent-1">
          <div className="tent-light"></div>
        </div>
        <div className="tent tent-large tent-2">
          <div className="tent-light"></div>
        </div>
        <div className="tent tent-large tent-3">
          <div className="tent-light"></div>
        </div>
        <div className="tent tent-large tent-4">
          <div className="tent-light"></div>
        </div>
        <div className="tent tent-large tent-5">
          <div className="tent-light"></div>
        </div>
        <div className="tent tent-large tent-6">
          <div className="tent-light"></div>
        </div>
        <div className="tent tent-small tent-7">
          <div className="tent-light"></div>
        </div>
        <div className="tent tent-small tent-8">
          <div className="tent-light"></div>
        </div>
        <div className="tent tent-small tent-9">
          <div className="tent-light"></div>
        </div>

        {/* Campfires - 3 fires */}
        <div className="campfire campfire-1">
          <div className="fire-flame flame-1"></div>
          <div className="fire-flame flame-2"></div>
          <div className="fire-flame flame-3"></div>
          <div className="fire-glow"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="ember" style={{
              animationDelay: `${i * 0.5}s`
            }} />
          ))}
        </div>

        <div className="campfire campfire-2">
          <div className="fire-flame flame-1"></div>
          <div className="fire-flame flame-2"></div>
          <div className="fire-flame flame-3"></div>
          <div className="fire-glow"></div>
          {[...Array(10)].map((_, i) => (
            <div key={`fire2-${i}`} className="ember" style={{
              animationDelay: `${i * 0.5}s`
            }} />
          ))}
        </div>

        <div className="campfire campfire-3">
          <div className="fire-flame flame-1"></div>
          <div className="fire-flame flame-2"></div>
          <div className="fire-flame flame-3"></div>
          <div className="fire-glow"></div>
          {[...Array(10)].map((_, i) => (
            <div key={`fire3-${i}`} className="ember" style={{
              animationDelay: `${i * 0.5}s`
            }} />
          ))}
        </div>

        {/* Scouts Around Fires - 15 scouts total (5 per fire) */}
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`scout-figure scout-${i + 1}`}>
            <div className={i % 2 === 0 ? 'marshmallow-stick' : 'hotdog-stick'}></div>
          </div>
        ))}

        {/* Smoke Wisps */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="smoke-wisp" style={{
            animationDelay: `${i * 0.8}s`
          }} />
        ))}

        {/* Fireflies */}
        {[...Array(15)].map((_, i) => (
          <div key={i} className="firefly" style={{
            left: `${Math.random() * 100}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 3}s`
          }} />
        ))}
      </div>

      <div className="leaderboard-content">
        <h1 className="leaderboard-title">
          <span className="title-shine">Scout Leaderboard</span>
        </h1>
        <p className="leaderboard-subtitle">
          Outstanding effort from our Cub Scouts!
        </p>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Counting everyone's sales...</p>
          </div>
        )}

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
                </div>

                <div className="scout-stats">
                  <div className="stat">
                    <span className="stat-value">
                      {viewMode === 'revenue' ? `$${scout.revenue.toFixed(2)}` : scout.units}
                    </span>
                    <span className="stat-label">
                      {viewMode === 'revenue' ? scout.rank : 'Units'}
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
