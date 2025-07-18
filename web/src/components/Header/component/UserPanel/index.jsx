import React from 'react';
import {useAuth} from '../../../../lib/content';
import ImgUser from '../../../../assets/image/user.svg';
import ImgLogout from '../../../../assets/image/logout.svg';
import ImgHelp from '../../../../assets/image/help.svg';
import './index.less';

export default function UserCenter() {
  const {user, logout} = useAuth();

  const UserAvatar = () => {
    return (
      <div className='avatar-container'>
        <div
          className='avatar-image'
          style={{'backgroundImage': `url(https://cdn.x1.pub/sso/${user?.name}.png)`}}
        />
        <ul>
          <li>{user.name}({user.nameCn})</li>
          <li>
            <img
              src={ImgUser}
              width={16}
              height={16}
              alt="修改信息"
            />
            <span>修改信息</span>
          </li>
          <li onClick={logout}>
            <img
              src={ImgLogout}
              width={16}
              height={16}
              alt="退出"
            />
            <span>退出</span>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className='user-panel'>
      <div className='content'>
        <a href="/help" target="__blank">
          <img src={ImgHelp} alt="帮助" />
        </a>
        {user?.id && <UserAvatar />}
      </div>
    </div>
  );
}
