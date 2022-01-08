/** Showmejson
 * @author Roimer Garcia
 *      contact roimergarcia@gmail.com
 *      source available in https://github.com/roimergarcia/showmejson
 *      date 2022-01-05
 * @license  CC BY-SA 3.0 http://creativecommons.org/licenses/by-sa/3.0/deed.es
 * 
*/

"use strict"


const showmejson = { 
    
    /**
     * Returns and HTML representarion of an object, in the form of a DocumentFragment.
     * @param {Object} obj Object to be rendered as html
     * @returns 
     */
    getFragment: function(obj){
        console.log(typeof obj)
        const fragment = document.createDocumentFragment();

        const part = document.createElement('div');

        if ( typeof obj === 'string' ){

            const singleValue = document.createElement('pre');
            singleValue.textContent =JSON.stringify(obj).replace(/(\\n|\\r)/g, '$1\n');

            part.append(singleValue);
            fragment.append(part);
            return fragment;
        } else if ( ['boolean', 'number', 'null', 'undefined', 'symbol'].includes(typeof obj)){
            part.textContent = '' + obj;
            fragment.append(part);
            return fragment;
        }
        
        return fragment

    }
};

export { showmejson };