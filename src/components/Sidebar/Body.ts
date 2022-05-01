import { Component } from '../Component.js';
import {
  DOCUMENT_LIST_CLASSNAME,
  ADD_CLASSNAME,
  TOGGLE_CLASSNAME,
  DELETE_CLASSNAME,
  ROOT_ADD_CLASSNAME,
} from '../../constants.js';
import { getState, subscribe } from '../../core/store.js';
import { IBaseProps } from '../types/index.js';
import { Document } from '../../apis/types/apis';

class Body extends Component {
  constructor({ $target }: IBaseProps) {
    super({ $target, elementType: 'div' });
    this.$element.className = 'sidebar-body';

    subscribe(() => {
      this.render();
    });
  }

  template() {
    const documentTree = getState().documentTree;
    return `
    <div class="sidebar-documents">
      ${
        documentTree.length
          ? documentTree
              .map((document) => {
                return this.renderTree(document, 0);
              })
              .join('')
          : `<div class="document-list">아직 문서가 없습니다.:)</div>`
      }
      <div class="document-list ${DOCUMENT_LIST_CLASSNAME} ${ROOT_ADD_CLASSNAME}">
        <div class="document-list-title-wrapper">
          <div class="document-list-title">
            루트에 추가하기+
          </div>
        </div>
      </div>
    </div>
    `;
  }

  renderTree(document: Document, depth: number): string {
    return `
      <div data-id="${document.id}">
        <div data-id="${
          document.id
        }" data-depth="${depth}" class="document-list ${DOCUMENT_LIST_CLASSNAME}"
          style="padding: 2px 14px 2px ${14 * (depth + 1)}px;"
        >
          <div role="button" class="sidebar-btn ${TOGGLE_CLASSNAME} ${
      document.toggled ? 'toggled' : ''
    }"></div>
          <div class="document-list-title-wrapper ${
            Number(location.pathname.split('/')[2]) === document.id
              ? 'current-document'
              : ''
          }">
            <div class="document-list-title">
              ${document.title ? document.title : '제목없음'}
            </div>
        </div>
        <div class="sidebar-btn-wrapper">
          <div role="button" class="sidebar-btn ${ADD_CLASSNAME}"></div>
          <div role="button" class="sidebar-btn ${DELETE_CLASSNAME}"></div>
        </div>
        </div>
      ${
        document.documents.length && document.toggled
          ? document.documents
              .map((child) => {
                return this.renderTree(child, depth + 1);
              })
              .join('')
          : document.toggled
          ? `<div class="document-list" style="padding: 2px 14px 2px ${
              14 * (depth + 2)
            }px;">
              <div class="document-list-title-wrapper">
                <div class="document-list-title">
                  하위 문서가 없습니다.
                </div>
              </div>
            </div>`
          : ''
      }
      </div>
    `;
  }
}
export { Body };
