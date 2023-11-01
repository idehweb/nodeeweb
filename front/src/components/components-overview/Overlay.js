export default function Overlay({ children }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
      }}>
      {children}
    </div>
  );
}
