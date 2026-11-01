import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: '#181A20',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#E8B44F',
          fontWeight: 800,
          borderRadius: '8px',
          border: '1.5px solid #E8B44F',
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
