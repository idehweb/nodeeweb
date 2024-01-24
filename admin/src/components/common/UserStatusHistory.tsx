import { fDateTime } from '@/helpers/date';

export interface StatusProps {
  status: string;
  description: string;
  createdAt?: string;
  user?: string;
}

export default function UserStatusHistory({
  status,
}: {
  status: [StatusProps];
}) {
  const RenderStatusItems = status.map((item: StatusProps, index: number) => (
    <div
      style={{ borderRadius: '0.3rem', padding: '0.5rem' }}
      key={item.description}
      className="item-boxes">
      <span className="child-item-boxes-f">
        <span className="child-item-boxes-f-c">#{index + 1}</span>
        <span className="child-item-boxes-f-d">{item.status}</span>
      </span>

      <span className="child-item-boxes-t">{item.description}</span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          fontSize: '0.75rem',
        }}>
        {item.createdAt && (
          <span style={{ direction: 'ltr' }}>{fDateTime(item.createdAt)}</span>
        )}
      </div>
    </div>
  ));
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
        {RenderStatusItems}
      </div>
    </>
  );
}
