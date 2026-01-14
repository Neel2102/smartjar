import React, { useState, useEffect } from 'react';
import { financeAPI } from '../services/api';

const ContributionHeatmapLayout = ({ userId }) => {
  const [layoutData, setLayoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchLayoutData();
    }
  }, [userId]);

  const fetchLayoutData = async () => {
    try {
      setLoading(true);
      const response = await financeAPI.getHeatmapLayout(userId);
      setLayoutData(response.data);
    } catch (err) {
      setError('Failed to load heatmap layout');
      console.error('Error fetching heatmap layout:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#666'
      }}>
        Loading contribution heatmap...
      </div>
    );
  }

  if (error || !layoutData) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#666'
      }}>
        {error || 'No heatmap data available'}
      </div>
    );
  }

  // Zone colors
  const zoneColors = {
    none: '#ebedf0',      // Light gray
    weak: '#c6e48b',      // Light green
    stable: '#7bc96f',    // Medium green
    strong: '#239a3b'     // Dark green
  };

  // Calculate grid dimensions
  const maxCol = Math.max(...layoutData.grid.map(cell => cell.col));
  const maxRow = 6; // Mon-Sun

  // Create grid matrix
  const gridMatrix = Array(maxRow + 1).fill(null).map(() => 
    Array(maxCol + 1).fill(null)
  );

  // Fill grid matrix
  layoutData.grid.forEach(cell => {
    gridMatrix[cell.row][cell.col] = cell;
  });

  return (
    <div style={{
      padding: '1rem',
      background: '#fff',
      borderRadius: '8px',
      border: '1px solid #e1e4e8'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#24292e',
          margin: 0
        }}>
          Contribution Activity
        </h3>
        
        <div style={{
          display: 'flex',
          gap: '2rem',
          fontSize: '0.875rem',
          color: '#586069'
        }}>
          <div>
            <strong>{layoutData.stats.active_days}</strong> active days
          </div>
          <div>
            <strong>{layoutData.stats.current_streak}</strong> current streak
          </div>
          <div>
            <strong>{layoutData.stats.max_streak}</strong> max streak
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'flex-start',
        overflowX: 'auto',
        fontSize: '0.625rem'
      }}>
        {/* Weekday labels and Month labels */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          minWidth: '2.5rem',
          fontSize: '0.625rem',
          color: '#586069',
          lineHeight: '1rem'
        }}>
          <div></div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            height: '7rem'
          }}>
            <div style={{ textAlign: 'right', paddingRight: '0.25rem' }}>Mon</div>
            <div style={{ textAlign: 'right', paddingRight: '0.25rem' }}>Wed</div>
            <div style={{ textAlign: 'right', paddingRight: '0.25rem' }}>Fri</div>
          </div>
          <div style={{
            display: 'flex',
            position: 'relative',
            height: '1rem',
            width: '100%'
          }}>
            {layoutData.month_labels.map((label, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${label.col * 1}rem`,
                  fontSize: '0.625rem',
                  color: '#586069',
                  whiteSpace: 'nowrap',
                  fontWeight: '400'
                }}
              >
                {label.month}
              </div>
            ))}
          </div>
        </div>

        {/* Week grid */}
        <div style={{
          display: 'flex',
          gap: '0.1875rem' // 3px gap like GitHub
        }}>
          {Array.from({ length: maxCol + 1 }).map((_, colIndex) => (
            <div key={colIndex} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.1875rem' // 3px gap like GitHub
            }}>
              {Array.from({ length: 7 }).map((_, rowIndex) => {
                const cell = gridMatrix[rowIndex][colIndex];
                
                if (!cell) {
                  return (
                    <div
                      key={rowIndex}
                      style={{
                        width: '0.6875rem', // 11px like GitHub
                        height: '0.6875rem', // 11px like GitHub
                        borderRadius: '2px',
                        backgroundColor: '#ebedf0'
                      }}
                    />
                  );
                }

                return (
                  <div
                    key={rowIndex}
                    style={{
                      width: '0.6875rem', // 11px like GitHub
                      height: '0.6875rem', // 11px like GitHub
                      borderRadius: '2px',
                      backgroundColor: zoneColors[cell.zone],
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    title={`${cell.date}: ${cell.zone}`}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.2)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '0.25rem',
        marginTop: '0.5rem',
        fontSize: '0.625rem',
        color: '#586069'
      }}>
        <span style={{ marginRight: '0.25rem' }}>Less</span>
        {Object.entries(zoneColors).map(([zone, color]) => (
          <div
            key={zone}
            style={{
              width: '0.6875rem', // 11px like GitHub
              height: '0.6875rem', // 11px like GitHub
              borderRadius: '2px',
              backgroundColor: color
            }}
          />
        ))}
        <span style={{ marginLeft: '0.25rem' }}>More</span>
      </div>
    </div>
  );
};

export default ContributionHeatmapLayout;
