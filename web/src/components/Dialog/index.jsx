import React, {useEffect} from 'react';
import {createPortal} from 'react-dom';
import './index.less';

function Modal({width = '80%', top = '20vh', radius = '0', children}) {
  const node = document.createElement('div');
  useEffect(() => {
    document.body.appendChild(node);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.removeChild(node);
      document.body.style.overflow = 'auto';
    };
  }, [node]);

  return createPortal(
      <div className='dialog'>
        <div
          className='content'
          style={{
            width,
            marginTop: top,
            borderRadius: radius,
            maxHeight: `calc(100vh - ${top} - 70px)`,
          }}>
          <div>
            {children}
          </div>
        </div>
      </div>,
      node,
  );
}

export default function Dialog(props) {
  return props.open && <Modal {...props} />;
}
