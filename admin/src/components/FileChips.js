import { BASE_URL } from '@/functions/API';

export default function FileChips({ record }) {
  const { files = [] } = record;

  return files.length
    ? files.map((i, idx) => (
        <span key={idx} style={{ margin: '0 3px' }}>
          <a
            href={`${BASE_URL}/${i.url}`}
            target="_blank"
            rel="noreferrer"
            download>
            download
          </a>
        </span>
      ))
    : null;
}
