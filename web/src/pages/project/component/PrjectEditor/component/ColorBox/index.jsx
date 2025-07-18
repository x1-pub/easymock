import {useState} from 'react';
import cl from 'classnames';
import './index.less';

export default function ColorBox({defaultColor, onChange = () => {}}) {
  const colorList = [
    '#f5222d',
    '#fa8c16',
    '#fadb14',
    '#52c41a',
    '#13c2c2',
    '#1890ff',
    '#722ed1',
    '#eb2f96',
  ];
  const defaultIndex = colorList.indexOf(defaultColor);

  const [activeId, setActiveId] = useState(
    defaultIndex === -1 ? 0 : defaultIndex,
  );

  const setColor = (index, color) => {
    setActiveId(index);
    onChange(color);
  };


  return (
    <div className='color-box'>
      {
        colorList.map((color, index) => (
          <div
            key={index}
            className={cl({
              'item': true,
              'active': activeId === index,
            })}
            style={{backgroundColor: color}}
            onClick={() => setColor(index, color)}
          ></div>
        ))
      }
    </div>
  );
}
