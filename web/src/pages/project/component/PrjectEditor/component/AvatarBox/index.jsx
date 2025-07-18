import React from 'react';
import ImgDelete from '../../../../../../assets/image/delete.svg';
import './index.less';

export default function AvatarBox(props) {
  const {
    name,
    avatar,
    onDeleteUser = () => {},
  } = props;

  return (
    <div
      className='avatar-box'
      onClick={() => onDeleteUser(name)}
    >
      <img src={avatar} alt={name} />
      <h4>{name}</h4>
      <h5>
        <img
          src={ImgDelete}
          alt='删除'
          width={18}
          height={18}
        />
      </h5>
    </div>
  );
}
