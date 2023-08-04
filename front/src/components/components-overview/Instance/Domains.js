import { useCallback, useImperativeHandle, useState } from 'react';
import { toast } from 'react-toastify';

function Domain({ onAdd, onRemove, hasAdd, editable, hasRemove, d }) {
  const [domain, setDomain] = useState(d);
  return (
    <div>
      <input
        disabled={!editable}
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      {hasAdd && (
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!/(?!www\.)(?!http)^.+\..{2,}$/.test(domain)) {
              toast('invalid domain', { type: 'error' });
              return;
            }
            setDomain('');
            onAdd(domain);
          }}>
          Add
        </button>
      )}
      {hasRemove && (
        <button
          onClick={(e) => {
            e.preventDefault()
            setDomain('');
            onRemove(domain);
          }}>
          Remove
        </button>
      )}
    </div>
  );
}

export default function InstanceDomains({ defaultDomains = [], domainsRef }) {
  const [domains, setDomains] = useState(defaultDomains);
  useImperativeHandle(
    domainsRef,
    () => ({
      getAdd() {
        return domains.filter((d) => !defaultDomains.includes(d) && d);
      },
      getRemove() {
        return defaultDomains.filter((d) => !domains.includes(d) && d);
      },
    }),
    [domains],
  );

  const onAdd = useCallback((domain) => {
    setDomains((domains) => [...new Set([...domains, domain])]);
  }, []);

  const onRemove = useCallback((domain) => {
    setDomains((domains) => domains.filter((d) => d !== domain));
  }, []);

  return (
    <div>
      <h3>افزودن دامنه: </h3>
      {domains.map((d, i) => (
        <Domain
          key={i + d}
          onAdd={onAdd}
          onRemove={onRemove}
          hasRemove
          editable={false}
          d={d}
        />
      ))}
      <Domain hasAdd onAdd={onAdd} onRemove={onRemove} editable={true} />
    </div>
  );
}
