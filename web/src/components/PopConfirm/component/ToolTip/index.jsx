import {useEffect, useCallback} from 'react';
import {createPortal} from 'react-dom';
import './index.less';

const ToolTipContent = ({
  top = '0',
  left = '0',
  width = 0,
  title = 'Are you sure to delete this task?',
  onConfirm = () => {},
  onCancel = () => {},
  okText = 'Yes',
  cancelText = 'No',
  close = () => {},
}) => {
  const node = document.createElement('div');

  useEffect(() => {
    node.style.position = 'absolute';
    node.style.top = '0';
    node.style.left = '0';
    document.body.appendChild(node);
    return () => {
      document.body.removeChild(node);
    };
  }, [node]);

  const handleClickOther = useCallback(() => {
    close();
  }, [close]);

  useEffect(() => {
    document.addEventListener('click', handleClickOther);
    return () => {
      document.removeEventListener('click', handleClickOther);
    };
  }, [handleClickOther]);

  return createPortal(
      <div
        className='component-popconfirm'
        style={{
          top,
          left,
          transform: `translate(
            calc(-50% + ${width / 2}px),
            calc(-100% - 10px)
          )`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='titles'>{title}</div>
        <div className='btn-group'>
          <button
            className='cancel'
            onClick={onCancel}
          >{cancelText}</button>
          <button
            className='ok'
            onClick={onConfirm}
          >{okText}</button>
        </div>
      </div>,
      node,
  );
};

export default function ToolTip(props) {
  return props.visible && <ToolTipContent {...props} />;
}
