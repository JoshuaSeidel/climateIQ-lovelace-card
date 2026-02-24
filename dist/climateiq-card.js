function t(t,e,i,s){var r,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,i,n):r(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,g=u.trustedTypes,_=g?g.emptyScript:"",v=u.reactiveElementPolyfillSupport,f=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!a(t,e),$={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:m).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const o=this.constructor;if(!1===s&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??b)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[f("elementProperties")]=new Map,y[f("finalized")]=new Map,v?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q=globalThis,x=t=>t,A=q.trustedTypes,w=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,k=`<${C}>`,z=document,T=()=>z.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,O="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,H=/>/g,I=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,N=/"/g,L=/^(?:script|style|textarea|title)$/i,D=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),Q=Symbol.for("lit-nothing"),W=new WeakMap,V=z.createTreeWalker(z,129);function Z(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==w?w.createHTML(e):e}const F=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=R;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(n.lastIndex=d,c=n.exec(i),null!==c);)d=n.lastIndex,n===R?"!--"===c[1]?n=M:void 0!==c[1]?n=H:void 0!==c[2]?(L.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=I):void 0!==c[3]&&(n=I):n===I?">"===c[0]?(n=r??R,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?I:'"'===c[3]?N:j):n===N||n===j?n=I:n===M||n===H?n=R:(n=I,r=void 0);const h=n===I&&t[e+1].startsWith("/>")?" ":"";o+=n===R?i+k:l>=0?(s.push(a),i.slice(0,l)+S+i.slice(l)+E+h):i+E+(-2===l?e:h)}return[Z(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[c,l]=F(t,e);if(this.el=J.createElement(c,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=V.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=l[o++],i=s.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?it:Y}),s.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],T()),V.nextNode(),a.push({type:2,index:++r});s.append(t[e],T())}}}else if(8===s.nodeType)if(s.data===C)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)a.push({type:7,index:r}),t+=E.length-1}r++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===B)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=P(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=K(t,r._$AS(t,e.values),r,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);V.currentNode=s;let r=V.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new st(r,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(r=V.nextNode(),o++)}return V.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=Q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),P(t)?t===Q||null==t||""===t?(this._$AH!==Q&&this._$AR(),this._$AH=Q):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Q&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new G(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new J(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new X(this.O(T()),this.O(T()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=Q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Q}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=K(this,t,e,0),o=!P(t)||t!==this._$AH&&t!==B,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=K(this,s[i+n],e,n),a===B&&(a=this._$AH[n]),o||=!P(a)||a!==this._$AH[n],a===Q?t=Q:t!==Q&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Q?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Q)}}class it extends Y{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??Q)===B)return;const i=this._$AH,s=t===Q&&i!==Q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==Q&&(i===Q||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const rt=q.litHtmlPolyfillSupport;rt?.(J,X),(q.litHtmlVersions??=[]).push("3.3.2");const ot=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new X(e.insertBefore(T(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}nt._$litElement$=!0,nt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:nt});const at=ot.litElementPolyfillSupport;at?.({LitElement:nt}),(ot.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:b},lt=(t=ct,e,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function dt(t){return(e,i)=>"object"==typeof i?lt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ht(t){return dt({...t,state:!0,attribute:!1})}const pt=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)})`
  :host {
    --ciq-bg: var(--ha-card-background, rgba(10, 12, 16, 0.85));
    --ciq-panel-bg: rgba(2, 6, 23, 0.45);
    --ciq-border: rgba(148, 163, 184, 0.12);
    --ciq-accent: #38bdf8;
    --ciq-accent-dim: rgba(56, 189, 248, 0.15);
    --ciq-accent-border: rgba(56, 189, 248, 0.3);
    --ciq-accent-hover: rgba(56, 189, 248, 0.25);
    --ciq-text-primary: var(--primary-text-color, hsl(215, 28%, 92%));
    --ciq-text-secondary: hsl(215, 20%, 65%);
    --ciq-green: #4ade80;
    --ciq-yellow: #facc15;
    --ciq-red: #ef4444;
    --ciq-radius-card: 12px;
    --ciq-radius-inner: 8px;
    --ciq-radius-pill: 9999px;
    --ciq-glow: 0 0 15px rgba(56, 189, 248, 0.15);
    --ciq-font: system-ui, -apple-system, sans-serif;
  }

  ha-card {
    background: var(--ciq-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--ciq-border);
    border-radius: var(--ciq-radius-card);
    color: var(--ciq-text-primary);
    font-family: var(--ciq-font);
    padding: 20px;
    overflow: hidden;
  }

  /* --- Header --- */
  .ciq-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .ciq-title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--ciq-text-primary);
  }

  .ciq-mode-badge {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    padding: 4px 12px;
    border-radius: var(--ciq-radius-pill);
    background: var(--ciq-accent-dim);
    border: 1px solid var(--ciq-accent-border);
    color: var(--ciq-accent);
    box-shadow: var(--ciq-glow);
  }

  .ciq-readonly-badge {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    padding: 4px 10px;
    border-radius: var(--ciq-radius-pill);
    background: rgba(148, 163, 184, 0.1);
    border: 1px solid rgba(148, 163, 184, 0.25);
    color: var(--ciq-text-secondary);
  }

  /* --- Thermostat Panel --- */
  .ciq-thermostat {
    background: var(--ciq-panel-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--ciq-border);
    border-radius: var(--ciq-radius-inner);
    padding: 24px;
    text-align: center;
    margin-bottom: 16px;
  }

  .ciq-current-temp {
    font-size: 64px;
    font-weight: 900;
    line-height: 1;
    color: var(--ciq-text-primary);
    margin-bottom: 4px;
  }

  .ciq-current-temp .unit {
    font-size: 28px;
    font-weight: 600;
    color: var(--ciq-text-secondary);
    vertical-align: super;
  }

  .ciq-target-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 8px;
  }

  .ciq-target-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--ciq-text-secondary);
  }

  .ciq-target-temp {
    font-size: 20px;
    font-weight: 700;
    color: var(--ciq-accent);
  }

  .ciq-hvac-mode {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    padding: 3px 10px;
    border-radius: var(--ciq-radius-pill);
    background: var(--ciq-panel-bg);
    border: 1px solid var(--ciq-border);
    color: var(--ciq-text-secondary);
    margin-top: 12px;
  }

  .ciq-hvac-mode.heat {
    color: #fb923c;
    border-color: rgba(251, 146, 60, 0.3);
    background: rgba(251, 146, 60, 0.1);
  }

  .ciq-hvac-mode.cool {
    color: var(--ciq-accent);
    border-color: var(--ciq-accent-border);
    background: var(--ciq-accent-dim);
  }

  .ciq-hvac-mode.auto {
    color: #a78bfa;
    border-color: rgba(167, 139, 250, 0.3);
    background: rgba(167, 139, 250, 0.1);
  }

  .ciq-hvac-mode.off {
    color: var(--ciq-text-secondary);
  }

  /* --- Override Controls --- */
  .ciq-override {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 16px;
  }

  .ciq-override-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--ciq-border);
    background: var(--ciq-panel-bg);
    color: var(--ciq-text-primary);
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    line-height: 1;
    padding: 0;
  }

  .ciq-override-btn:hover {
    background: var(--ciq-accent-hover);
    border-color: var(--ciq-accent-border);
    box-shadow: var(--ciq-glow);
  }

  .ciq-override-btn:active {
    transform: scale(0.95);
  }

  .ciq-override-value {
    font-size: 28px;
    font-weight: 900;
    color: var(--ciq-accent);
    min-width: 80px;
    text-align: center;
  }

  .ciq-override-value .unit {
    font-size: 14px;
    font-weight: 600;
    color: var(--ciq-text-secondary);
    vertical-align: super;
  }

  .ciq-override-label {
    text-align: center;
    margin-bottom: 8px;
  }

  .ciq-override-active {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    padding: 3px 10px;
    border-radius: var(--ciq-radius-pill);
    background: rgba(250, 204, 21, 0.1);
    border: 1px solid rgba(250, 204, 21, 0.3);
    color: var(--ciq-yellow);
    margin-bottom: 12px;
    text-align: center;
  }

  /* --- Zones --- */
  .ciq-section-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--ciq-text-secondary);
    margin-bottom: 10px;
  }

  .ciq-zones {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  .ciq-zone {
    background: var(--ciq-panel-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--ciq-border);
    border-radius: var(--ciq-radius-inner);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ciq-zone-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--ciq-text-primary);
  }

  .ciq-zone-stats {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .ciq-zone-stat {
    text-align: right;
  }

  .ciq-zone-stat-value {
    font-size: 16px;
    font-weight: 700;
    color: var(--ciq-text-primary);
  }

  .ciq-zone-stat-label {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--ciq-text-secondary);
  }

  .ciq-zone-occupancy {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .ciq-zone-occupancy.occupied {
    background: var(--ciq-green);
    box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
  }

  .ciq-zone-occupancy.vacant {
    background: var(--ciq-text-secondary);
    opacity: 0.4;
  }

  /* --- Quick Actions --- */
  .ciq-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .ciq-action-btn {
    background: var(--ciq-accent-dim);
    border: 1px solid var(--ciq-accent-border);
    border-radius: var(--ciq-radius-inner);
    color: var(--ciq-accent);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 10px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--ciq-font);
  }

  .ciq-action-btn:hover {
    background: var(--ciq-accent-hover);
    box-shadow: var(--ciq-glow);
  }

  .ciq-action-btn:active {
    transform: scale(0.97);
  }

  .ciq-action-btn:disabled,
  .ciq-override-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
  }

  .ciq-action-btn.eco {
    color: var(--ciq-green);
    background: rgba(74, 222, 128, 0.1);
    border-color: rgba(74, 222, 128, 0.3);
  }

  .ciq-action-btn.eco:hover {
    background: rgba(74, 222, 128, 0.2);
    box-shadow: 0 0 15px rgba(74, 222, 128, 0.15);
  }

  .ciq-action-btn.away {
    color: var(--ciq-yellow);
    background: rgba(250, 204, 21, 0.1);
    border-color: rgba(250, 204, 21, 0.3);
  }

  .ciq-action-btn.away:hover {
    background: rgba(250, 204, 21, 0.2);
    box-shadow: 0 0 15px rgba(250, 204, 21, 0.15);
  }

  .ciq-action-btn.boost-heat {
    color: #fb923c;
    background: rgba(251, 146, 60, 0.1);
    border-color: rgba(251, 146, 60, 0.3);
  }

  .ciq-action-btn.boost-heat:hover {
    background: rgba(251, 146, 60, 0.2);
    box-shadow: 0 0 15px rgba(251, 146, 60, 0.15);
  }

  .ciq-action-btn.boost-cool {
    color: var(--ciq-accent);
    background: var(--ciq-accent-dim);
    border-color: var(--ciq-accent-border);
  }

  .ciq-action-btn.boost-cool:hover {
    background: var(--ciq-accent-hover);
    box-shadow: var(--ciq-glow);
  }

  /* --- Status / Error --- */
  .ciq-status {
    text-align: center;
    padding: 40px 20px;
    color: var(--ciq-text-secondary);
    font-size: 14px;
  }

  .ciq-status-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--ciq-text-primary);
    margin-bottom: 8px;
  }

  .ciq-error {
    color: var(--ciq-red);
  }

  .ciq-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--ciq-border);
    border-top-color: var(--ciq-accent);
    border-radius: 50%;
    animation: ciq-spin 0.8s linear infinite;
    margin: 0 auto 12px;
  }

  @keyframes ciq-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* --- Divider --- */
  .ciq-divider {
    height: 1px;
    background: var(--ciq-border);
    margin: 16px 0;
  }
`;window.customCards=window.customCards||[],window.customCards.push({type:"climateiq-card",name:"ClimateIQ Card",description:"AI-powered climate management dashboard card"});let ut=class extends nt{constructor(){super(...arguments),this._zones=[],this._systemConfig=null,this._override=null,this._activeSchedule=null,this._loading=!0,this._error=null,this._overrideTemp=null,this._addonSlug="local_climateiq",this._ingressBase="",this._ingressResolved=!1,this._ingressSession=""}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config={title:"ClimateIQ",show_zones:!0,show_quick_actions:!0,show_override:!0,...t},t.addon_slug&&(this._addonSlug=t.addon_slug)}getCardSize(){let t=3;return this._config?.show_override&&(t+=2),this._config?.show_zones&&this._zones.length&&(t+=this._zones.length),this._config?.show_quick_actions&&(t+=2),t}connectedCallback(){super.connectedCallback(),this._startRefresh()}disconnectedCallback(){super.disconnectedCallback(),this._stopRefresh()}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._ingressResolved&&this._resolveIngress()}async _resolveIngress(){if(this._ingressResolved)return;try{const t=await this.hass.callWS({type:"supervisor/api",endpoint:"/ingress/session",method:"post"});t?.session&&(this._ingressSession=t.session,document.cookie=`ingress_session=${t.session};path=/api/hassio_ingress/;SameSite=Strict${"https:"===location.protocol?";Secure":""}`)}catch{}const t=this._config?.addon_slug;if(!t)try{const t=await this.hass.callWS({type:"supervisor/api",endpoint:"/addons",method:"get"}),e=t?.addons??[],i=e.find(t=>"local_climateiq"===t.slug)||e.find(t=>/climateiq/i.test(t.slug))||e.find(t=>/climateiq/i.test(t.name??""));if(!i){const t=e.filter(t=>t.slug?.startsWith("local_")).map(t=>`${t.slug} (${t.name})`).join(", ");return this._ingressResolved=!0,this._loading=!1,void(this._error=t?`ClimateIQ addon not found. Set addon_slug in card config. Local addons found: ${t}`:"ClimateIQ addon not found and no local addons are installed. Set addon_slug in card config.")}this._addonSlug=i.slug}catch{}try{const t=await this.hass.callWS({type:"supervisor/api",endpoint:`/addons/${this._addonSlug}/info`,method:"get"});t?.ingress_url&&(this._ingressBase=t.ingress_url.replace(/\/$/,""))}catch{}this._ingressResolved=!0,this._fetchAll()}async _refreshIngressSession(){if(this._ingressSession)try{await this.hass.callWS({type:"supervisor/api",endpoint:"/ingress/validate_session",method:"post",data:{session:this._ingressSession}})}catch{this._ingressResolved=!1,this._ingressSession="",this._resolveIngress()}}async _fetchApi(t){if(!this._ingressBase)throw new Error("Ingress not resolved");const e=`${this._ingressBase}/api/v1${t}`,i=await fetch(e,{headers:{"Content-Type":"application/json"},credentials:"same-origin"});if(!i.ok)throw new Error(`API ${i.status}`);return i.json()}async _postApi(t,e){if(!this._ingressBase)throw new Error("Ingress not resolved");const i=`${this._ingressBase}/api/v1${t}`,s=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(e)});if(!s.ok)throw new Error(`API ${s.status}`);return s.json()}async _fetchAll(){if(this.hass&&this._ingressBase){this._refreshIngressSession();try{const[t,e,i,s]=await Promise.all([this._fetchApi("/zones").catch(()=>[]),this._fetchApi("/system/config").catch(()=>null),this._fetchApi("/system/override").catch(()=>null),this._fetchApi("/schedule/active").catch(()=>null)]);this._zones=t,this._systemConfig=e,this._override=i,this._activeSchedule=s,null!=i?.target_temp&&null==this._overrideTemp&&(this._overrideTemp=i.target_temp),this._loading=!1,this._error=null}catch(t){this._loading=!1,this._error=t instanceof Error?t.message:"Failed to connect to ClimateIQ add-on"}}}_startRefresh(){this._stopRefresh(),this._refreshInterval=window.setInterval(()=>this._fetchAll(),3e4)}_stopRefresh(){null!=this._refreshInterval&&(clearInterval(this._refreshInterval),this._refreshInterval=void 0)}async _handleQuickAction(t){if(this._canControl)try{await this._postApi("/system/quick-action",{action:t}),setTimeout(()=>this._fetchAll(),500)}catch{}}_handleTempAdjust(t){this._canControl&&(null==this._overrideTemp&&(this._overrideTemp=this._override?.target_temp??72),this._overrideTemp=Math.round(10*(this._overrideTemp+t))/10)}async _handleOverrideSubmit(){if(this._canControl&&null!=this._overrideTemp)try{await this._postApi("/system/override",{temperature:this._overrideTemp}),setTimeout(()=>this._fetchAll(),500)}catch{}}get _canControl(){const t=this._config?.allowed_users;if(!t||0===t.length)return!1;const e=this.hass?.user;if(!e)return!1;if(e.is_admin)return!0;const i=(e.name??"").toLowerCase();return t.some(t=>t.toLowerCase()===i)}get _tempUnit(){return(this.hass?.config?.unit_system?.temperature??"").includes("C")?"°C":"°F"}_celsiusToDisplay(t){return null==t?null:"°F"===this._tempUnit?9*t/5+32:t}_formatTemp(t){return null==t?"--":Math.round(t).toString()}_modeLabel(t){if(!t)return"Unknown";return{learn:"Learning",scheduled:"Scheduled",follow_me:"Follow Me",active:"Active"}[t]||t.charAt(0).toUpperCase()+t.slice(1)}render(){return this._config?D`
      <ha-card>
        ${this._renderHeader()}
        ${this._loading?this._renderLoading():this._error?this._renderError():this._renderContent()}
      </ha-card>
    `:Q}_renderHeader(){const t=this._systemConfig?.current_mode;return D`
      <div class="ciq-header">
        <span class="ciq-title">${this._config.title}</span>
        <div style="display:flex;align-items:center;gap:8px">
          ${t?D`<span class="ciq-mode-badge">${this._modeLabel(t)}</span>`:Q}
          ${this._canControl?Q:D`<span class="ciq-readonly-badge">View Only</span>`}
        </div>
      </div>
    `}_renderLoading(){return D`
      <div class="ciq-status">
        <div class="ciq-spinner"></div>
        <div>Connecting to ClimateIQ...</div>
      </div>
    `}_renderError(){return D`
      <div class="ciq-status">
        <div class="ciq-status-title ciq-error">Add-on Unavailable</div>
        <div>${this._error}</div>
      </div>
    `}_renderContent(){return D`
      ${this._renderThermostat()}
      ${this._config.show_override?this._renderOverride():Q}
      ${this._config.show_zones&&this._zones.length?this._renderZones():Q}
      ${this._config.show_quick_actions?this._renderActions():Q}
    `}_renderThermostat(){const t=this._override,e=t?.hvac_mode||"off",i=this._tempUnit,s=this._activeSchedule?.active&&this._activeSchedule.schedule&&this._activeSchedule.schedule.zone_ids.length>0?new Set(this._activeSchedule.schedule.zone_ids):null,r=this._zones.filter(t=>null!=t.current_temp&&(null===s||s.has(t.id))),o=r.length>0?r.reduce((t,e)=>t+this._celsiusToDisplay(e.current_temp),0)/r.length:null,n=t?.target_temp;return D`
      <div class="ciq-thermostat">
        <div class="ciq-current-temp">
          ${this._formatTemp(o)}<span class="unit">${i}</span>
        </div>
        <div class="ciq-target-row">
          <span class="ciq-target-label">Target</span>
          <span class="ciq-target-temp">
            ${this._formatTemp(n)}${i}
          </span>
        </div>
        <div class="ciq-hvac-mode ${e}">${e.toUpperCase()}</div>
      </div>
    `}_renderOverride(){const t=this._override,e=this._tempUnit,i="°C"===this._tempUnit?.5:1,s=this._overrideTemp??t?.target_temp??null,r=t?.is_override_active??!1,o=this._canControl&&null!=s&&s!==t?.target_temp,n=this._canControl;return D`
      <div class="ciq-divider"></div>
      <div class="ciq-section-label">Manual Override</div>
      ${r?D`<div class="ciq-override-active">Override Active</div>`:Q}
      <div class="ciq-override">
        <button
          class="ciq-override-btn"
          ?disabled=${!n}
          @click=${()=>this._handleTempAdjust(-i)}
        >
          -
        </button>
        <div class="ciq-override-value">
          ${this._formatTemp(s)}<span class="unit">${e}</span>
        </div>
        <button
          class="ciq-override-btn"
          ?disabled=${!n}
          @click=${()=>this._handleTempAdjust(i)}
        >
          +
        </button>
      </div>
      ${o?D`
            <div style="text-align:center;margin-bottom:12px">
              <button
                class="ciq-action-btn"
                style="display:inline-block;width:auto;padding:8px 24px"
                @click=${this._handleOverrideSubmit}
              >
                Set Temperature
              </button>
            </div>
          `:Q}
    `}_renderZones(){const t=this._tempUnit;return D`
      <div class="ciq-divider"></div>
      <div class="ciq-section-label">Zones</div>
      <div class="ciq-zones">
        ${this._zones.map(e=>D`
            <div class="ciq-zone">
              <div style="display:flex;align-items:center;gap:10px">
                <span
                  class="ciq-zone-occupancy ${e.is_occupied?"occupied":"vacant"}"
                ></span>
                <span class="ciq-zone-name">${e.name}</span>
              </div>
              <div class="ciq-zone-stats">
                <div class="ciq-zone-stat">
                  <div class="ciq-zone-stat-value">
                    ${this._formatTemp(this._celsiusToDisplay(e.current_temp))}${t}
                  </div>
                  <div class="ciq-zone-stat-label">Temp</div>
                </div>
                ${null!=e.current_humidity?D`
                      <div class="ciq-zone-stat">
                        <div class="ciq-zone-stat-value">
                          ${Math.round(e.current_humidity)}%
                        </div>
                        <div class="ciq-zone-stat-label">Humidity</div>
                      </div>
                    `:Q}
              </div>
            </div>
          `)}
      </div>
    `}_renderActions(){const t=this._canControl;return D`
      <div class="ciq-divider"></div>
      <div class="ciq-section-label">Quick Actions</div>
      <div class="ciq-actions">
        <button
          class="ciq-action-btn eco"
          ?disabled=${!t}
          @click=${()=>this._handleQuickAction("eco")}
        >
          Eco Mode
        </button>
        <button
          class="ciq-action-btn away"
          ?disabled=${!t}
          @click=${()=>this._handleQuickAction("away")}
        >
          Away Mode
        </button>
        <button
          class="ciq-action-btn boost-heat"
          ?disabled=${!t}
          @click=${()=>this._handleQuickAction("boost_heat")}
        >
          Boost Heat
        </button>
        <button
          class="ciq-action-btn boost-cool"
          ?disabled=${!t}
          @click=${()=>this._handleQuickAction("boost_cool")}
        >
          Boost Cool
        </button>
      </div>
    `}};ut.styles=pt,t([dt({attribute:!1})],ut.prototype,"hass",void 0),t([ht()],ut.prototype,"_config",void 0),t([ht()],ut.prototype,"_zones",void 0),t([ht()],ut.prototype,"_systemConfig",void 0),t([ht()],ut.prototype,"_override",void 0),t([ht()],ut.prototype,"_activeSchedule",void 0),t([ht()],ut.prototype,"_loading",void 0),t([ht()],ut.prototype,"_error",void 0),t([ht()],ut.prototype,"_overrideTemp",void 0),ut=t([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("climateiq-card")],ut);export{ut as ClimateIQCard};
