import { BASE_URL } from '@/functions/API';

export default function FileChips({ record }) {
  const { url = '' } = record;

  return (
    <span>
      <a href={`${BASE_URL}/${url}`} target="_blank" rel="noreferrer" download>
        download
      </a>
    </span>
  );
}
