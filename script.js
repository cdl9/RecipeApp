let lastMealData = null;

const searchBtn = document.getElementById("search-btn");
const categoryBtn = document.getElementById("category-btn");
const ingredientBtn = document.getElementById("ingredient-btn");
const areaBtn = document.getElementById("area-btn");
const dishBtn = document.getElementById("dish-btn");

const searchBar = document.getElementById("search-input");

const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const mealDetailsCard = document.querySelector(".meal-details");
//const recipeCloseBtn = document.getElementById("recipe-close-btn");

searchBtn.addEventListener("click", getMealList);
searchBar.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    getMealList();
  }
});
categoryBtn.addEventListener("click", getCateogryList);
areaBtn.addEventListener("click", getAreaList);
ingredientBtn.addEventListener("click", getIngredientList);
dishBtn.addEventListener("click", getMealList);

mealList.addEventListener("click", getMealRecipe);
mealList.addEventListener("click", getMealsbyCategory);
mealList.addEventListener("click", getMealsbyArea);
mealList.addEventListener("click", getMealsbyIngredient);
mealList.addEventListener("click", function (e) {
  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    const mealId = favBtn.dataset.id;
    const mealName = favBtn.dataset.name;
    const mealThumb = favBtn.dataset.thumb;
    saveToFavorites(mealId, mealName, mealThumb);
  }
});


window.addEventListener('click', function(e) {
    if(mealDetailsContent.parentElement.classList.contains("showRecipe") && !mealDetailsCard.contains(e.target)) {
        mealDetailsContent.parentElement.classList.remove("showRecipe");
        document.getElementsByClassName("centerDIV")[0].style.display = 'none';
    }
})

function checkIfFavorited(id) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.some(meal => meal.id === id);
}

//Create HTML for meals
function createMealHTML(data){
    

    let html = "";
    if (data.meals) {
                data.meals.forEach(meal => {
		    const isFavorited = checkIfFavorited(meal.idMeal);
                    html += `
  		      <div class="meal-item" data-id="${meal.idMeal}">
    			<div class="meal-img">
      				<button class="fav-btn ${isFavorited ? 'favorited' : ''}" data-id="${meal.idMeal}" data-name="${meal.strMeal}" data-thumb="${meal.strMealThumb}">
        				<i class="${isFavorited ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      				</button>
      				<img src="${meal.strMealThumb}" alt="food">
    			</div>
    			<div class="meal-name">
      				<h3>${meal.strMeal}</h3>
      				<a href="#" class="recipe-btn">Get Recipe</a>
    			</div>
  		      </div>
			`;
                });
                mealList.classList.remove("notFound");
            }
             else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add("notFound");
            }
    return html;
}


// Get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById("search-input").value.trim();
    document.getElementById("result-label").textContent = `Meals with ingredient: ${searchInputTxt}`;

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
	    lastMealData = data; // <--- store data
            mealList.innerHTML = createMealHTML(data);

	    categoryBtn.classList.remove("active-btn");
	    ingredientBtn.classList.remove("active-btn");
	    areaBtn.classList.remove("active-btn");
	    dishBtn.classList.add("active-btn");
		
	    //searchBar.placeholder = "Search Meals";
	    
        });

	
}

// Get category list
function getCateogryList() {
    document.getElementById("result-label").textContent = `Meal Categories`;

    fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if(data.categories) {
                data.categories.forEach(category => {
                    html += `
                        <div class="meal-item" data-id="${category.idCategory}">
                            <div class="meal-img">
                                <img src="${category.strCategoryThumb}" alt="food">
                            </div>
                            <div class="meal-name" data-id="${category.strCategory}">
                                <h3>${category.strCategory}</h3>
                                <a href="#" class="each-category-btn show-btn">Show Recipes</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove("notFound");
            }
            mealList.innerHTML = html;

	    categoryBtn.classList.add("active-btn");
	    ingredientBtn.classList.remove("active-btn");
	    areaBtn.classList.remove("active-btn");
	    dishBtn.classList.remove("active-btn");
        });
}
function getAreaList() {
    document.getElementById("result-label").textContent = `International Cuisines`;

    fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if(data.meals) {
                data.meals.forEach(area => {
                    html += `
                        <div class="meal-item" style="padding-top:1rem;">
                            <div class="area-name" data-id="${area.strArea}">
                                <h3>${area.strArea}</h3>
                                <a href="#" class="each-area-btn show-btn">Show Recipes</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove("notFound");
            }
            mealList.innerHTML = html;

	    categoryBtn.classList.remove("active-btn");
	    ingredientBtn.classList.remove("active-btn");
	    areaBtn.classList.add("active-btn");
	    dishBtn.classList.remove("active-btn");
        });
}

function getIngredientList() {
    document.getElementById("result-label").textContent = `Ingredients List`;

    fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            let link = "";
            if(data.meals) {
                data.meals.forEach(ingredient => {
                    link = "https://www.themealdb.com/images/ingredients/" 
                    +ingredient.strIngredient.split(' ').join('_')
                    +".png";

                    html += `
                        <div class="meal-item">
                            <div class="meal-img">
                                <img src=${link} alt="food">
                            </div>
                            <div class="ingredient-name" data-id="${ingredient.strIngredient}">
                                <h3>${ingredient.strIngredient}</h3>
                                <a href="#" class="each-ingredient-btn show-btn">Show Recipes</a>
                            </div>
                        </div>    
                    `;
                });
                mealList.classList.remove("notFound");
            }
            mealList.innerHTML = html;

	    categoryBtn.classList.remove("active-btn");
	    ingredientBtn.classList.add("active-btn");
	    areaBtn.classList.remove("active-btn");
	    dishBtn.classList.remove("active-btn");
        });
}
function getMealsbyIngredient(e) {

    e.preventDefault();
    if (e.target.classList.contains("each-ingredient-btn")) {
        console.log("Ingredient button clicked");
        let mealItem = e.target.parentElement;
        document.getElementById("result-label").textContent = `Meals with ingredients: ${mealItem.dataset.id}`;

        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => {
            lastMealData = data; // <--- store data
            mealList.innerHTML = createMealHTML(data);

        });
    }
}
function getMealsbyArea(e) {

    e.preventDefault();
    if (e.target.classList.contains("each-area-btn")) {
        console.log("Area button clicked");
        let mealItem = e.target.parentElement;
        document.getElementById("result-label").textContent = `International Cuisine: ${mealItem.dataset.id}`;

        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => {
            lastMealData = data; // <--- store data
            mealList.innerHTML = createMealHTML(data);

        });
    }

}

