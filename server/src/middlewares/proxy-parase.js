import {Resource, Data, Project} from '../modal/index.js';
import {UserProxyNotFound} from '../lib/error.js';


/**
 * 验证project和apiPrefix
 * @param {Object} param0
 * @returns
 */

const projectAuth = async ({projectId, path}) => {
  return new Promise(async (resolve, reject) => {
    const url = `/${path}`;
    const project = await Project.findById(projectId);
    if (!project) {
      reject(new UserProxyNotFound('Project Not Found'));
      return;
    }
    if (!url.startsWith(project.apiPrefix)) {
      reject(new UserProxyNotFound('ApiPreFix Error'));
      return;
    }
    const [fr, frid, sr, srid, tr, trid] = url
        .replace(project.apiPrefix, '')
        .replace(/^\//, '')
        .split('/');
    resolve({fr, frid, sr, srid, tr, trid});
  });
};


/**
 * 验证资源是否存在、接口状态等
 * @param {String} projectId
 * @param {String} name
 * @param {Sring} method
 * @param {String} url
 * @returns
 */

const endpointAuth = async ({
  projectId,
  name,
  method,
  url,
}) => {
  return new Promise(async (resolve, reject) => {
    const resource = await Resource.findOne({projectId, name});
    if (!resource) {
      reject(new UserProxyNotFound('Resource Not Found'));
      return;
    }
    const endpoint = resource.endpoints.find(
        (ep) => ep.url === url && ep.method === method,
    );
    if (!endpoint) {
      reject(new UserProxyNotFound('Endpoint Not Exist'));
      return;
    }
    if (!endpoint.enable) {
      reject(new UserProxyNotFound('Endpoint Unabled'));
      return;
    }
    const pidSchema = resource.schemas.find(
        (ep) => ep.type === 'Parent ID',
    );
    const idSchema = resource.schemas.find(
        (ep) => ep.type === 'Object ID',
    );
    resolve({
      dataId: resource.dataId,
      response: endpoint.response,
      delay: endpoint.delay,
      idName: idSchema.name,
      pidName: pidSchema?.name,
      schemas: resource.schemas,
      generator: resource.generator,
    });
  });
};

export default () => async (ctx, next) => {
  const path = ctx.request.params['0'];
  const projectId = ctx.request.header['project-id'];
  const method = ctx.method.toUpperCase();

  const {fr, frid, sr, srid, tr, trid} = await projectAuth({projectId, path});

  let url = '';
  if (fr) url += `/${fr}`;
  if (frid) url += `/:id`;
  if (sr) url += `/${sr}`;
  if (srid) url += `/:id`;
  if (tr) url += `/${tr}`;
  if (trid) url += `/:id`;

  const name = tr || sr || fr;

  const endpoint = await endpointAuth({projectId, name, method, url});

  if (method === 'POST' && srid && !trid) {
    // post请求 二级资源 验证
    const {name} = endpoint.schemas.find((ep) => ep.type === 'Object ID');
    const {data} = await Data.findById(endpoint.dataId);
    const target = data.find((d) => d[name] == frid);
    if (!target) {
      throw new UserProxyNotFound();
    }
  }
  if (trid || (method === 'POST' && tr)) {
    // 所有的三级资源
    const {name: oid} = endpoint.schemas.find((ep) => ep.type === 'Object ID');
    const {name: pid} = endpoint.schemas.find((ep) => ep.type === 'Parent ID');
    const {data} = await Data.findById(endpoint.dataId);
    const target = data.find(
        (d) => d[oid] == srid && d[pid] == frid,
    );
    if (!target) {
      throw new UserProxyNotFound();
    }
  }

  ctx.request.emParaseObj = {
    ...endpoint,
    url,
    projectId,
    fr, frid, sr, srid, tr, trid,
  };

  await next();
};

