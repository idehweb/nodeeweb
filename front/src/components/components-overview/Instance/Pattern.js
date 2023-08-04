import { Chip, Radio, RadioGroup } from '@mui/material';
import {
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

const Patterns = [
  {
    link: 'https://demo1.nodeeweb.com',
    title: 'demo1',
    name: 'demo1',
  },
  {
    link: 'https://demo2.nodeeweb.com',
    title: 'demo2',
    name: 'demo2',
  },
  {
    link: 'https://demo3.nodeeweb.com',
    title: 'demo3',
    name: 'demo3',
  },
  {
    link: 'https://demo4.nodeeweb.com',
    title: 'demo4',
    name: 'demo4',
  },
  {
    link: 'https://demo5.nodeeweb.com',
    title: 'demo5',
    name: 'demo5',
  },
  {
    link: 'https://demo6.nodeeweb.com',
    title: 'demo6',
    name: 'demo6',
  },
];

const Pattern = forwardRef(({ link, title, imageSource, name }, ref) => {
  return (
    <>
      {imageSource && (
        <img src={imageSource} style={{ width: '100px', height: '100px' }} />
      )}
      <a href={link} target="_blank">
        <h5>{title}</h5>
      </a>
      <input type="radio" name="instance_pattern" value={name} ref={ref} />
    </>
  );
});

export default function InstancePatterns({ patternsRef }) {
  const refs = useRef([]);

  useImperativeHandle(
    patternsRef,
    () => ({
      getChecked() {
        const pattern = refs.current.find((p) => p.current.checked);
        if (!pattern) return;
        return pattern.current.value;
      },
    }),
    [],
  );

  return (
    <div>
      <h3> دموها: </h3>
      {Patterns.map((p, i) => {
        const pr = createRef();
        refs.current.push(pr);
        return <Pattern {...p} key={i + ''} ref={pr} />;
      })}
    </div>
  );
}