// Get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains("recipe-btn")) {
        console.log("Recipe button clicked");
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals[0]));
    }
}


//Display all meals in specific category
function getMealsbyCategory(e) {

    e.preventDefault();
    if (e.target.classList.contains("each-category-btn")) {

        console.log("Category button clicked");
        let mealItem = e.target.parentElement;
        document.getElementById("result-label").textContent = `Meals in category: ${mealItem.dataset.id}`;

        console.log(e.target.parentElement);
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => {
            lastMealData = data; // <--- store data
            mealList.innerHTML = createMealHTML(data);

            console.log(html);
        });
    }

}
// Create a modal to show recipe
function mealRecipeModal(meal) {
    console.log(meal);
    //meal = meal[0];
    document.getElementsByClassName("centerDIV")[0].style.display = 'flex';
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients += `<li>${ingredient} - ${measure}</li>`;
        }
    }

    let html = `
      <div class="modal-content-row">
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-details">
            <h2 class="recipe-title">
                    ${meal.strMeal.toUpperCase()}
            </h2>
            <p class="recipe-category">${meal.strCategory}</p>
            <div class="recipe-ingredients">
                <h3 style="padding: 1rem 0;">INGREDIENTS</h3>
                <ul>${ingredients}</ul>
            </div>
            <div class="recipe-instruct">
            	<h3>INSTRUCTIONS</h3>
            	<p class ="recipe-instruct-details">${meal.strInstructions}</p>
            </div>

            

            <div class="recipe-link">
                <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
            </div>
        </div>
      </div>
	      
    `;

    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add("showRecipe");
}

document.getElementById("view-favorites-btn").addEventListener("click", function () {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    mealList.innerHTML = "<p>You haven't added any favorites yet.</p>";
    return;
  }

  let html = "";
  favorites.forEach(meal => {
    html += `
      <div class="meal-item" data-id="${meal.id}">
        <div class="meal-img">
	  <button class="fav-btn favorited" 
              data-id="${meal.id}" 
              data-name="${meal.name}" 
              data-thumb="${meal.thumb}">
              <i class="fa-solid fa-heart"></i>
	  </button>
          <img src="${meal.thumb}" alt="food">
        </div>
        <div class="meal-name">
          <h3>${meal.name}</h3>
          <a href="#" class="recipe-btn">Get Recipe</a>
        </div>
      </div>
    `;
  });

  mealList.innerHTML = html;
  document.getElementById("result-label").textContent = "Your Favorite Meals";
});

function saveToFavorites(id, name, thumb) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex(meal => meal.id === id);

  // Check if it's already in favorites
  if (index === -1) {
    favorites.push({ id, name, thumb });
    showToast(`${name} added to favorites!`);
  } else {
    favorites.splice(index, 1);
    showToast(`${name} removed from favorites.`);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  if (favorites.length === 0) {
    mealList.innerHTML = "<p>You haven't added any favorites yet.</p>";
  }
  const btn = document.querySelector(`.fav-btn[data-id="${id}"]`);
  if (btn) {
    const icon = btn.querySelector("i");
    const isRemoving = icon.classList.contains("fa-solid");

    btn.classList.toggle("favorited");
    icon.classList.toggle("fa-regular");
    icon.classList.toggle("fa-solid");

    if (isRemoving) {
    	icon.classList.add("heart-shrink");
    	setTimeout(() => {
      	   icon.classList.remove("heart-shrink");
	   const currentLabel = document.getElementById("result-label").textContent;

	   if (currentLabel === "Your Favorite Meals") {
  		document.getElementById("view-favorites-btn").click(); // re-render favorites
	   } else if (lastMealData) {
  		mealList.innerHTML = createMealHTML(lastMealData); // re-render last meal list
	   }
    	}, 300);
    } else {
    	icon.classList.add("heart-pop");
    	setTimeout(() => {
     	   icon.classList.remove("heart-pop");
 	   if (lastMealData) {
             mealList.innerHTML = createMealHTML(lastMealData);
    	   }
    	}, 300);
    }


    console.log("Animating icon:", icon);

  }
  
  const currentLabel = document.getElementById("result-label").textContent;
  if (currentLabel === "Your Favorite Meals") {
    document.getElementById("view-favorites-btn").click(); // re-render favorites
  }
}

window.addEventListener("keydown", function (e) {
  console.log("Key pressed:", e.key);

  if (e.key === "Escape") {
    console.log("ESC pressed");
/*
    const overlay = document.querySelector(".centerDIV");
    if (overlay.classList.contains("showRecipe")) {
      overlay.classList.remove("showRecipe");
      overlay.style.display = "none";
    }
*/
    mealDetailsContent.parentElement.classList.remove("showRecipe");
    document.getElementsByClassName("centerDIV")[0].style.display = 'none';
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");

  // Optional: Remember user's preference
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");

    // Save preference
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
});


/***************************/
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

