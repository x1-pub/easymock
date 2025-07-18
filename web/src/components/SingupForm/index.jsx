import {useState, useRef, useEffect} from 'react';
import tips from '../../lib/tips';
import API from '../../api';
import ImgEye from '../../assets/image/eye.svg';
import ImgEyeClose from '../../assets/image/eyeClose.svg';
import './index.less';

export default function SignupForm({onClose, onSubmit}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [codeBtnMsg, setCodeBtnMsg] = useState('获取验证码');
  const timer = useRef(null);

  const submit = () => {
    if (name.length < 1 || name.length > 8) {
      tips({
        msg: '请输入1-8位姓名',
      });
      return;
    }
    if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email)) {
      tips({
        msg: '请输入正确的邮箱',
      });
      return;
    }
    if (code.length !== 4) {
      tips({
        msg: '请输入4位验证码',
      });
      return;
    }
    if (password.length < 6 || password.length > 16) {
      tips({
        msg: '请输入密码6-16位密码',
      });
      return;
    }
    onSubmit({name, email, password, code});
  };


  const handleCodeSend = async () => {
    if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email)) {
      tips({
        msg: '请输入正确的邮箱',
      });
      return;
    }
    if (codeBtnMsg !== '获取验证码') return;

    const res = await API.getVCode({email});
    if (res?.code !== 1) {
      tips({
        msg: res?.errorMsg,
        type: 'error',
      });
    }

    setCodeBtnMsg('60s后重新获取');
    let num = 60;
    timer.current = setInterval(() => {
      if (num === 1) {
        clearInterval(timer.current);
        setCodeBtnMsg('获取验证码');
      } else {
        --num;
        setCodeBtnMsg(`${num}s后重新获取`);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      timer?.current && clearInterval(timer.current);
      setCodeBtnMsg('获取验证码');
    };
  }, [timer]);

  return (
    <div className='singup'>
      <div className='header'>
        <span>注册</span>
        <span onClick={onClose}>关闭</span>
      </div>
      <form className='form'>
        <input
          name="name"
          autoComplete="off"
          type="text"
          placeholder="请输入姓名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          name="email"
          autoComplete="off"
          type="text"
          placeholder="请输入邮箱（用作登录名）"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className='base-form'>
          <input
            name="code"
            autoComplete="off"
            type="text"
            placeholder="请输入4位验证码"
            value={code}
            maxLength={4}
            onChange={(e) => setCode(e.target.value)}
          />
          <span
            className='base-form-code-btn'
            style={{color: codeBtnMsg !== '获取验证码' ? '#999aaa' : '#000'}}
            onClick={handleCodeSend}
          >{codeBtnMsg}</span>
        </div>
        <div className='base-form'>
          <input
            name="password"
            autoComplete="off"
            type={open ? 'test': 'password'}
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {
            open ?
              <img
                className='base-form-pwd-btn'
                src={ImgEye}
                onClick={() => setOpen(!open)}
              /> :
              <img
                className='base-form-pwd-btn'
                src={ImgEyeClose}
                onClick={() => setOpen(!open)}
              />
          }
        </div>
      </form>
      <button className='submit' onClick={submit}>注册</button>
      <div className='agreement'>
        注册即表示同意
        <a>用户协议</a>、
        <a>隐私政策</a>
      </div>
    </div>
  );
}
