import React, {useRef, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import ImgModel from '../../assets/image/modal.svg';
import ImgData from '../../assets/image/data.svg';
import ImgCollaborate from '../../assets/image/collaborate.svg';
import './index.less';

export default function Home() {
  const navigate = useNavigate();
  const timer = useRef(null);
  const demoRef = useRef(null);

  const loadImg = (cb) => {
    if (!window.homeCache) {
      window.homeCache = [];
      for (let i = 1; i <= 8; i ++) {
        const img = new Image();
        img.onload = ((i) => {
          if (i === 8) {
            console.log('img 加载完毕');
            cb();
          }
        })(i);
        img.src = new URL(`./image/${i}.jpg`, import.meta.url).href;
        window.homeCache.push(img);
      }
    } else {
      cb();
    }
  };

  const play = () => {
    let index = 0;
    timer.current = setInterval(() => {
      if (index > 0) {
        demoRef.current.removeChild(window.homeCache[index - 1]);
      }
      demoRef.current.appendChild(window.homeCache[index]);
      index ++;
      if (index === window.homeCache.length) {
        clearInterval(timer.current);
      }
    }, 500);
  };

  useEffect(() => {
    loadImg(play);
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return (
    <div className='home'>

      <div className='home-main'>
        <h1 className='title'>
          欢迎使用 <span className='blue'>EasyMock</span>
        </h1>

        <div className='start' onClick={() => navigate('/project')}>开始</div>

        <div ref={demoRef} className='demo'>
          {/* <img src={imgSrc} /> */}
        </div>

        <div className='list'>
          <div>
            <img
              src={ImgModel}
              alt='数据模型'
              width={28}
              height={28}
            />
            <h3>数据模型</h3>
            <div>快速创建资源并添加资源之间的关系</div>
          </div>
          <div>
            <img
              src={ImgData}
              alt='生成数据'
              width={28}
              height={28}
            />
            <h3>生成数据</h3>
            <div>使用faker.js一键生成假数据</div>
          </div>
          <div>
            <img
              src={ImgCollaborate}
              alt='协同能力'
              width={28}
              height={28}
            />
            <h3>协同能力</h3>
            <div>与你的团队分享、复制或合作项目。</div>
          </div>
        </div>
      </div>

      <footer>
        ©EasyMock
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          冀ICP备19016004号
        </a>
      </footer>
    </div>
  );
}
