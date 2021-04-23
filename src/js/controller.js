import * as model from './model.js';
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//updating modules in the browser at runtime without needing a whole page refresh
if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //1.loading recipe
    await model.loadRecipe(id); //we use await as loadRecipe is an asynch function

    //2. Rendering the recipe
    recipeView.render(model.state.recipe)

  } catch (err) {
    // console.log(err)
    recipeView.renderError()
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()
    //1.get search  query
    const query = searchView.getQuery()
    if (!query) return

    //2. load search results
    await model.loadSearchResults(query)

    //3.render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultPage(6))

    //Render initial pagination buttons
    paginationView.render(model.state.search)

  } catch (err) {
    console.error(err)
  }
}

const controlPagination = function(){
  console.log('Pag controller')

  
}

//this method is called publisher - subscriber method
const init = function () {
  recipeView.addhandlerRender(controlRecipe)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
}
init()
