// // simplify the creation of HTML elements in JavaScript
// function createElement(tag, attributes = {}, ...children) {
//     const element = document.createElement(tag);
//     Object.keys(attributes).forEach(key => {
//         element.setAttribute(key, attributes[key]);
//     });
//     children.forEach(child => {
//         if (typeof child === 'string') {
//             element.appendChild(document.createTextNode(child));
//         } else {
//             element.appendChild(child);
//         }
//     });
//     return element;
// }

// export { createElement };