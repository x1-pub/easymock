import {useState} from 'react';
import tips from '../../lib/tips';
import './index.less';

export default function LoginForm({onClose, onSubmit}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email)) {
      tips({
        msg: '请输入正确的邮箱',
      });
      return;
    }
    if (!password) {
      tips({
        msg: '请输入密码',
      });
      return;
    }
    onSubmit({email, password});
  };

  return (
    <div className='login'>
      <div className='header'>
        <span>登录</span>
        <span onClick={onClose}>关闭</span>
      </div>
      <form className='form'>
        <input
          // ref={email}
          name="email"
          autoComplete="off"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="请输入邮箱"
        />
        <input
          // ref={password}
          name="password"
          autoComplete="off"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码" />
      </form>
      <button
        className='submit'
        onClick={submit}
        // disabled={!enable}
      >登录</button>
      <div className='agreement'>
        登录即表示同意
        <a>用户协议</a>、
        <a>隐私政策</a>
      </div>
    </div>
  );
}
