import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingSkeleton: React.FC = () => {
  // Detect if we're in dark mode by checking body class
  const isDarkMode = typeof document !== 'undefined' && document.body.classList.contains('dark');
  
  return (
    <SkeletonTheme 
      baseColor={isDarkMode ? "#404040" : "#f0f0f0"} 
      highlightColor={isDarkMode ? "#525252" : "#e0e0e0"}
    >
      <div style={{
        maxWidth: '550px',
        margin: '0 auto',
        padding: '0 20px',
        fontFamily: "'Exo 2', sans-serif"
      }}>
        {/* Title skeleton */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Skeleton height={80} width={300} style={{ margin: '0 auto' }} />
        </div>
        
        {/* Todo container skeleton */}
        <div style={{
          backgroundColor: isDarkMode ? '#2d2d2d' : 'white',
          borderRadius: '5px',
          boxShadow: isDarkMode 
            ? '0 2px 4px rgba(0, 0, 0, 0.4)' 
            : '0 2px 4px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}>
          {/* Input header skeleton */}
          <div style={{ 
            padding: '16px', 
            borderBottom: `1px solid ${isDarkMode ? '#404040' : '#ededed'}` 
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton circle width={24} height={24} style={{ marginRight: '12px' }} />
              <Skeleton height={24} style={{ flex: 1 }} />
            </div>
          </div>
          
          {/* Todo items skeleton */}
          {[...Array(3)].map((_, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px 16px',
              borderBottom: index < 2 
                ? `1px solid ${isDarkMode ? '#404040' : '#ededed'}` 
                : 'none'
            }}>
              <Skeleton circle width={28} height={28} style={{ marginRight: '16px' }} />
              <Skeleton height={24} style={{ flex: 1 }} />
              <Skeleton width={20} height={20} style={{ marginLeft: '10px' }} />
            </div>
          ))}
          
          {/* Footer skeleton */}
          <div style={{
            padding: '10px 16px',
            borderTop: `1px solid ${isDarkMode ? '#404040' : '#ededed'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Skeleton width={60} height={14} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <Skeleton width={40} height={20} />
              <Skeleton width={40} height={20} />
              <Skeleton width={60} height={20} />
            </div>
            <Skeleton width={80} height={14} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default LoadingSkeleton; 