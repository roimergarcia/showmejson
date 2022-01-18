/** Showmejson
 * @author Roimer Garcia
 *      contact roimergarcia@gmail.com
 *      source available in https://github.com/roimergarcia/showmejson
 *      date 2022-01-05
 * @license  CC BY-SA 3.0 http://creativecommons.org/licenses/by-sa/3.0/deed.es
 * 
*/

"use strict"


const showmejson = (function(){ 
        
    const defaultOptions = {
        /**
         * Sets if a Style tag is going to ve automatically included in the main container
         */
        includeStyles: true,
        /**
         * Sets the maiximun depth for rendering sub objects.
         */
        maxDepth: 10
    }

    const DEFAULT_STYLES = ` 
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
    .showmejson > details {
        margin: 0;
    }
    .showmejson details {
        border: 1px solid #aaa;
        border-radius: 4px;
        padding: var(--smj-spacing);
        margin: var(--smj-spacing) 0;
    }
    .showmejson summary {
        margin: calc( - var(--smj-spacing)) ;
        padding: 0;
        cursor: pointer;
    }
    .showmejson .showmejson__single-item{
        display: flex;
        gap: 1rem;
        margin: 0.5em 0px;
        font-family: monospace, monospace;
        white-space: pre;
    }
    .showmejson .showmejson__value--text{
        color: #080;
    }
    .showmejson .showmejson__value--number, 
    .showmejson .showmejson__value--symbol{
        color: #FF4488;
    } 
    .showmejson .showmejson__value--date{
        color: #0033FF;
    }
    .showmejson .showmejson__value--nothing{
        color: #6B548C;
        font-style: oblique;
    }
    .showmejson .showmejson__value--symbol, 
    .showmejson .showmejson__value--object{
        color: #804040;
    }
    `;
    
    /**
     * Returns and HTML representation of an object, in the form of a DocumentFragment.
     * @param {Object} obj - Object to be rendered as html
     * @param {Object} options - Rendering options
     * @param {boolean} options.includeStyles - Sets if should include the default Stylesheet
     * @param {number} options.maxDepth - Sets how depth to search for sub-objects to render
     * @returns 
     */
    const getFragment =  function(obj, options){

        //Apply user defined options
        const opt = Object.assign({}, defaultOptions, options);

        const fragment = document.createDocumentFragment();

        const container = document.createElement('div');
        container.classList.add('showmejson');

        if( opt.includeStyles ){
            const styles = document.createElement('style');
            styles.innerHTML = DEFAULT_STYLES;
            container.append(styles);
        }

        renderItem(container, opt.maxDepth, obj, '');
        
        fragment.append(container);
        
        return fragment

    }

    /**
     * Recursively renders an plain item or an object into the containner.
     * @param {HTMLElement} container - Element where the value is going to be rendered.
     * @param {number} remainingDepth - How much Depth to search for subproperties to render
     * @param {(*|Object)} obj - Value to be rendered
     * @param {String} [name] - Name for the value
     * @returns 
     */
    const renderItem = function(container, remainingDepth, obj, name){
        
        //Handles primitives/simple values...
        if ( typeof obj === 'string' ){

            const singleValue = document.createElement('div');
            //singleValue.classList.add();
            singleValue.classList.add('showmejson__single-item');

            const n = document.createElement('span');
            n.classList.add('showmejson__label');
            n.textContent = name? name+':': '';
            singleValue.append(n);
            
            const v = document.createElement('span');
            v.classList.add('showmejson__value', 'showmejson__value--text');
            v.textContent = `${JSON.stringify(obj).replace(/(\\n|\\r)/g, '$1\n')}`;
            singleValue.append(v);

            container.append(singleValue);
            return 

        } else if ( obj === null || ['boolean', 'number', 'null', 'undefined'].includes(typeof obj)){

            const singleValue = document.createElement('div');
            singleValue.classList.add('showmejson__single-item');

            const n = document.createElement('span');
            n.classList.add('showmejson__label');
            n.textContent = name? name+':': '';
            singleValue.append(n);
            
            const v = document.createElement('span');
            v.classList.add('showmejson__value', 'showmejson__value--number');
            v.textContent = '' + obj;
            singleValue.append(v);

            //singleValue.textContent = (name?name+':':'') + obj;
            container.append(singleValue);
            return

        } else if ( typeof obj === 'symbol'){

            const singleValue = document.createElement('div');
            singleValue.classList.add('showmejson__single-item');

            const n = document.createElement('span');
            n.classList.add('showmejson__label');
            n.textContent = name? name+':': '';
            singleValue.append(n);
            
            const v = document.createElement('span');
            v.classList.add('showmejson__value', 'showmejson__value--symbol');
            v.textContent = obj.toString();
            singleValue.append(v);

            //singleValue.textContent = (name?name+':':'') + obj.toString();
            container.append(singleValue);
            return

        } else if ( obj instanceof Date){

            const singleValue = document.createElement('div');
            singleValue.classList.add('showmejson__single-item');

            const n = document.createElement('span');
            n.classList.add('showmejson__label');
            n.textContent = name? name+':': '';
            singleValue.append(n);
            
            const v = document.createElement('span');
            v.classList.add('showmejson__value', 'showmejson__value--date');
            v.textContent = obj.toISOString();
            singleValue.append(v);

            container.append(singleValue);
            return
        }

        // If it is an object, and we are too depth: stop and print it
        if( remainingDepth === 0){
            const singleValue = document.createElement('div');
            singleValue.classList.add('showmejson__single-item');

            const n = document.createElement('span');
            n.classList.add('showmejson__label');
            n.textContent = name? name+':': '';
            singleValue.append(n);
            
            const v = document.createElement('span');
            v.classList.add('showmejson__value', 'showmejson__value--object');
            v.textContent = typeof obj + ' {...}';
            singleValue.append(v);
            
            container.append(singleValue);
            return
        }

        //Handles objects: renders a header and then each property  
        const block = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = (name? name: `[${typeof obj}]`);
        block.open = !name; //unnamed objects are open by default
        block.append(summary);

        const props = Object.getOwnPropertyNames(obj);
        props.forEach( (value, index, array) => {

            renderItem(block, remainingDepth - 1, obj[value], value);

        });

        container.append(block);

    }

    return {
        getFragment
    }

})();

export { showmejson };