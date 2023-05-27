// Obtener elementos del DOM
const inventoryForm = document.getElementById('inventory-form');
const inventoryList = document.getElementById('inventory-list');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const changelogList = document.getElementById('changelog-list');
let inventoryItems = [];

// Cargar elementos del inventario y registro de cambios desde el almacenamiento local
if (localStorage.getItem('inventoryItems')) {
  inventoryItems = JSON.parse(localStorage.getItem('inventoryItems'));
  renderInventoryItems();
}

if (localStorage.getItem('changelogItems')) {
  const changelogItems = JSON.parse(localStorage.getItem('changelogItems'));
  renderChangelogItems(changelogItems);
}

// Agregar evento de envío del formulario
inventoryForm.addEventListener('submit', function(e) {
  e.preventDefault();

  // Obtener valores del formulario
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const quantity = document.getElementById('quantity').value;
  const date = document.getElementById('date').value;
  const supplierPrice = document.getElementById('supplier-price').value;
  const wholesalePrice = document.getElementById('wholesale-price').value;
  const retailPrice = document.getElementById('retail-price').value;

  // Crear objeto de inventario
  const inventoryItem = {
    title,
    description,
    quantity,
    date,
    supplierPrice,
    wholesalePrice,
    retailPrice
  };

  // Agregar objeto al array de inventario
  inventoryItems.push(inventoryItem);

  // Guardar elementos del inventario en el almacenamiento local
  localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));

  // Renderizar elementos de inventario
  renderInventoryItems();

  // Limpiar formulario
  inventoryForm.reset();

  // Agregar entrada al registro de cambios
  const changelogItem = `Agregado elemento: ${title}`;
  addChangelogItem(changelogItem);
});

// Agregar evento de búsqueda
searchInput.addEventListener('input', function() {
  const searchTerm = searchInput.value.toLowerCase();

  // Filtrar elementos del inventario
  const filteredItems = inventoryItems.filter(item => {
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();
    return title.includes(searchTerm) || description.includes(searchTerm);
  });

  // Renderizar elementos filtrados
  renderInventoryItems(filteredItems);
});

// Agregar evento de búsqueda y filtrado
searchInput.addEventListener('input', function() {
  const searchTerm = searchInput.value.toLowerCase();
  const sortFilter = document.getElementById('sort-filter').value;

  // Filtrar y ordenar elementos del inventario
  let filteredItems = inventoryItems.filter(item => {
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();
    return title.includes(searchTerm) || description.includes(searchTerm);
  });

  if (sortFilter === 'quantity-asc') {
    filteredItems = filteredItems.sort((a, b) => a.quantity - b.quantity);
  } else if (sortFilter === 'quantity-desc') {
    filteredItems = filteredItems.sort((a, b) => b.quantity - a.quantity);
  } else if (sortFilter === 'date-asc') {
    filteredItems = filteredItems.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortFilter === 'date-desc') {
    filteredItems = filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Renderizar elementos filtrados y ordenados
  renderInventoryItems(filteredItems);
});

// Función para renderizar los elementos de inventario
function renderInventoryItems(items = inventoryItems) {
  // Limpiar lista de inventario
  inventoryList.innerHTML = '';

  // Renderizar cada elemento del inventario
  items.forEach((item, index) => {
    const inventoryItem = createInventoryItemElement(item, index);
    inventoryList.appendChild(inventoryItem);
  });
}

// Función para crear un elemento de inventario
function createInventoryItemElement(item, index) {
  const inventoryItem = document.createElement('div');
  inventoryItem.classList.add('inventory-item');
  inventoryItem.innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.description}</p>
    <p>Cantidad: ${item.quantity}</p>
    <p>Fecha: ${item.date}</p>
    <p>Precio Proveedor: ${item.supplierPrice}</p>
    <p>Precio Mayorista: ${item.wholesalePrice}</p>
    <p>Precio Minorista: ${item.retailPrice}</p>
    <div class="item-actions">
      <button class="edit-button" data-index="${index}">Editar</button>
      <button class="delete-button" data-index="${index}">Eliminar</button>
    </div>
  `;

  // Agregar evento de edición
  const editButton = inventoryItem.querySelector('.edit-button');
  editButton.addEventListener('click', function() {
    editInventoryItem(index);
  });

  // Agregar evento de eliminación
  const deleteButton = inventoryItem.querySelector('.delete-button');
  deleteButton.addEventListener('click', function() {
    deleteInventoryItem(index);
  });

  return inventoryItem;
}

// Función para editar un elemento de inventario
function editInventoryItem(index) {
  const item = inventoryItems[index];

  // Llenar el formulario con los valores existentes
  document.getElementById('title').value = item.title;
  document.getElementById('description').value = item.description;
  document.getElementById('quantity').value = item.quantity;
  document.getElementById('date').value = item.date;
  document.getElementById('supplier-price').value = item.supplierPrice;
  document.getElementById('wholesale-price').value = item.wholesalePrice;
  document.getElementById('retail-price').value = item.retailPrice;

  // Eliminar el elemento del inventario
  deleteInventoryItem(index);
}

// Función para eliminar un elemento de inventario
function deleteInventoryItem(index) {
  const deletedItem = inventoryItems.splice(index, 1)[0];

  // Renderizar elementos de inventario actualizados
  renderInventoryItems();

  // Guardar elementos del inventario en el almacenamiento local
  localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));

  // Agregar entrada al registro de cambios
  const changelogItem = `Eliminado elemento: ${deletedItem.title}`;
  addChangelogItem(changelogItem);
}

// Función para agregar una entrada al registro de cambios
function addChangelogItem(changelogItem) {
  changelogList.innerHTML += `<li>${changelogItem}</li>`;

  // Obtener y guardar elementos del registro de cambios en el almacenamiento local
  const changelogItems = Array.from(changelogList.getElementsByTagName('li')).map(li => li.textContent);
  localStorage.setItem('changelogItems', JSON.stringify(changelogItems));
}

// Renderizar elementos del registro de cambios desde el almacenamiento local
function renderChangelogItems(changelogItems) {
  changelogItems.forEach(item => {
    changelogList.innerHTML += `<li>${item}</li>`;
  });
}

// Alternar entre modo claro y oscuro
themeToggle.addEventListener('change', function() {
  document.body.classList.toggle('dark-mode');
});

// Obtener el modo actual al cargar la página
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.checked = true;
}

// Almacenar el modo seleccionado
themeToggle.addEventListener('change', function() {
  if (themeToggle.checked) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Obtén una referencia al botón de eliminar
const deleteChangelogBtn = document.getElementById('delete-changelog-btn');

// Agrega un evento de clic al botón de eliminar
deleteChangelogBtn.addEventListener('click', function() {
  // Elimina el listado del registro de cambios
  const changelogList = document.getElementById('changelog-list');
  changelogList.innerHTML = '';

  // Elimina los datos del listado de registro de cambios del almacenamiento local
  localStorage.removeItem('changelogItems');
});
