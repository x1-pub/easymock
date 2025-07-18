import {useCallback, useEffect, useState} from 'react';
import ImgClose from '../../../../assets/image/close.svg';
import API from '../../../../api';
import tips from '../../../../lib/tips';
import {validateJsonArray} from './utils';
import './index.less';

export default function DataEditor({
  _id,
  projectId,
  onUpdate = () => {},
  onClose = () => {},
}) {
  const [resourceData, setResourceData] = useState('');

  const getData = useCallback(async () => {
    const {data} = await API.fetchResourceData({_id, projectId});
    setResourceData(JSON.stringify(data, null, 2));
  }, [_id, projectId]);

  useEffect(() => {
    _id && getData();
  }, [_id, getData]);

  const onClickUpdate = () => {
    // 验证resourceData
    const pass = validateJsonArray(resourceData);
    if (pass) {
      onUpdate({
        _id,
        projectId,
        data: JSON.parse(resourceData),
      });
    } else {
      tips({
        msg: '数据类型错误',
        type: 'error',
      });
    }
  };

  // const handleDataChange = (e) => {
  //   e.target.style.height = `${e.target.scrollHeight + 10}px`;
  //   setResourceData(e.target.value);
  // };

  return (
    <div className='component-dataeditor'>
      <div className='header'>
        <div className='close' onClick={onClose}>
          <img
            src={ImgClose}
            alt='close'
            width={16}
            height={16}
          />
        </div>
      </div>

      <p>在此修改此资源的数据，必须是数组和有效的JSON。</p>
      <p style={{color: '#ff4d4f'}}>请尽量不要修改Object ID和Parent ID类型的数据</p>

      <textarea
        value={resourceData}
        onChange={(e) => setResourceData(e.target.value)}
      ></textarea>

      <div className='action'>
        <button onClick={onClickUpdate}>更新</button>
        <button onClick={onClose}>取消</button>
      </div>
    </div>
  );
}
