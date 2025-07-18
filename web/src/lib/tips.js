import ImgError from '../assets/image/error.svg';
import ImgTip from '../assets/image/tip.svg';

const ErrorImgDom = document.createElement('img');
ErrorImgDom.src = ImgError;
ErrorImgDom.style.width = '18px';
ErrorImgDom.style.height = '18px';
ErrorImgDom.style.verticalAlign = 'middle';
ErrorImgDom.style.paddingRight = '12px';

const TipImgDom = document.createElement('img');
TipImgDom.src = ImgTip;
TipImgDom.style.width = '18px';
TipImgDom.style.height = '18px';
TipImgDom.style.verticalAlign = 'middle';
TipImgDom.style.paddingRight = '12px';

export default (props = {}) => {
  const span = document.createElement('span');
  span.innerText = props.msg || 'Nothing';
  span.style.verticalAlign = 'middle';

  const content = document.createElement('div');

  const container = document.createElement('div');

  content.appendChild(props.type === 'error' ? ErrorImgDom : TipImgDom);
  content.appendChild(span);
  container.appendChild(content);

  const styleObj = {
    'position': 'fixed',
    'top': '30px',
    'right': '30px',
    'background-color': '#333',
    'z-index': '9999',
    'border-radius': '3px',
    'color': '#FFF',
    'text-align': 'center',
    'box-sizing': 'border-box',
    'padding': '11px 20px',
    'max-width': '200px',
    'font-size': '12px',
  };

  let style = '';
  for (const key in styleObj) {
    if (Object.prototype.hasOwnProperty.call(styleObj, key)) {
      style += `${key}: ${styleObj[key]};`;
    }
  }
  container.setAttribute('style', style);

  document.body.appendChild(container);

  setTimeout(() => {
    document.body.removeChild(container);
  }, props.duration || 2000);
};
