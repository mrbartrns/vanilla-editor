# vanilla-editor

## 소개

> vanilla-editor는 오직 Vanilla JS만을 사용하여 노션의 사이드바와 에디터를 구현하는 프로젝트입니다.

- editor가 가질 수 있는 가장 기본적인 기능에 집중하여, 사용자는 오직 내용을 작성에만 집중할 수 있습니다.
- 작성과 동시에 실시간으로 저장됩니다. 더 이상 열심히 작성한 작업물들을 저장 버튼을 누르지 않아 날라갈 걱정은 접어두세요!

## 기술 스택

- vanilla JS
- TypeScript

> 현재 버전은 vanilla JS에서 Typescript로 재작성되었습니다.


## 특징

1. 콘텐츠 업데이트와 동시에 실시간으로 서버에 저장합니다.
2. 디바운스를 활용하여 서버와 통신하는 횟수를 줄입니다.
3. history, fetch api를 활용하여 SPA 형식으로 구성하였습니다.


### 구조적 특징

1. 클래스를 사용하여 컴포넌트를 사용하였습니다.  

모든 컴포넌트는 `Component` 부모 클래스로 부터 상속받아 작성되었습니다. 모든 컴포넌트가 동일한 `Component`의 특성을 갖기 때문입니다.  
또한, 클래스형을 사용하여 좀 더 체계적으로 컴포넌트를 작성하기 위해 노력했습니다.
```tsx
// Component.ts

class Component<T = {}> {
  $element: HTMLElement;
  state?: T;

  constructor({
    $target,
    elementType,
  }: {
    $target: HTMLElement | null;
    elementType: string;
  }) {
    // ...
  }

  setState(nextState: T) {
    // ...
  }

  render() {
    // ...
  }

  template(): string {
    // ...
  }

  setEvent() {}
}

export { Component };

```
2. 상위 컴포넌트에서 하위 컴포넌트로 단방향으로 데이터가 흐르도록 설계하였습니다.  

상위 컴포넌트에서 하위 컴포넌트로 데이터가 흐르도록 하여 상태를 좀 더 쉽게 추적하고자 하였습니다.

![structure](https://velog.velcdn.com/images/mrbartrns/post/a65aa03a-8795-4b31-8d21-b2cc6953722f/image.svg) 

3. 이 과정에서 prop-drilling 현상과, 대부분 컴포넌트가 접근하는 데이터에 대한 관리를 어떻게 관리해야 할 지 고민하였고, 옵저버 패턴의 전역 상태 관리 모델을 도입하여 해결을 시도하였습니다.  




### 추후 계획

- webpack, babel, eslint, prettier 패키지로 좀 더 체계적인 프로젝트 관리
- webpack 환경에서 코드 스플리팅