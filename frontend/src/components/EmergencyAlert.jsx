/**
 * EmergencyAlert — fixed-position alert stack for 'animalEmergency' socket events.
 * Shown to volunteers when a critical animal report is created near their location.
 * Auto-dismisses after 30 seconds.
 */

import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CONDITION_LABELS = {
  sick: '🤒 Sick Animal',
  critical: '🚨 Critical Animal',
  injured: '🩹 Injured Animal',
  aggressive: '⚠️ Aggressive Animal',
};

export default function EmergencyAlert() {
  const { emergencyAlerts, dismissAlert } = useSocket();
  const { user } = useAuth();

  // Only show for volunteers
  if (!user || user.role !== 'volunteer') return null;
  if (emergencyAlerts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 16,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 320,
        width: '100%',
      }}
    >
      {emergencyAlerts.map((alert) => (
        <AlertCard key={alert.reportId} alert={alert} onDismiss={() => dismissAlert(alert.reportId)} />
      ))}
    </div>
  );
}

function AlertCard({ alert, onDismiss }) {
  // Auto-dismiss after 30 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, 30_000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const label = CONDITION_LABELS[alert.condition] || '🚨 Emergency Alert';

  return (
    <div
      className="card"
      style={{
        border: '2px solid #ef4444',
        padding: 0,
        overflow: 'hidden',
        animation: 'fadeInUp 0.3s ease',
      }}
    >
      {/* Red header bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, #dc2626, #ef4444)',
          color: '#fff',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 13, fontFamily: "'Fredoka', cursive" }}>
          {label}
        </span>
        <button
          onClick={onDismiss}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 22,
            height: 22,
            cursor: 'pointer',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 14px' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 13, color: '#1e3d30' }}>
          {alert.species}
        </p>
        {alert.zone && (
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b8075' }}>
            📍 {alert.zone}
          </p>
        )}
        {alert.distanceKm != null && (
          <p style={{ margin: '0 0 8px', fontSize: 12, color: '#ef4444', fontWeight: 700 }}>
            {alert.distanceKm} km from you
          </p>
        )}
        {alert.description && (
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#6b8075', lineHeight: 1.4 }}>
            {alert.description.length > 80
              ? alert.description.slice(0, 80) + '…'
              : alert.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            to="/volunteer"
            onClick={onDismiss}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '6px 10px',
              borderRadius: 20,
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            View Report
          </Link>
          {alert.lat && alert.lng && (
            <a
              href={`https://www.google.com/maps?q=${alert.lat},${alert.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '6px 10px',
                borderRadius: 20,
                background: '#fff',
                border: '2px solid var(--primary)',
                color: 'var(--primary-dark)',
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              📍 Open Map
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
