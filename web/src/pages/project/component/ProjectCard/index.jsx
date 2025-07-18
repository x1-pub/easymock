import {useNavigate} from 'react-router-dom';
import ImgDelete from '../../../../assets/image/delete.svg';
import ImgEdit from '../../../../assets/image/edit.svg';
import PopConfirm from '../../../../components/PopConfirm';
import './index.less';

export default function ProjectCard(props) {
  const {
    _id = 0,
    themeMark = '',
    themeColor = '',
    name = '',
    description = '',
    createdAt= '',
    isOnwer = fasle,
    onDelete = () => {},
    onEdit = () => {},
  } = props;

  const navigate = useNavigate();

  const onClickEditIcon = (e) => {
    onEdit();
    e.stopPropagation();
  };


  return (
    <div
      className='project-card'
      onClick={() => navigate(`/project/${_id}`)}>
      <div
        className='logo'
        style={{backgroundColor: themeColor}}
      >{themeMark}</div>
      <h3 className='name'>{name}</h3>
      <div className='description'>{description || '还未添加任何描述哦~'}</div>
      <div className='handler'>
        <span>{createdAt}</span>
        <div>
          <img
            src={ImgEdit}
            alt='编辑'
            width={17}
            height={17}
            onClick={onClickEditIcon} />
          {
            isOnwer &&
            <PopConfirm
              title='你确定删除此项目吗？'
              okText='确定'
              cancelText='取消'
              onConfirm={() => onDelete(_id)}
            >
              <img
                src={ImgDelete}
                alt='删除'
                width={17}
                height={17}
              />
            </PopConfirm>
          }

        </div>
      </div>
    </div>
  );
}
