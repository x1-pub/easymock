import request from '../lib/request';

export default {
  // user相关
  login: (data) => {
    return request({
      url: '/user/login',
      method: 'post',
      data,
    });
  },
  register: (data) => {
    return request({
      url: '/user/register',
      method: 'post',
      data,
    });
  },
  logout: () => {
    return request({
      url: '/user/logout',
      method: 'post',
    });
  },
  fetchUserinfo: () => {
    return request({
      url: '/user/userinfo',
      method: 'get',
    });
  },
  getVCode: (data) => {
    return request({
      url: '/user/verification_code',
      method: 'post',
      data,
    });
  },
  searchUser: (data) => {
    return request({
      url: `/user/search?kw=${data.kw}`,
      method: 'get',
    });
  },
  // project相关
  fetchProjects: () => {
    return request({
      url: '/project',
      method: 'get',
    });
  },
  fetchProjectDetail: (data) => {
    return request({
      url: `/project/${data._id}`,
      method: 'get',
    });
  },
  createProject: (data) => {
    return request({
      url: '/project',
      method: 'post',
      data,
    });
  },
  deleteProject: (data) => {
    return request({
      url: `/project/${data._id}`,
      method: 'delete',
    });
  },
  updateProject: (data) => {
    return request({
      url: `/project/${data._id}`,
      method: 'put',
      data,
    });
  },
  // 资源相关
  fetchResource: (data) => {
    return request({
      url: `/project/${data.projectId}/resource`,
      method: 'get',
    });
  },
  createhResource: (data) => {
    return request({
      url: `/project/${data.projectId}/resource`,
      method: 'post',
      data,
    });
  },
  generateResourceData: (data) => {
    return request({
      url: `/project/${data.projectId}/resource/${data._id}/generate_data`,
      method: 'post',
      data: {
        count: data.count,
      },
    });
  },
  deleteResource: (data) => {
    return request({
      url: `/project/${data.projectId}/resource/${data._id}`,
      method: 'delete',
    });
  },
  updateResource: (data) => {
    return request({
      url: `/project/${data.projectId}/resource/${data._id}`,
      method: 'put',
      data,
    });
  },
  fetchResourceData: (data) => {
    return request({
      url: `/project/${data.projectId}/resource/${data._id}/data`,
      method: 'get',
    });
  },
  updateResourceData: (data) => {
    return request({
      url: `/project/${data.projectId}/resource/${data._id}/data`,
      method: 'put',
      data: {data: data.data},
    });
  },
};
