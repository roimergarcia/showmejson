/** Showmejson
 * @author Roimer Garcia
 *      contact roimergarcia@gmail.com
 *      source available in https://github.com/roimergarcia/showmejson
 *      date 2022-01-05
 * @license  CC BY-SA 3.0 http://creativecommons.org/licenses/by-sa/3.0/deed.es
 * 
*/

"use strict"

const defaultOptions = {
    /**
     * Sets if a Style tag is going to ve automatically included in the main container
     */
    includeStyles: true
}


const showmejson = { 
    
    /**
     * Returns and HTML representarion of an object, in the form of a DocumentFragment.
     * @param {Object} obj Object to be rendered as html
     * @param {{boolean:includeStyles}} options Rendering options
     * @returns 
     */
    getFragment: function(obj, options){
        console.log(typeof obj)

        //Apply user defined options
        const opt = Object.assign({}, defaultOptions, options);


        const fragment = document.createDocumentFragment();

        const container = document.createElement('div');
        container.classList.add('showmejson');

        if( opt.includeStyles ){
            const styles = document.createElement('style');
            styles.innerHTML = ` 
            .showmejson {
                --smj-border-color: #CCCCCC;
                --smj-border-radius: 4px;
                --smj-spacing: 0.5rem;
                display: block;
                padding: var(--smj-spacing);
                margin: var(--smj-spacing);
                border: 1px solid var(--smj-border-color);
                border-radius: var(--smj-border-radius);
            }
            .showmejson details {
                border: 1px solid #aaa;
                border-radius: 4px;
                padding: var(--smj-spacing) var(--smj-spacing) 0;
            }
            .showmejson summary {
                margin: calc( - var(--smj-spacing)) ;
                padding: var(--smj-spacing);
            }
            .showmejson .details[open] summary{
                display: none;
            }
            `;
            container.append(styles);
        }


        //Handles single values...
        if ( typeof obj === 'string' ){

            const singleValue = document.createElement('pre');
            singleValue.classList.add('showmejson__plain-text');
            singleValue.textContent = `${JSON.stringify(obj).replace(/(\\n|\\r)/g, '$1\n')}`;

            container.append(singleValue);
            fragment.append(container);
            return fragment;

        } else if ( obj === null || ['boolean', 'number', 'null', 'undefined'].includes(typeof obj)){

            container.textContent = '' + obj;
            fragment.append(container);
            return fragment;

        } else if ( typeof obj === 'symbol'){

            container.textContent = obj.toString();
            fragment.append(container);
            return fragment;
        }

        //Handles objects
        const block = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = JSON.stringify(obj).substring(0, 30) + '...';
        block.append(summary);

        const props = Object.getOwnPropertyNames(obj);
        props.forEach( (value, index, array) => {
            console.log({n:value, v:obj[value], t:typeof obj[value]})

            if ( typeof obj[value] === 'string' ){
                
                const singleValue = document.createElement('pre');
                singleValue.classList.add('showmejson__plain-text'); 
                singleValue.textContent = `${value}:"${JSON.stringify(obj[value]).replace(/(\\n|\\r)/g, '$1\n')}"`;
    
                block.append(singleValue);
    
            } else if ( ['boolean', 'number', 'null', 'undefined'].includes(typeof obj[value])){
                const singleValue = document.createElement('pre');
                singleValue.textContent = `${value}:${obj[value]}`;
                block.append(singleValue);

            } else if ( typeof obj[value] === 'symbol'){
                const singleValue = document.createElement('pre');
                singleValue.textContent = `${value}:${obj[value].toString()}`;
                block.append(singleValue);

            }else { //generic object
                const singleValue = document.createElement('pre');
                singleValue.textContent = `${value}:${JSON.stringify(obj[value]).substring(0, 30) + '...'}`;
                block.append(singleValue);

            }

        });

        container.append(block);
        fragment.append(container);
        
        return fragment

    }
};

export { showmejson };