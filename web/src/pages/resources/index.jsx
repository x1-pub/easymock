import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useRequest} from 'ahooks';
import API from '../../api';
import ResourceTree from './component/ResourceTree';
import ResourceTitle from './component/ResourceTitle';
import ResourceEditor from './component/ResourceEditor';
import DataEditor from './component/DataEditor';
import Dialog from '../../components/Dialog';
import NavBar from './component/NavBar';
import './index.less';

export default function Resources() {
  const {projectId} = useParams();

  const {data: resource, run: getResources} = useRequest(async () => {
    const {data} = await API.fetchResource({projectId});
    return data;
  }, {manual: true});


  const [resourceDialog, setResourceDialog] = useState(false);
  const [dataeDialog, setDataDialog] = useState(false);
  const [parentResource, setParentResource] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  const createResource = async (data) => {
    await API.createhResource(data);
    getResources();
    setResourceDialog(false);
  };

  const updateData = async (data) => {
    await API.updateResourceData(data);
    getResources();
    setDataDialog(false);
  };

  const onClickData = (item) => {
    setDataSource(item);
    setDataDialog(true);
  };

  const updateResource = async (data) => {
    await API.updateResource(data);
    getResources();
    setResourceDialog(false);
  };

  const onClickDelete = async (_id) => {
    await API.deleteResource({projectId, _id});
    getResources();
    setResourceDialog(false);
  };

  const openEditorDialog = (item) => {
    setDataSource(item);
    setResourceDialog(true);
  };

  const openCreateDialog = (parentResource) => {
    setDataSource(null);
    setParentResource(parentResource);
    setResourceDialog(true);
  };

  useEffect(() => {
    getResources();
  }, [getResources]);

  return (
    <div className='page-resources'>
      <NavBar name={resource?.name} />
      <ResourceTitle
        projectId={resource?.projectId}
        apiPrefix={resource?.apiPrefix}
        onClickCreate={openCreateDialog}
      />
      <ResourceTree
        resources={resource?.resources}
        apiPrefix={resource?.apiPrefix}
        projectId={resource?.projectId}
        refresh={getResources}
        onClickCreate={openCreateDialog}
        onClickEditor={openEditorDialog}
        onClickDelete={onClickDelete}
        onClickData={onClickData}
      />
      <Dialog open={resourceDialog} width='500px' top="4vh" radius="5px">
        <ResourceEditor
          dataSource={dataSource}
          parentResource={parentResource}
          onClose={() => setResourceDialog(false)}
          onCreate={createResource}
          onUpdate={updateResource}
        />
      </Dialog>
      <Dialog open={dataeDialog} width='500px' top="8vh" radius="5px">
        <DataEditor
          _id={dataSource?._id}
          projectId={projectId}
          onClose={() => setDataDialog(false)}
          onUpdate={updateData}
        />
      </Dialog>
    </div>
  );
}
