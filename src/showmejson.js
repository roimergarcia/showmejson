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
        margin: var(--smj-spacing);
    }
    .showmejson summary {
        margin: calc( - var(--smj-spacing)) ;
        padding: var(--smj-spacing);
    }
    .showmejson .details[open] summary{
        display: none;
    }
    `;

    /**
     * Returns and HTML representation of an object, in the form of a DocumentFragment.
     * @param {Object} obj - Object to be rendered as html
     * @param {Object} options - Rendering options
     * @param {boolean} options.includeStyles - Sets if sould include the default Stylesheet
     * @returns 
     */
    const getFragment =  function(obj, options){
        console.log(typeof obj)

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

        renderItem(container, opt.maxDepth - 1, obj, '');

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
        
        //Handles single values...
        if ( typeof obj === 'string' ){

            const singleValue = document.createElement('pre');
            singleValue.classList.add('showmejson__plain-text');
            singleValue.textContent = (name?name+':':'') + `${JSON.stringify(obj).replace(/(\\n|\\r)/g, '$1\n')}`;

            container.append(singleValue);
            return 

        } else if ( obj === null || ['boolean', 'number', 'null', 'undefined'].includes(typeof obj)){

            const singleValue = document.createElement('div');
            singleValue.textContent = (name?name+':':'') + obj;
            container.append(singleValue);
            return

        } else if ( typeof obj === 'symbol'){

            const singleValue = document.createElement('div');
            singleValue.textContent = (name?name+':':'') + obj.toString();
            container.append(singleValue);
            return
        }

        // If it is an object, and we are too depth: stop and print it
        if( remainingDepth === 0){
            const singleValue = document.createElement('pre');
            //singleValue.textContent = (name?name+':':'') + `${JSON.stringify(obj[value]).substring(0, 30) + '...'}`;
            singleValue.textContent = (name?name+':':'') + typeof obj;

            block.append(singleValue);
        }

        //Handles objects  
        const block = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = (name?name+':':'') + `[${typeof obj}]`;
        block.open = !name; //unnamed objects are open by default
        block.append(summary);

        const props = Object.getOwnPropertyNames(obj);
        props.forEach( (value, index, array) => {
            console.log({n:value, v:obj[value], t:typeof obj[value]})

            renderItem(block, remainingDepth - 1, obj[value], value);

        });

        container.append(block);

    }

    return {
        getFragment
    }


})();

export { showmejson };