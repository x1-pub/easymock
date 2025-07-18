import {Link} from 'react-router-dom';
import UserPanel from './component/UserPanel';
import Logo from '../../assets/image/logo.jpg';
import './index.less';

export default function Header() {
  return (
    <header>
      <Link to="/">
        <img src={Logo} alt='EasyMock' />
      </Link>
      <UserPanel />
    </header>
  );
}
