import React, {useState, useEffect} from 'react';
import cl from 'classnames';
import ImgAdd from '../../../../assets/image/addResource.jpg';
import API from '../../../../api';
import tips from '../../../../lib/tips';
import PopConfirm from '../../../../components/PopConfirm';
import InputRange from './component/InputRange';
import './index.less';

export default function ResourceTree({
  resources = [],
  apiPrefix = '',
  projectId = '',
  onClickCreate = () => {},
  onClickEditor = () => {},
  onClickDelete = () => {},
  onClickData = () => {},
  refresh = () => {},
}) {
  const [activedId, setActivedId] = useState(null);

  const generateData = async (count, item) => {
    const {code, errorMsg} = await API.generateResourceData({
      _id: item._id,
      projectId,
      count,
    });
    if (code !== 1) {
      tips({
        msg: errorMsg,
        type: 'error',
      });
    } else {
      refresh();
    }
  };

  useEffect(() => {
    setActivedId((activedId) => activedId || resources[0]?._id);
  }, [resources]);

  const renderItem = (item, right, hasBorther) => (
    <div
      id={`item-${item._id}`}
      className={cl({
        'item': true,
        'actived': activedId === item._id,
      })}
      onClick={() => setActivedId(item._id)}
    >
      <div className={cl({
        'title': true,
        'actived': activedId === item._id,
      })}>
        <a
          href={`https://${item?.projectId}.easymock.x1.pub${apiPrefix}${item?.endpoints[0]?.url?.replace(/:id/g, '1')}`}
          target="_blank" rel="noreferrer"
        >{item.name}</a>
      </div>
      <InputRange
        value={item.dataCount}
        onClick={(count) => generateData(count, item)}
        disabled={activedId !== item._id}
      />
      <div className={cl({
        'handler': true,
        'actived': activedId === item._id,
      })}>
        <span onClick={() => onClickData(item)}>数据</span>
        <span onClick={() => onClickEditor(item)}>编辑</span>
        <PopConfirm
          title='确定删除当前资源及其子资源吗？'
          okText='确定'
          cancelText='取消'
          onConfirm={() => onClickDelete(item._id)}
        >
          <span>删除</span>
        </PopConfirm>
      </div>
      {
        right && <span className='x-right-line'></span>
      }
      {
        right &&
        <span
          className='y-right-line'
          style={{
            height: `${(item.children?.length) * 80}px`,
          }}
        ></span>
      }
      {
        <span className='x-left-line'></span>
      }
      {
        item.parentId && hasBorther &&
        <span
          className='y-left-line'
          style={{
            height: `${(item.children?.length + 1) * 80}px`,
          }}
        ></span>
      }
      {
        !item.parentId &&
        <span className='x-left-line__long'></span>
      }
      <img
        src={ImgAdd}
        alt="添加子资源"
        className={cl({'show': activedId === item._id})}
        onClick={() => onClickCreate(item)}
      />
    </div>
  );

  const renderList = (list) => list.map((item, index) => (
    <div key={item._id} className='group'>
      {
        renderItem(item, item.children?.length > 0, list[index + 1])
      }
      {
        item.children?.length > 0 && renderList(item.children)
      }
    </div>
  ));
  return (
    <div className='menutree'>
      {
        renderList(resources)
      }
    </div>
  );
}
