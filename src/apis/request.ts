import {
  HeaderOption,
  RootDocumentApi,
  CreateDocumentResponse,
  DocumentContentApi,
} from './types/apis.js';
import { X_USERNAME } from '../constants.js';

const API_END_POINT = 'https://kdt-frontend.programmers.co.kr' as const;

const headers = {
  'Content-Type': 'application/json',
  'x-username': X_USERNAME,
};

export const request = async <T>(
  url: string,
  option?: HeaderOption
): Promise<T> => {
  try {
    const response = await fetch(`${API_END_POINT}${url}`, option);
    if (response.ok) {
      return await response.json();
    }
    throw Error('error!');
  } catch (e: any) {
    console.log(e.message);

    // TODO: 더 좋은 방법이 없는지 생각해보기
    history.replaceState(null, '', '/404');
    window.dispatchEvent(new CustomEvent('ROUTE_CHANGE'));
    return Promise.reject('error');
  }
};

export function fetchDocumentTree() {
  return request<RootDocumentApi[]>('/documents', {
    method: 'GET',
    headers,
  });
}

export function fetchAdd(id: number | null) {
  return request<CreateDocumentResponse>('/documents', {
    method: 'POST',
    headers,
    body: JSON.stringify({ title: '', parent: id }),
  });
}

export function fetchContent(id: number) {
  return request<DocumentContentApi>(`/documents/${id}`, {
    method: 'GET',
    headers,
  });
}

export function fetchDelete(id: number) {
  return request(`/documents/${id}`, {
    method: 'DELETE',
    headers,
  });
}

export function fetchUpdate(id: number, body: string) {
  return request(`/documents/${id}`, {
    method: 'PUT',
    headers: headers,
    body: body,
  });
}
