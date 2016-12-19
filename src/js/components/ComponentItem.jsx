import React from 'react';
import {render} from 'react-dom';

//TODO: Convert this to component
// let anchor = document.createElement('a');
// anchor.target= '_blank';
// anchor.textContent = el;
// anchor.classList.add('collection-item');
// elementListItemInnerEl.appendChild(anchor);

anchor.addEventListener('mouseenter', showCustomElements);
anchor.addEventListener('click', togglePinnedCustomElements);
anchor.addEventListener('mouseleave', hideCustomElements);

class ComponentItem extends React.Component {
  render () {
    return <a>Component Item line here.</a>
  }
}
