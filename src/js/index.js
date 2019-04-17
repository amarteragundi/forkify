import Search from './models/Search';
import * as searchView from './views/searchView.js';
import {elements} from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const search = new Search("pizza");
search.getResults()