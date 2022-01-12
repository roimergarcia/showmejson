# Showmejson (v0.1)
Es una pequeña utilidad para visualizar un objeto Javascript en un formato _similar_ a JSON, usando html.

```
import { showmejson } from "/dist/showmejson.min.js";

//Test object to render:
const obj = {
    longText: 'Long text test\nwith two lines',
    numeric: 42.5,
    isActive: false,
    nullValue: null,
    valueNotDefined: undefined,
    symbolValue: Symbol('test symbol'),
    objectValue: { a: 1, b: false, c: new Date(2022, 1, 17)},
    otherValue: { x: 1234567890.987, 
        y: { name: 'myName', value: 'MyValue' }, 
        z: 'string variable!'
    }
}

//Returns a FragmentDocument 
const myFragment = showmejson.getFragment(obj);
const output = document.querySelector('#output');
output.appendChild(myFragment);

//Applying custom options
const options = { includeStyles:false, maxDepth: 2 }; 
const myFragment2 = showmejson.getFragment(obj, options);
output.appendChild(myFragment2);
```
