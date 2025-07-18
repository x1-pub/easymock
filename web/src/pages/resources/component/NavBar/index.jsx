import {useNavigate} from 'react-router-dom';
import './index.less';

export default function NavBar({name}) {
  const navigate = useNavigate();

  return (
    <div className='navbar-wrap'>
      <span
        className='project-list'
        onClick={() => navigate('/project')}
      >项目列表</span>
      <span className='line'>/</span>
      <span>{name}</span>
    </div>
  );
};
