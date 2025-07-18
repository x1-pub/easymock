import React, {useState, useEffect} from 'react';
import {useRequest} from 'ahooks';
import {useAuth} from '../../lib/content';
import API from '../../api';
import ProjectCard from './component/ProjectCard';
import PrjectEditor from './component/PrjectEditor';
import Dialog from '../../components/Dialog';
import ImgAdd from '../../assets/image/add.svg';
import './index.less';


export default function Project() {
  const [dialog, setDialog] = useState(false);
  const [dialogData, setDialogData] = useState({});

  const {user} = useAuth();

  const {data: projects, run: getProjects} = useRequest(async () => {
    const {data} = await API.fetchProjects();
    return data;
  }, {manual: true});

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const openProjectEditor = (project = {}) => {
    setDialogData(project);
    setDialog(true);
  };

  const onDelete = async (_id) => {
    await API.deleteProject({_id});
    getProjects();
  };

  const onUpdate = async (data) => {
    await API.updateProject(data);
    setDialog(false);
    getProjects();
  };

  const onCreate = async (data) => {
    await API.createProject(data);
    setDialog(false);
    getProjects();
  };

  return (
    <div className='page-project'>
      <div onClick={() => openProjectEditor()}>
        <div className='add'>
          <img
            src={ImgAdd}
            alt='新建'
            width={50}
            height={50}
          />
        </div>
      </div>
      {
        projects &&
        projects.map((item) => <div key={item._id} className='item'>
          <ProjectCard
            {...item}
            isOnwer={item.onwer === user?.name}
            onEdit={() => openProjectEditor(item)}
            onDelete={onDelete}
          />
        </div>)
      }
      <Dialog open={dialog} width='400px' top="10vh" radius="7px">
        <PrjectEditor
          {...dialogData}
          onClose={() => setDialog(false)}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      </Dialog>
    </div>
  );
}
