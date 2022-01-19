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
        maxDepth: 10,
        /**
         * Sets how should add colors, according to each value type
         */
        addColor: true
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
    .showmejson details {
        border: 1px solid #AAAAAA;
        border-radius: 4px;
        padding: var(--smj-spacing);
        margin: var(--smj-spacing) 0;
    }
    .showmejson > details {
        margin: 0;
    }
    .showmejson details summary {
        font-family: monospace, monospace;
        margin: calc( - var(--smj-spacing)) ;
        padding: 0;
        cursor: pointer;
    }
    .showmejson details[open] > summary {
        padding-bottom: 4px;
        border-bottom: 1px solid var(--smj-border-color);
    }
    .showmejson .showmejson__single-item {
        display: flex;
        gap: 1rem;
        margin: 0.5em 0px;
        font-family: monospace, monospace;
        white-space: pre;
    }
    .showmejson.showmejson--add-color .showmejson__value--text {
        color: #008800;
    }
    .showmejson.showmejson--add-color .showmejson__value--number {
        color: #0033FF;
    } 
    .showmejson.showmejson--add-color .showmejson__value--boolean {
        color: #CC00FF;
    } 
    .showmejson.showmejson--add-color .showmejson__value--date {
        color: #FF4488;
    }
    .showmejson.showmejson--add-color .showmejson__value--nothing {
        color: #6B548C;
        font-style: oblique;
    }
    .showmejson.showmejson--add-color .showmejson__value--symbol, 
    .showmejson.showmejson--add-color .showmejson__value--object {
        color: #804040;
    }
    `;

    /**
     * Returns and HTML representation of an object, in the form of a DocumentFragment.
     * @param {Object} obj - Object to be rendered as html
     * @param {Object} options - Rendering options
     * @param {boolean} options.includeStyles - Sets if should include the default Stylesheet
     * @param {number} options.maxDepth - Sets how depth to search for sub-objects to render
     * @param {number} options.addColor - Sets how should add colors, according to each value type
     * @returns 
     */
    const getFragment =  function(obj, options){

        //Apply user defined options
        const opt = Object.assign({}, defaultOptions, options);

        const fragment = document.createDocumentFragment();

        const container = document.createElement('div');
        container.classList.add('showmejson');

        if ( opt.addColor ){
            container.classList.add('showmejson--add-color');
        }
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
        
        let objType = typeof obj;
        if ( obj === null ){
            objType = 'null';
        } else if ( objType === 'object' ) {
            objType = obj.constructor.name;
        }
        
        //console.log({objType, obj})

        if ( remainingDepth === 0 ||
             ['string', 'number', 'boolean', 'null', 
              'undefined', 'symbol', 'date'].includes(objType.toLowerCase()) ){

            const singleValue = document.createElement('div');
            singleValue.classList.add('showmejson__single-item');

            const itemName = document.createElement('span');
            itemName.classList.add('showmejson__label');
            itemName.textContent = name? name+':': '';
            singleValue.append(itemName);
            
            const itemVal = document.createElement('span');
            itemVal.classList.add('showmejson__value');
            switch (objType) {
                case 'string':
                case 'String':
                    itemVal.classList.add('showmejson__value--text');
                    itemVal.textContent = `${JSON.stringify(obj).replace(/(\\n|\\r)/g, '$1\n')}`;
                    break;
                    
                case 'number':
                case 'Number':
                    itemVal.classList.add('showmejson__value--number');
                    itemVal.textContent = obj.toString();
                    break;
            
                case 'boolean':
                case 'Boolean':
                    itemVal.classList.add('showmejson__value--boolean');
                    itemVal.textContent = obj.toString();
                    break;
                     
                case 'null':
                case 'undefined':
                    itemVal.classList.add('showmejson__value--nothing');
                    itemVal.textContent = '' + obj;
                    break;
            
                case 'symbol':
                case 'Symbol':
                    itemVal.classList.add('showmejson__value--symbol');
                    itemVal.textContent = obj.toString();
                    break;
                    
                case 'Date':
                    itemVal.classList.add('showmejson__value--date');
                    itemVal.textContent = obj.toISOString();
                    break;
            
                default: //It's an object, but it's already too depht to be showen
                    itemVal.classList.add('showmejson__value--object');
                    itemVal.textContent = objType + ' {...}';
                    break;
            }
            singleValue.append(itemVal);

            container.append(singleValue);
            return 

        }
 
        //Handles objects: renders a header and then each property  
        const block = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = (name? name + ' ': '') + `[${objType}]`;
        block.open = !name; //unnamed objects are open by default
        block.append(summary);

        container.append(block);

        const props = Object.getOwnPropertyNames(obj);
        props.forEach( (value, index, array) => {

            renderItem(block, remainingDepth - 1, obj[value], value);

        });

    }

    return {
        getFragment
    }

})();

export { showmejson };