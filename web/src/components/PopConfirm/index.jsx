import {useState, useEffect, useRef, cloneElement} from 'react';
import ToolTip from './component/ToolTip';
import './index.less';

export default function PopConfirm({
  title = 'Are you sure to delete this task?',
  onConfirm = () => {},
  onCancel = () => {},
  okText = 'Yes',
  cancelText = 'No',
  children,
}) {
  const targetRef = useRef();
  const [visible, setVisible] = useState(false);
  const [left, setLeft] = useState('0');
  const [top, setTop] = useState('0');
  const [width, setWidth] = useState(0);

  const handleConfirm = () => {
    setVisible(false);
    onConfirm();
  };

  const handleCancel = () => {
    setVisible(false);
    onCancel();
  };

  const handleChildrenClick = (e) => {
    e.stopPropagation();
    setVisible(true);
  };

  const target = cloneElement(
      children,
      {onClick: handleChildrenClick, ref: targetRef},
  );

  useEffect(() => {
    if (targetRef.current) {
      const top = targetRef.current.getBoundingClientRect()?.top;
      const left = targetRef.current.getBoundingClientRect()?.left;
      const width = targetRef.current.getBoundingClientRect()?.width;
      setTop(top);
      setLeft(left);
      setWidth(width);
    }
  }, [targetRef, target]);

  return (
    <>
      <ToolTip
        visible={visible}
        left={left}
        top={top}
        width={width}
        title={title}
        okText={okText}
        cancelText={cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        close={() => setVisible(false)}
      />
      {target}
    </>
  );
}
