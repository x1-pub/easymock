import React, {useState, useRef, useEffect, useCallback} from 'react';
import API from '../../../../api';
import ColorBox from './component/ColorBox';
import UserSelector from './component/UserSelector';
import {useAuth} from '../../../../lib/content';
import ImgClose from '../../../../assets/image/close.svg';
import tips from '../../../../lib/tips';
import './index.less';

export default function PrjectEditor(props) {
  const {
    _id,
    name = '',
    apiPrefix = '',
    description = '',
    themeColor = '#f5222d',
    onCreate = () => { },
    onUpdate = () => { },
    onClose = () => { },
  } = props;

  const nameRef = useRef();
  const apiPrefixRef = useRef();
  const descriptionRef = useRef();
  const [collaborators, setCollaborators] = useState([]);
  const [userColor, setUserColor] = useState(themeColor);
  const [isOnwer, setIsOnwer] = useState(false);
  const {user} = useAuth();

  const getProjectDetails = useCallback(async () => {
    const {data} = await API.fetchProjectDetail({_id});
    const {collaborators, onwer} = data;
    setCollaborators(collaborators);
    setIsOnwer(onwer === user?.name);
  }, [_id, user.name]);

  useEffect(() => {
    if (_id) {
      getProjectDetails();
    } else {
      setIsOnwer(true);
    }
  }, [_id, getProjectDetails]);

  useEffect(() => {
    nameRef.current.value = name;
    apiPrefixRef.current.value = apiPrefix;
    descriptionRef.current.value = description;
  }, [name, apiPrefix, description, themeColor]);

  const onConfirm = () => {
    const formData = {
      name: nameRef.current.value,
      apiPrefix: apiPrefixRef.current.value,
      description: descriptionRef.current.value,
      themeColor: userColor,
      collaborators,
    };
    if (!formData.name || formData.name > 13) {
      tips({
        msg: '请输入1-13位项目名',
      });
      return;
    }

    if (formData.apiPrefix) {
      if (
        !/^\/[0-9a-zA-Z_\-/]{1,}$/.test(formData.apiPrefix) ||
        formData.apiPrefix.endsWith('/')
      ) {
        tips({
          msg: '请输入以“/”开头的合法URL',
        });
        return;
      }
    }

    !_id ? onCreate(formData) : onUpdate({_id, ...formData});
  };

  return (
    <div className='project-editor'>
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
      <form className='form'>
        <div>
          <p>项目名(必填)</p>
          <input
            ref={nameRef}
            autoComplete="off"
            placeholder="例如: Todo App, Project X..." />
        </div>
        <div>
          <p>接口前缀</p>
          <input
            ref={apiPrefixRef}
            autoComplete="off"
            placeholder="例如：/api/v1"
          />
        </div>
        <div>
          <p>项目简介</p>
          <input
            ref={descriptionRef}
            autoComplete="off"
            placeholder="例如：这是一个H5项目的api" />
        </div>
        <div>
          <p>标记颜色</p>
          <ColorBox defaultColor={themeColor} onChange={setUserColor} />
        </div>
        {
          isOnwer &&
          <div>
            <p>项目成员</p>
            <UserSelector
              defaultValue={collaborators}
              onChange={setCollaborators}
            />
          </div>
        }
      </form>
      <div className='action'>
        <button onClick={onConfirm}>{!_id ? '创建' : '更新'}</button>
        <button onClick={onClose}>取消</button>
      </div>
    </div>
  );
}
