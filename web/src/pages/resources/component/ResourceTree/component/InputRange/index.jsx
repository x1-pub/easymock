import {useRef, useState, useEffect} from 'react';
import './index.less';

export default function InputRange({value = 0, onClick = () => {}}) {
  const range = useRef(null);
  const line = useRef(null);
  const numR = useRef(null);
  const bg = useRef(null);

  const [x, setX] = useState(0);
  const [num, setNum] = useState(0);

  useEffect(() => {
    setX(range?.current?.getBoundingClientRect()?.left);
  }, []);

  const onMouseMove = (e) => {
    // if (disabled) {
    //   return;
    // }
    const gap = e.clientX - x;

    line.current.style.left = `${gap}px`;
    numR.current.style.left = `${gap - 10}px`;

    let len = Math.round(gap / 17 * 10);

    if (len < 0) {
      len = 0;
    }
    if (len > 100) {
      len = 100;
    }

    setNum(len);
  };

  return (
    <div className="input-range">
      <div
        ref={range}
        className='range'
        onMouseMove={onMouseMove}
        onClick={() => onClick(num)}
      >
        <div
          className='bg'
          ref={bg}
          style={{
            width: `${value / 100 * 170}px`,
          }}
        />
        <div
          className='num'
          ref={numR}
        >{num}</div>
        <div
          className='line'
          ref={line}
          style={{
            left: `${value / 100 * 170}px`,
          }}
        />
        <div className='v-c'>{value}</div>
      </div>
    </div>
  );
}
