import { async } from 'regenerator-runtime';
import recipeView from './views/recipeView.js';
import { API_URL, RES_PER_PAGE } from './config.js'; //named export
import { getJSON } from './helpers.js';


//empty state
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page:1,
    resultsPerPage: RES_PER_PAGE,
  },
};

//filling state by fetching api
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    // console.log(state.recipe);
  } catch (err) {
    //temp error handling
    console.error(`${err} 🔴🔴🔴`);
    // here we take the thrown err from helper and again throw it to controller for recipe.renderError
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    // console.log(state.search.results)
  } catch (err) {
    console.error(`${err} 🔴🔴🔴`);
    // here we take the thrown err from helper and again throw it to controller for recipe.renderError
    throw err;
  }
};

// loadSearchResults('pizza')
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page

  const start = (page - 1) * state.search.resultsPerPage //0
  const end = page * state.search.resultsPerPage  //9

  return state.search.results.slice(start, end)
}