export interface HeaderOption {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: { [key in string]: any };
  body?: string;
  Authorization?: string;
}

export interface RootDocumentApi extends CreateDocumentResponse {
  documents: RootDocumentApi[];
}

export interface Document extends CreateDocumentResponse {
  parent: number | null;
  documents: Document[];
}

export interface SelectedDocument extends BaseDocumentInfo {
  content: string;
}

export interface BaseDocumentInfo {
  id: number;
  title: string;
}

export interface CreateDocumentResponse extends BaseDocumentInfo {
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentContentApi extends CreateDocumentResponse {
  content: string;
  documents: RootDocumentApi[];
}
