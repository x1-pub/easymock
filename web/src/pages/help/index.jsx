import React from 'react';
import ImgCreateProject from './image/create-project.png';
import ImgAddResource from './image/add-resource.png';
import ImgAddChildResource from './image/add-child-resource.png';
import ImgDiyMockdata from './image/diy-mockdata.png';
import ImgGenerateData from './image/generate-data.png';
import './index.less';

export default function Help() {
  return (
    <div className='page-help'>
      <div className="container">
        <div className="hero">
          <h3>EasyMock是什么?</h3>
          <blockquote>
            <p>
              EasyMock的原型为国外的
              <a href="https://mockapi.io/" target="_black">mockAPI</a>
            </p>
          </blockquote>
          <p>
            EasyMock是一个简单的工具，
            它允许您轻松模拟api，
            生成自定义数据，
            并使用RESTful接口对其执行操作。
            EasyMock是作为测试/学习工具使用的。
          </p>
        </div>

        <div className="block">
          <h3>开始</h3>
          <div>
            <p>1. 创建项目</p>
            <img
              src={ImgCreateProject}
              alt="新建项目的表单"
            />
          </div>
          <div>
            <p>2. 添加资源</p>
            <img
              src={ImgAddResource}
              alt="添加资源的表单"
            />
            <div>
              <p style={{padding: '0 3%'}}>
                注意: 资源名映射到url的endpoint中。在上面的例子中，将生成以下api:
              </p>
              <div className='table-wrapper'>
                <table>
                  <thead>
                    <tr>
                      <th>请求方法</th>
                      <th>endpoint</th>
                      <th>状态码</th>
                      <th>默认返回类型</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>GET</td>
                      <td>/blogs</td>
                      <td>200</td>
                      <td>[Blog]</td>
                    </tr>
                    <tr>
                      <td>GET</td>
                      <td>/blogs/:id</td>
                      <td>200</td>
                      <td>Blog</td>
                    </tr>
                    <tr>
                      <td>POST</td>
                      <td>/blogs</td>
                      <td>200</td>
                      <td>Blog</td>
                    </tr>
                    <tr>
                      <td>PUT</td>
                      <td>/blogs/:id</td>
                      <td>200</td>
                      <td>Blog</td>
                    </tr>
                    <tr>
                      <td>DELETE</td>
                      <td>/blogs/:id</td>
                      <td>200</td>
                      <td>Blog</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <p>
              {`3. 要开始使用api，复制项目url，并用刚刚创建的资源名替换/:endpont。
            在我们的例子中，这将是https://<UNIQUE_ID>.easymock.x1.pub/api/blogs`}
            </p>
          </div>
        </div>

        <div className="block">
          <h3>添加子资源(嵌套url)</h3>
          <div>
            <p>要添加子资源，选中父子元后，点击其右侧的加号进行添加子资源。</p>
            <img
              src={ImgAddChildResource}
              alt="添加子资源的表单"
            />
          </div>
        </div>

        <div className="block">
          <h3>自定义响应</h3>
          <div>
            <p>
              {`默认情况下，
              响应是对象数组或依赖于请求类型的对象(由{{mockData}}表示)。
              你可以很容易地自定义它以返回自定义JSON:`}
            </p>
            <img
              src={ImgDiyMockdata}
              alt="自定义响应"
            />
          </div>
          {/* <div>
          <p>
            还可以包含父数据和/或子数据。
            为此，编辑资源模式，并在字段类型下拉菜单中选择 ParentResource 或 ChildResource 选项。
          </p>
          <img
            src={Img}
            alt="建立子资源的表单"
          />
        </div> */}
        </div>

        <div className="block">
          <h3>生成数据</h3>
          <div>
            <p>你就可以通过点击矩形为每个资源自动生成数据(每个资源限制100个对象):</p>
            <img
              src={ImgGenerateData}
              alt="生成数据"
            />
          </div>
        </div>

        <div className="block">
          <h3>其他(developing)</h3>
          <div>
            <p>{`分页 -> 为GET请求添加查询参数，如: /blogs?page=1&limit=10`}</p>
            <div>
              <span>{``}</span>
            </div>
          </div>
          <div>
            <p>{`排序 -> 为GET请求添加查询参数，
              如: /blogs?sortBy=createdAt&order=DESC。
              如果省略order参数，则默认顺序为ASC`}
            </p>
          </div>
          <div>
            <p>{`查询 -> 为GET请求添加查询参数，
              如: /blogs?name=zhangsan&age=18`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
