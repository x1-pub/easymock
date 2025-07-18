import React from 'react';
import './index.less';

export default function ResourceTitle({
  projectId,
  apiPrefix,
  onClickCreate = () => {},
}) {
  return (
    <div className='component-resource-title'>
      <div className='component-resource-title-endpoint'>
        <div className='label'>API endpoint</div>
        <div className='url'>
          https://
          <span className='project-id'>{projectId}</span>
          .easymock.x1.pub
          <span className='api-prefix'>{apiPrefix}</span>
          /
          <span className='endpoint'>:endpoint</span>
        </div>
      </div>
      <div className='component-resource-title-handle'>
        <button onClick={() => onClickCreate()}>新建资源</button>
      </div>
    </div>
  );
}
