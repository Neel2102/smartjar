import React, { useState, useEffect } from 'react';
import { financeAPI } from '../services/api';

const GitHubHeatmap = ({ userId }) => {
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchHeatmapData();
    }
  }, [userId]);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const response = await financeAPI.getHeatmapLayout(userId);
      setHeatmapData(response.data);
    } catch (err) {
      setError('Failed to load heatmap');
      console.error('Error fetching heatmap:', err);
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

  if (error || !heatmapData) {
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

  // GitHub color palette (light theme)
  const colors = {
    0: '#ebedf0', // level-0
    1: '#9be9a8', // level-1
    2: '#40c463', // level-2
    3: '#30a14e', // level-3
    4: '#216e39'  // level-4
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '8px',
      border: '1px solid #e1e4e8',
      padding: '1rem',
      margin: '0'
    }}>
      {/* Header */}
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
            <strong>{heatmapData.stats.active_days}</strong> active days
          </div>
          <div>
            <strong>{heatmapData.stats.current_streak}</strong> current streak
          </div>
          <div>
            <strong>{heatmapData.stats.max_streak}</strong> max streak
          </div>
        </div>
      </div>

      {/* Heatmap Container */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'flex-start',
        fontSize: '0.625rem'
      }}>
        {/* Weekday Labels */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          minWidth: '2.5rem',
          fontSize: '0.625rem',
          color: '#586069',
          lineHeight: '12px' // Match box height
        }}>
          <div style={{ height: '12px' }}></div> {/* Spacer for month labels */}
          <div style={{ 
            height: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '0.25rem'
          }}>Mon</div>
          <div style={{ 
            height: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '0.25rem'
          }}></div>
          <div style={{ 
            height: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '0.25rem'
          }}>Wed</div>
          <div style={{ 
            height: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '0.25rem'
          }}></div>
          <div style={{ 
            height: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '0.25rem'
          }}>Fri</div>
          <div style={{ 
            height: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '0.25rem'
          }}></div>
        </div>

        {/* Month Labels */}
        <div style={{
          position: 'relative',
          height: '12px',
          marginBottom: '3px',
          minWidth: '52 * 15px' // 52 weeks * (12px + 3px gap)
        }}>
          {heatmapData.month_labels.map((label, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${label.weekIndex * 15}px`, // 12px box + 3px gap
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

        {/* Heatmap Grid - CRITICAL: Render ALL 365 boxes */}
        <div style={{
          display: 'grid',
          gridTemplateRows: 'repeat(7, 12px)', // 7 rows, 12px each
          gridAutoFlow: 'column', // CRITICAL: column-first flow
          gridAutoColumns: '12px', // 12px columns
          gap: '3px', // Exact GitHub gap
          marginTop: '3px'
        }}>
          {/* Render ALL 365 boxes based on backend data */}
          {Array.from({ length: 52 * 7 }).map((_, index) => {
            const weekIndex = Math.floor(index / 7);
            const dayIndex = index % 7;
            
            // Find cell data for this position from backend
            const cellData = heatmapData.grid.find(cell => 
              cell.weekIndex === weekIndex && cell.dayIndex === dayIndex
            );
            
            // ALWAYS render a box - never skip days
            const level = cellData ? cellData.level : 0;
            const date = cellData ? cellData.date : '';
            
            return (
              <div
                key={index}
                style={{
                  width: '12px', // Exact GitHub size
                  height: '12px', // Exact GitHub size
                  borderRadius: '2px', // Exact GitHub radius
                  backgroundColor: colors[level], // Always has a color
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                title={date ? `${date}: Level ${level}` : 'No data'}
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
        {Object.entries(colors).map(([level, color]) => (
          <div
            key={level}
            style={{
              width: '12px', // Exact GitHub size
              height: '12px', // Exact GitHub size
              borderRadius: '2px', // Exact GitHub radius
              backgroundColor: color
            }}
          />
        ))}
        <span style={{ marginLeft: '0.25rem' }}>More</span>
      </div>
    </div>
  );
};

export default GitHubHeatmap;
