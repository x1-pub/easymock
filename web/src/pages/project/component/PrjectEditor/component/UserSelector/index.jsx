import React, {useState, useEffect} from 'react';
import {useDebounce, useRequest} from 'ahooks';
import cl from 'classnames';
import AvatarBox from '../AvatarBox';
import API from '../../../../../../api';
import './index.less';

export default function UserSelector(props) {
  const {
    defaultValue = [],
    onChange = () => {},
  } = props;

  const [collaborators, setCollaborators] = useState(defaultValue);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, {wait: 500});

  const {data: users, run: searchUsers} = useRequest(async (kw) => {
    if (!kw) {
      return [];
    }
    const {data} = await API.searchUser({kw});
    return data;
  }, {manual: true});

  useEffect(() => {
    searchUsers(debouncedSearchValue);
  }, [debouncedSearchValue, searchUsers]);

  const onDeleteUser = (value) => {
    const user = collaborators.filter((name) => name !== value);
    setCollaborators(user);
    onChange(user);
  };

  const onAddUser = (name) => {
    if (collaborators.includes(name)) {
      return;
    }
    onChange([...collaborators, name]);
    setCollaborators([...collaborators, name]);
  };

  const onInputBlur = (e) => {
    e.target.value = '';
    setSearchValue('');
  };


  return (
    <div className='component-user-selector'>
      <div className='avatarBox'>
        {
          collaborators.map((name) =>
            <AvatarBox
              key={name}
              name={name}
              avatar={`https://cdn.x1.pub/sso/${name}.png`}
              onDeleteUser={onDeleteUser}
            />,
          )
        }
      </div>
      <div className='search'>
        <input
          className='search-input'
          autoComplete="off"
          placeholder="通过名字搜索"
          onBlur={onInputBlur}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {searchValue && (
          <div className='search-panel'>
            {
              users?.map(
                  (user) =>
                    <p
                      className={cl({'disabled': collaborators.includes(user.name)})}
                      key={user.name}
                      onMouseDown={() => onAddUser(user.name)}
                    >
                      {`${user.name}(${user.nameCn})`}
                    </p>,
              )
            }
            {
              !users?.length && <span>用户不存在</span>
            }
          </div>
        )}
      </div>
    </div>
  );
}
