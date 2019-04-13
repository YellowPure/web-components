// Autonomous custom elements 独立的元素
class PopUpInfo extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({
      mode: 'open'
    });
    const wrapper = this.createEle('span', 'wrapper');
    const icon = this.createEle('span', 'icon');
    icon.setAttribute('tabindex', 0);
    const info = this.createEle('span', 'info');
    const text = this.getAttribute('text');
    // info.textContent = text;
    info.textContent = text;

    let imgUrl;
    if (this.hasAttribute('img')) {
      imgUrl = this.getAttribute('img');
    } else {
      imgUrl = 'img/default.png';
    }

    const img = document.createElement('img');
    img.src = imgUrl;
    icon.appendChild(img);

    const style = document.createElement('style');
    style.textContent = `
    .wrapper {
      position: relative;
    }

    .info {
      font-size: 0.8rem;
      width: 200px;
      display: inline-block;
      border: 1px solid black;
      padding: 10px;
      background: white;
      border-radius: 10px;
      opacity: 0;
      transition: 0.6s all;
      position: absolute;
      bottom: 20px;
      left: 10px;
      z-index: 3;
    }

    img {
      width: 1.2rem;
    }

    .icon:hover + .info, .icon:focus + .info {
      opacity: 1;
    }
  
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(icon);
    wrapper.appendChild(info);
  }

  connectedCallback() {
    console.log('当 custom element首次被插入文档DOM时，被调用。');
  }

  disconnectedCallback() {
    console.log('当 custom element从文档DOM中删除时，被调用。');
  }

  adoptedCallback() {
    console.log('当 custom element被移动到新的文档时，被调用。')
  }

  attributeChangeedCallback() {
    console.log('当 custom element增加、删除、修改自身属性时，被调用。');
  }

  createEle(str, className) {
    const r = document.createElement(str);
    r.setAttribute('class', className);

    return r;
  }
}


customElements.define('popup-info', PopUpInfo);

// Customized built-in elements 继承自基本的HTML元素。
// 在创建时，你必须指定所需扩展的元素（正如上面例子所示），
// 使用时，需要先写出基本的元素标签，并通过 is 属性指定custom element的名称。
// 例如<p is="word-count">, 或者 document.createElement("p", { is: "word-count" })

class ExpandingList extends HTMLUListElement {
  constructor() {
    super();

    window.onload = function () {
      const uls = Array.from(document.querySelectorAll(':root ul'));
      const lis = Array.from(document.querySelectorAll(':root li'));

      uls.slice(1).forEach(ul => {
        ul.style.display = 'none';
      });

      lis.forEach(li => {
        const childText = li.childNodes[0];
        const newSpan = document.createElement('span');

        newSpan.textContent = childText.textContent;
        childText.parentNode.insertBefore(newSpan, childText);
        childText.parentNode.removeChild(childText);
      });

      const spans = Array.from(document.querySelectorAll(':root span'));

      spans.forEach(span => {
        if (span.nextElementSibling) {
          span.style.cursor = 'pointer';
          span.parentNode.setAttribute('class', 'closed');
          span.onclick = showul;
        }
      });

      function showul(e) {
        const nextul = e.target.nextElementSibling;

        if (nextul.style.display == 'block') {
          nextul.style.display = 'none';
          nextul.parentNode.setAttribute('class', 'closed');
        } else {
          nextul.style.display = 'block';
          nextul.parentNode.setAttribute('class', 'open');
        }
      }
    };
  }
}

customElements.define('expanding-list', ExpandingList, {
  extends: 'ul'
});


function updateStyle(elem) {
  var shadow = elem.shadowRoot;
  var childNodes = shadow.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeName === 'STYLE') {
      childNodes[i].textContent = 'div {' +
        ' width: ' + elem.getAttribute('l') + 'px;' +
        ' height: ' + elem.getAttribute('l') + 'px;' +
        ' background-color: ' + elem.getAttribute('c');
    }
  }
}

class CustomSquare extends HTMLElement {
  constructor() {
    super();

    var shadow = this.attachShadow({
      mode: 'open'
    });

    var div = document.createElement('div');
    var style = document.createElement('style');
    shadow.appendChild(style);
    shadow.appendChild(div);
  }

  connectedCallback() {
    console.log('connected callback');
    updateStyle(this);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element attributes changed.', name, oldValue, newValue);
    updateStyle(this);
  }
  // 需要注意的是，如果需要在元素属性变化后，
  // 触发 attributeChangedCallback()回调函数，你必须监听这个属性。
  // 这可以通过定义observedAttributes() get函数来实现，
  // observedAttributes()函数体内包含一个 return语句，
  // 返回一个数组，包含了需要监听的属性名称
  static get observedAttributes() {
    return ['w', 'l', 'c'];
  }

  disconnectedCallback() {
    console.log('Custom square element removed from page.');
  }

  adoptedCallback() {
    console.log('Custom square element moved to new page.');
  }
}

customElements.define('custom-square', CustomSquare);

const square = document.getElementsByTagName('custom-square');
square[0].setAttribute('c', 'yellow');

const pop = document.getElementsByTagName('popup-info');
console.log('shadowRoot', pop[0].shadowRoot.querySelector('.info').textContent);

class MyParagragh extends HTMLElement {
  constructor() {
    super();

    let template = document.getElementById('my-paragraph');
      let templateContent = template.content;

      const shadowRoot = this.attachShadow({mode: 'open'})
        .appendChild(templateContent.cloneNode(true));
  }
}

customElements.define('my-paragragh', MyParagragh);

customElements.define('element-details',
  class extends HTMLElement {
    constructor() {
      super();
      var template = document
        .getElementById('element-details-template')
        .content;
      const shadowRoot = this.attachShadow({mode: 'open'})
        .appendChild(template.cloneNode(true));
  }
})