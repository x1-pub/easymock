
import React, {useState, useEffect} from 'react';
import {cloneDeep} from 'lodash';
import {useParams} from 'react-router-dom';
import ImgClose from '../../../../assets/image/close.svg';
import ImgRight from '../../../../assets/image/right.svg';
import ImgAdd from '../../../../assets/image/addRes.svg';
import {
  schemaType,
  FakerType,
  schemaTemplet,
  mockDataTemplet,
  getEndpoints,
  validator,
} from './utils';
import tips from '../../../../lib/tips';
import './index.less';

export default function ResourceEditor({
  dataSource,
  parentResource,
  onClose = () => {},
  onCreate = () => {},
  onUpdate = () => {},
}) {
  const {projectId} = useParams();

  const [name, setName] = useState('');
  const [generator, setGenerator] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [endpoints, setEndpoints] = useState([]);

  const handleChangeEP = (index) => {
    const item = cloneDeep(endpoints);
    item[index].enable = +!endpoints[index].enable;
    setEndpoints(item);
  };
  const handleChangeRes = (index, value) => {
    const item = cloneDeep(endpoints);
    item[index].response = value;
    setEndpoints(item);
  };
  const handleSchemaChange = (index, name, value) => {
    const item = cloneDeep(schemas);
    item[index][name] = value;
    if (name === 'type' && value === 'Faker.js') {
      item[index].fakerMethod = 'address.buildingNumber';
    }
    if (name === 'type' && value !== 'Faker.js') {
      item[index].fakerMethod = '';
    }
    setSchemas(item);
  };
  const handleChangeName = (value) => {
    setName(value);
    const ep = getEndpoints(
        value || '...',
        parentResource?.endpoints[1].url,
        endpoints,
    );
    setEndpoints(ep);
  };

  const onConfirm = async () => {
    const form = {
      projectId,
      parentId: parentResource?._id,
      name,
      endpoints,
      generator,
      schemas,
    };
    validator(form)
        .then(() => {
          dataSource?._id ?
            onUpdate({_id: dataSource._id, ...form}) : onCreate(form);
        })
        .catch((err) => {
          tips({
            msg: `${err.toString().replace('Error: ', '')}`,
            duration: 5000,
            type: 'error',
          });
        });
  };

  const handleDeleteSchema = (index) => {
    const item = cloneDeep(schemas);
    item.splice(index, 1);
    setSchemas(item);
  };

  const handleAddSchema = () => {
    setSchemas((sh) => [
      ...sh,
      {name: '', type: 'String'},
    ]);
  };

  useEffect(() => {
    if (dataSource?._id) {
      // 编辑
      setName(dataSource.name);
      setGenerator(dataSource.generator);
      setSchemas(dataSource.schemas);
      setEndpoints(dataSource.endpoints);
    } else if (parentResource?.name) {
      // 新建子资源
      setSchemas([
        {name: 'id', type: 'Object ID'},
        {name: `${parentResource.name}Id`, type: 'Parent ID'},
        {name: 'name', type: 'Faker.js', fakerMethod: 'name.fullName'},
        {name: 'createdAt', type: 'Faker.js', fakerMethod: 'date.recent'},
      ]);
      const ep = getEndpoints('...', parentResource?.endpoints[1].url);
      setEndpoints(ep);
    } else {
      // 新建一级资源
      setSchemas([
        {name: 'id', type: 'Object ID'},
        {name: 'name', type: 'Faker.js', fakerMethod: 'name.fullName'},
        {name: 'createdAt', type: 'Faker.js', fakerMethod: 'date.recent'},
      ]);
      const ep = getEndpoints('...');
      setEndpoints(ep);
    }
  }, [dataSource, parentResource]);


  return (
    <div className="component-resource-editor">
      <div className='header'>
        <div className='close' onClick={onClose}>
          <img
            src={ImgClose}
            alt='close'
            width={16}
            height={16}
          />
        </div>
      </div>

      <form className='form'>
        {
          !dataSource?._id && <div>
            <p>资源名称</p>
            <h5>输入有意义的资源名，它将用于生成API的endpoint。</h5>
            <input
              value={name}
              placeholder="例如: users, articles, comments..."
              onChange={(e) => handleChangeName(e.target.value)}
            ></input>
          </div>
        }

        <div>
          <p>Schema</p>
          <h5>定义资源Schema，它将用于生成模拟数据。</h5>
          {
            schemas.map((item, index) => (
              <div className='form-schema-select' key={index}>
                {/* 字段名输入 */}
                <input
                  type="text"
                  value={item.name}
                  style={{width: '30%'}}
                  placeholder='字段名'
                  onChange={
                    (e) => handleSchemaChange(index, 'name', e.target.value)
                  }
                />
                {/* 类型选择 */}
                <select
                  value={item.type}
                  disabled={['Object ID', 'Parent ID'].includes(item.type)}
                  onChange={
                    (e) => handleSchemaChange(index, 'type', e.target.value)
                  }
                  style={{width: '28%'}}
                >
                  {
                    schemaType.map((type) => (
                      <option
                        disabled={
                          ['Object ID', 'Parent ID'].includes(type)
                        }
                        key={type}
                        value={type}
                      >{type}</option>
                    ))
                  }
                </select>
                {/* faker method 选择 */}
                <select
                  style={{
                    display: item.type === 'Faker.js' ? 'inline-block': 'none',
                    width: '28%',
                  }}
                  onChange={(e) => handleSchemaChange(
                      index, 'fakerMethod', e.target.value,
                  )}
                  value={item.fakerMethod}
                >
                  {
                    FakerType.map((type) => (
                      <optgroup key={type.title} label={type.title}>
                        {
                          type.children.map((fun) => (
                            <option
                              key={`${type.title}.${fun}`}
                              value={`${type.title}.${fun}`}
                            >{fun}</option>
                          ))
                        }
                      </optgroup>

                    ))
                  }
                </select>
                {/* 删除按钮 */}
                <img
                  style={{
                    display: ['Object ID', 'Parent ID'].includes(item.type) ?
                      'none': 'inline-block',
                  }}
                  className='delete'
                  src={ImgClose}
                  alt='删除'
                  onClick={() => handleDeleteSchema(index)}
                />
              </div>
            ))
          }
          <img
            className='add'
            src={ImgAdd}
            alt='添加'
            onClick={() => handleAddSchema()}
          />
        </div>
        <div>
          <p>Object template</p>
          <h5>
            {`要为数据定义更复杂的结构，请使用JSON模板。你可以使用如{{name.findName}}来引用Faker.js方法。`}
          </h5>
          <code>
            <pre>{schemaTemplet}</pre>
          </code>
          <textarea
            className='textarea'
            value={generator}
            placeholder='JSON'
            rows="6"
            onChange={(e) => setGenerator(e.target.value)}
          ></textarea>
        </div>
        <div>
          <p>Endpoints</p>
          <h5>启用/禁用端点并自定义响应JSON。</h5>
          <h5>
            {`默认情况下，EasyMock将根据请求返回项列表或单个项。
            要定义更复杂的响应，请提供JSON模板。
            你可以使用如{{name.findName}}来引用Faker.js方法`}
          </h5>
          <h5 style={{paddingLeft: '18px'}}>
            {'- {{mockData}}为引用数据库中存储的实际数据'}
          </h5>
          <h5 style={{paddingLeft: '18px'}}>
            {'- {{count}}为引用数据库中存储的记录数量(仅在GET方法请求列表时有效)'}
          </h5>
          <code>
            <pre>{`{{mockData}}`}</pre>
          </code>
          <code>
            <pre>{mockDataTemplet}</pre>
          </code>
          {
            endpoints.map((item, index) => (
              <div key={item._id || index} >
                <div className='endpoint'>
                  <div
                    className='cantrol'
                    style={{
                      backgroundColor: item.enable ? '#3cb371' : '#ddd',
                      color: item.enable ? '#fff' : '#000',
                    }}
                    onClick={() => handleChangeEP(index)}
                  >{item.enable ? 'ON' : 'OFF'}</div>
                  <div className='method'>{item.method}</div>
                  <img alt='enable' className='arrows' src={ImgRight} width="14px" height="14px" />
                  <div className='url'>{item.url}</div>
                </div>
                <textarea
                  className='textarea'
                  rows="3"
                  value={item.response}
                  onChange={(e) => handleChangeRes(index, e.target.value)}
                ></textarea>
              </div>
            ))
          }
        </div>
      </form>
      <div className='action'>
        <button onClick={onConfirm}>{dataSource?._id ? '更新' : '创建'}</button>
        <button onClick={onClose}>取消</button>
      </div>
    </div>
  );
}
