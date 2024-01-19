document.addEventListener("DOMContentLoaded", function () {
  const veganCheckbox = document.getElementById("veganCheckbox");
  const celiacCheckbox = document.getElementById("celiacCheckbox");
  const lactoseIntolerantCheckbox = document.getElementById("lactoseIntolerantCheckbox");
  const categoryDropdown = document.getElementById("categoria");
  const orderDropdown = document.getElementById("orden");
  const menuContainer = document.getElementById("menu");

  // Obtener los filtros almacenados en localStorage
  const storedFilters = JSON.parse(localStorage.getItem("filters")) || {};

  // Restablecer los valores de los filtros desde localStorage
  veganCheckbox.checked = storedFilters.vegan || false;
  celiacCheckbox.checked = storedFilters.celiac || false;
  lactoseIntolerantCheckbox.checked = storedFilters.lactoseIntolerant || false;
  categoryDropdown.value = storedFilters.category || "all";
  orderDropdown.value = storedFilters.order || "asc";

  // Simulación de datos con un archivo JSON
  const apiUrl = "https://raw.githubusercontent.com/Ikergotelin13/Archivo-JSON/main/Comida.json";

  // Función para obtener los datos de la API
  async function getMenuData() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  }

  // Función para renderizar la carta en la página
  async function renderMenu() {
    const menuData = await getMenuData();
    menuContainer.innerHTML = "";

    const filteredData = menuData.filter((item) => {
      const isVegan = !veganCheckbox.checked || (veganCheckbox.checked && item.vegan);
      const isCeliac = !celiacCheckbox.checked || (celiacCheckbox.checked && item.celiac);
      const isLactoseIntolerant = !lactoseIntolerantCheckbox.checked || (lactoseIntolerantCheckbox.checked && item.lactoseIntolerant);
      const selectedCategory = categoryDropdown.value;
      const isCategoryMatch = selectedCategory === "all" || item.category === selectedCategory;

      return isVegan && isCeliac && isLactoseIntolerant && isCategoryMatch;
    });

    const sortedData = filteredData.sort((a, b) => {
      return orderDropdown.value === "asc" ? a.price - b.price : b.price - a.price;
    });

    sortedData.forEach((item) => {
      const card = createCard(item);
      menuContainer.appendChild(card);
    });
  }

  // Función para crear una tarjeta de plato
  function createCard(item) {
    const card = document.createElement("div");
    card.classList.add("card");

    const image = document.createElement("img");
    image.src = item.photo;
    image.alt = item.name;

    const name = document.createElement("h3");
    name.textContent = item.name;

    const ingredients = document.createElement("p");
    ingredients.textContent = `Ingredientes: ${item.ingredients.join(", ")}`;

    const price = document.createElement("p");
    price.textContent = `Precio: ${item.price} €`;

    const addToFavoritesButton = document.createElement("button");
    addToFavoritesButton.textContent = "Añadir a Favoritos";
    addToFavoritesButton.addEventListener("click", () => addToFavorites(item));

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(ingredients);
    card.appendChild(price);
    card.appendChild(addToFavoritesButton);

    return card;
  }

  function addToFavorites(item) {
    // Obtener la lista de favoritos almacenada en localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Verificar si el plato ya está en la lista de favoritos
    const isAlreadyFavorite = favorites.some((favorite) => favorite.name === item.name);

    if (!isAlreadyFavorite) {
      // Añadir el plato a la lista de favoritos
      favorites.push(item);

      // Actualizar la lista de favoritos en localStorage
      localStorage.setItem("favorites", JSON.stringify(favorites));

      console.log(`Añadido a favoritos: ${item.name}`);
    } else {
      // Quitar el plato de la lista de favoritos
      const updatedFavorites = favorites.filter((favorite) => favorite.name !== item.name);

      // Actualizar la lista de favoritos en localStorage
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      console.log(`Eliminado de favoritos: ${item.name}`);
    }
  }

  // Event listeners para los checkboxes y el menú desplegable
  veganCheckbox.addEventListener("change", handleFilterChange);
  celiacCheckbox.addEventListener("change", handleFilterChange);
  lactoseIntolerantCheckbox.addEventListener("change", handleFilterChange);
  categoryDropdown.addEventListener("change", handleFilterChange);
  orderDropdown.addEventListener("change", handleFilterChange);

  // Inicializar la página renderizando la carta
  renderMenu();

  // Función para manejar los cambios en los filtros
  function handleFilterChange() {
    // Almacenar los filtros en localStorage
    const filters = {
      vegan: veganCheckbox.checked,
      celiac: celiacCheckbox.checked,
      lactoseIntolerant: lactoseIntolerantCheckbox.checked,
      category: categoryDropdown.value,
      order: orderDropdown.value,
    };
    localStorage.setItem("filters", JSON.stringify(filters));

    // Renderizar la carta con los nuevos filtros
    renderMenu();
  }
});
