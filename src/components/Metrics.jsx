import React from 'react';

const Metrics = ({ totalTime = 0, sessions = 0, sessionDurations = [] }) => {
  const averageSession = sessions > 0 ? Math.round(totalTime / sessions) : 0;

  return (
    <div
      className="metrics"
      style={{
        marginTop: '12px',
        padding: '12px',
        border: `1px solid var(--border)`,
        borderRadius: '8px',
        background: 'var(--card-bg)',
        color: 'var(--text)',
        transition: 'background 0.3s, color 0.3s'
      }}
    >
      <h4 style={{ margin: '0 0 8px 0' }}>Metrics</h4>
      <p>
        Total time spent: <strong>{Math.floor(totalTime / 60)} min {totalTime % 60} sec</strong>
      </p>
      <p>
        Sessions completed: <strong>{sessions}</strong>
      </p>
      <p>
        Average session length: <strong>{Math.floor(averageSession / 60)} min {averageSession % 60} sec</strong>
      </p>

      {sessionDurations.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
          {sessionDurations.map((d, idx) => {
            const barHeight = Math.min(d / 60, 60); // max 60px for visualization
            return (
              <div
                key={idx}
                style={{
                  height: '60px',
                  width: '24px',
                  background: 'var(--border)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  cursor: 'default'
                }}
                title={`${Math.floor(d / 60)} min ${d % 60} sec`}
              >
                <div
                  style={{
                    height: `${barHeight}px`,
                    width: '100%',
                    background: 'var(--button-bg)',
                    borderRadius: '2px',
                    transition: 'height 0.3s, background 0.3s'
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Metrics;
