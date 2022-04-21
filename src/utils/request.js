import { headers } from '../common/headers.js';
const API_END_POINT = 'https://kdt-frontend.programmers.co.kr';

export const request = async (url, option) => {
  try {
    const response = await fetch(`${API_END_POINT}${url}`, option);
    if (response.ok) {
      return await response.json();
    }
    throw Error('error!');
  } catch (e) {
    console.error(e.message);
    // FIXME: 더 좋은 방법이 없는지 생각해보기
    history.replaceState(null, '', '/404');
    window.dispatchEvent(new CustomEvent('ROUTE_CHANGE'));
    return Promise.reject('error');
  }
};

export function fetchDocumentTree() {
  return request('/documents', {
    method: 'GET',
    headers,
  });
}

export function fetchAdd(id) {
  return request('/documents', {
    method: 'POST',
    headers,
    body: JSON.stringify({ title: '', parent: id }),
  });
}

export function fetchContent(id) {
  return request(`/documents/${id}`, {
    method: 'GET',
    headers,
  });
}

export function fetchDelete(id) {
  return request(`/documents/${id}`, {
    method: 'DELETE',
    headers,
  });
}

export function fetchUpdate(id, body) {
  return request(`/documents/${id}`, {
    method: 'PUT',
    headers: headers,
    body: body,
  });
}
