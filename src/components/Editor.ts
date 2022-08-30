import Component from './Component.js';
import debounce from '../utils/debounce.js';
import { getState, subscribe } from '../core/store.js';
import { EDITOR_AUTOSAVE_EVENT, EDIT_DOCUMENT_EVENT } from '../constants.js';
import { IBaseProps } from './types/index.js';
import { DocumentContentApi } from '../apis/types/apis.js';

class Editor extends Component {
  mounted: boolean;

  constructor({ $target }: IBaseProps) {
    super({ $target, elementType: 'div' });
    this.$element.className = 'editor';
    this.mounted = false;
    this.render();
    this.setEvent();

    subscribe(() => {
      this.render();
    });
  }

  render() {
    if (!this.mounted) {
      this.$element.innerHTML = this.template();
    }
    const { title, content } = getState().currentDocument as DocumentContentApi;
    const $title = this.$element.querySelector(
      '[name=title]',
    ) as HTMLInputElement;
    const $content = this.$element.querySelector('[name=content]');
    if ($title) $title.value = title;
    if ($content) $content.textContent = content;
    this.mounted = true;
  }

  template() {
    const { title, content } = getState().currentDocument as DocumentContentApi;
    return `
    <div class="editor-container">
      <input type="text" name="title" value="${title}" placeholder="제목 없음"/>
      <textarea name="content" placeholder="내용을 입력하세요.">${content}</textarea>
    </div>
    `;
  }

  setEvent() {
    this.$element.addEventListener(
      'keyup',
      debounce((e: any) => {
        const { target } = e;
        const state = getState().currentDocument;
        const name = target.getAttribute('name');
        if (!Object.prototype.hasOwnProperty.call(state, name)) return;

        dispatchEvent(
          new CustomEvent(EDITOR_AUTOSAVE_EVENT, {
            detail: {
              editorState: state,
            },
          }),
        );
      }, 500),
    );

    this.$element.addEventListener('keyup', (e: any) => {
      const { target } = e;
      const state = getState().currentDocument;
      const name = target.getAttribute('name');
      if (!Object.prototype.hasOwnProperty.call(state, name)) return;

      const nextState = {
        ...state,
        [name]: target.value,
      };

      dispatchEvent(
        new CustomEvent(EDIT_DOCUMENT_EVENT, {
          detail: {
            editorState: nextState,
          },
        }),
      );
    });
  }
}
export default Editor;
