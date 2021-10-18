const screenRes = {
  isMobile: window.matchMedia("screen and (max-width: 700px)").matches,
  isTablet: window.matchMedia("screen and (max-width: 1000px)").matches,
  isDesktop: window.matchMedia("screen and (min-width: 1001px)").matches,
};

const shopByLookCustomizer = document.querySelector(".shop_by_look_customizer");
if (shopByLookCustomizer) {
  console.log("init shop by look");

  const imagePreview = document.querySelector(".sbl__preview img");
  imagePreview.src = getPreviewImage();

  const sblContentMain = document.querySelector(".sbl__content--main");
  const products = getProducts();

  if (!products) {
    const productList = sblContentMain.querySelector(".sbl__products");
    productList.innerHTML =
      "<p class='sbl__products--empty'>No hay productos seteados</p>";
  } else {
    products.forEach((product) => {
      createProductList(product);
    });

    sblContentMain.querySelector(
      ".sbl__content--actions"
    ).innerHTML += `<button class="sbl__content--copy" onclick="copyProducts(this);">Copiar productos</button>`;
  }
}

function resetForm() {
  const form = document.querySelector("#sbl__content--form");
  form.reset();
}

function getProducts() {
  // Get all products from localStorage - shopByLookCustomizer -
  // if exists returns an array
  // else returns false
  const localStorageKey = "shopByLookCustomizer";
  const productsInLocalStorage = localStorage.getItem(localStorageKey);

  if (productsInLocalStorage === null || productsInLocalStorage.length === 0) {
    return false;
  }

  return JSON.parse(productsInLocalStorage);
}

function getPreviewImage() {
  const localStorageKey = "shopByLookCustomizerImage";
  const imageInLocalStorage = localStorage.getItem(localStorageKey);

  if (imageInLocalStorage === null || imageInLocalStorage.length === 0) {
    return "https://statics.glamit.com.ar/media/catalog/product/1/0/10974_carocuore_476702_02_1.jpg";
  }

  return imageInLocalStorage;
}

function findProduct(pid) {
  const localStorageKey = "shopByLookCustomizer";

  const products = getProducts();
  const product = products.find((product) => product.id === pid);

  if (!product) return false;

  return product;
}

function saveProduct(event) {
  event.preventDefault();

  const localStorageKey = "shopByLookCustomizer";

  // Get the custom data
  const productCreatePanel = document.querySelector(".sbl__content--create");

  const productData = {};
  const productInputs = productCreatePanel.querySelectorAll("input");

  productInputs.forEach((input) => {
    switch (input.id) {
      case "sbl__product--id":
        productData.id = input.value;
        break;

      case "sbl__product--name":
        productData.name = input.value;
        break;

      case "sbl__product--price":
        productData.price = input.value;
        break;

      case "sbl__product--link":
        productData.link = input.value;
        break;

      case "sbl__product--top":
        productData.top = input.value;
        break;

      case "sbl__product--left":
        productData.left = input.value;
        break;

      case "sbl__product--background":
        productData.background = input.value;
        break;

      case "sbl__product--textcolor":
        productData.color = input.value;
        break;
    }
  });

  // Store data in localStorage
  const productsStored = getProducts();

  if (!productsStored) {
    localStorage.setItem(localStorageKey, JSON.stringify([productData]));

    location.reload();
    return;
  }

  // Update one
  const hasProductUpdate = productsStored.find(
    (product) => product.id === productData.id
  );

  if (hasProductUpdate) {
    const productsUpdated = productsStored.map((product) => {
      if (product.id === productData.id) {
        product = productData;
      }

      return product;
    });

    localStorage.setItem(localStorageKey, JSON.stringify(productsUpdated));

    location.reload();
    return;
  }

  productsStored.push(productData);
  localStorage.setItem(localStorageKey, JSON.stringify(productsStored));

  location.reload();
}

function createProduct() {
  console.log("create");

  resetForm();

  const productID = Date.now();
  createDot(productID);

  const productCreatePanel = document.querySelector(".sbl__content--create");
  productCreatePanel.classList.add("sbl__content--create--open");

  const cancelBtn = productCreatePanel.querySelector(".actions--cancel");

  cancelBtn.addEventListener("click", () => {
    document.querySelector(`#product--${productID}`).remove();
    closeCreateProduct();
  });

  const productDot = document.querySelector(`#product--${productID}`);

  const productDataUnformated = productCreatePanel.querySelectorAll("input");
  productDataUnformated.forEach((data) => {
    data.id === "sbl__product--id" && (data.value = productID);

    data.addEventListener("keyup", () => updateDot(data, productDot));
  });
}

function deleteProduct(idProduct) {
  const confirmacion = confirm("Estas seguro que queres borrar este producto?");
  if (!confirmacion) return;

  const localStorageKey = "shopByLookCustomizer";

  const products = getProducts();
  const updatedProducts = products.filter(
    (product) => product.id !== idProduct
  );

  localStorage.setItem(localStorageKey, JSON.stringify(updatedProducts));
  closeCreateProduct();
}

function closeCreateProduct() {
  const productCreatePanel = document.querySelector(".sbl__content--create");
  productCreatePanel.classList.remove("sbl__content--create--open");

  resetForm();
  location.reload();
}

function createDot(dotID, ...dotData) {
  const preview = document.querySelector(".sbl__preview");
  const previewArea = preview.querySelector(".sbl__preview--area");

  const hasData = dotData.length > 0;
  const {
    id,
    name = "Producto nuevo",
    price = "2500",
    link = "#producto-nuevo",
    top,
    left,
    background,
    color,
  } = dotData[0] !== undefined ? dotData[0] : "";

  const stylesBtn = hasData
    ? `style="top: ${top}; left: ${left}; background: ${background}"`
    : "";
  const stylesParagraph = hasData ? `style="color: ${color}"` : "";

  previewArea.innerHTML += `
        <button id="product--${dotID}" class="product__btn" ${stylesBtn} data-link="${link}" onmouseenter="handleButtonOpen(this)" onmouseleave="handleButtonOpen(this)">
            <p ${stylesParagraph}>
                <span>${name}</span>
                <strong> ${price} </strong>
            </p>
        </button>
    `;
}

function updateDot(data, target) {
  const dataTarget = data.id;

  const productName = target.querySelector("span");
  const productPrice = target.querySelector("strong");

  switch (dataTarget) {
    case "sbl__product--name":
      productName.innerHTML = data.value;
      break;

    case "sbl__product--price":
      productPrice.innerHTML = data.value;
      break;

    case "sbl__product--link":
      target.dataset.link = data.value;
      break;

    case "sbl__product--top":
      target.style.top = data.value;
      break;

    case "sbl__product--left":
      target.style.left = data.value;
      break;

    case "sbl__product--background":
      target.style.background = data.value;
      break;

    case "sbl__product--textcolor":
      target.querySelector("p").style.color = data.value;
      break;
  }
}

function handleButtonOpen(button) {
  button.classList.toggle("open");

  const isButtonOpen = button.classList.contains("open");

  if (isButtonOpen) {
    button.addEventListener(
      "click",
      () => (window.location.href = button.dataset.link)
    );
    return;
  }
}

function createProductList(productData) {
  const { id, name } = productData;

  const listContainer = document.querySelector(".sbl__products--main");
  createDot(id, productData);

  listContainer.innerHTML += `
        <div class="sbl__listItem">
            <h4>${name}</h4>
            <div class="actions">
                <button data-productId="${id}" class="actions--edit" title="Editar producto" onclick="editProduct(this);">
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L9 9L1 17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button data-productId="${id}" class="actions--delete" title="Borrar producto" onclick="deleteProduct('${id}');">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L9 9L1 17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 1L9 9L17 17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

function editProduct(el) {
  const pid = el.dataset.productid;

  const product = findProduct(pid);
  const { id, name, price, link, top, left, background, color } = product;

  const productDot = document.querySelector(`#product--${id}`);

  const productCreatePanel = document.querySelector(".sbl__content--create");

  const deleteButton = productCreatePanel.querySelector(".actions--delete");
  const cancelButton = productCreatePanel.querySelector(".actions--cancel");

  deleteButton.addEventListener("click", () => deleteProduct(pid));

  cancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    closeCreateProduct();
  });

  productCreatePanel.classList.add("sbl__content--create--open");

  const productDataUnformated = productCreatePanel.querySelectorAll("input");
  productDataUnformated.forEach((data) => {
    switch (data.id) {
      case "sbl__product--id":
        data.value = id;
        break;

      case "sbl__product--name":
        data.value = name;
        break;

      case "sbl__product--price":
        data.value = price;
        break;

      case "sbl__product--link":
        data.value = link;
        break;

      case "sbl__product--top":
        data.value = top;
        break;

      case "sbl__product--left":
        data.value = left;
        break;

      case "sbl__product--background":
        data.value = background;
        break;

      case "sbl__product--textcolor":
        data.value = color;
        break;
    }

    data.addEventListener("keyup", () => updateDot(data, productDot));
  });
}

function copyProducts(el) {
  const localStorageKey = "shopByLookCustomizer";
  const productsInLocalStorage = localStorage.getItem(localStorageKey);

  if (productsInLocalStorage === null || productsInLocalStorage.length === 0) {
    return false;
  }

  const tmpInput = document.createElement("input");
  tmpInput.value = productsInLocalStorage;

  tmpInput.select();
  tmpInput.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(tmpInput.value);

  el.innerText = "Productos copiados!";
  el.style.opacity = ".5";
  el.style.pointerEvents = "none";

  setTimeout(() => {
    el.innerText = "Copiar productos";
    el.style.opacity = "1";
    el.style.pointerEvents = "all";
  }, 1500);
}

function resetAll() {
  const confirmacion = confirm("Estas seguro que queres borrar todo?");
  if (!confirmacion) return;

  const localStorageKey = "shopByLookCustomizer";
  localStorage.clear(localStorageKey);
  closeCreateProduct();
}

function loadProducts() {
  const importedProducts = prompt(
    "Pega acá el texto alternativo de magento \nEsta accion reemplazará los productos existentes"
  );
  if (!importedProducts) {
    alert("No se pudo cargar productos, intentalo nuevamente");
    return;
  }

  const localStorageKey = "shopByLookCustomizer";
  localStorage.setItem(localStorageKey, importedProducts);

  location.reload();
}

// Subida de imagen
function handleEvent(obj, evt, handler) {
  if (obj.addEventListener) {
    obj.addEventListener(evt, handler, false);
  } else if (obj.attachEvent) {
    obj.attachEvent("on" + evt, handler);
  } else {
    obj["on" + evt] = handler;
  }
}

if (window.FileReader) {
  var drop;

  handleEvent(window, "load", () => {
    const localStorageImageKey = "shopByLookCustomizerImage";
    const status = document.querySelector(".sbl__uploadfile--status");
    drop = document.querySelector("#drop");
    const list = document.querySelector(".sbl__preview");

    // add event drop to target
    handleEvent(drop, "dragover", cancelEvent);
    handleEvent(drop, "dragenter", cancelEvent);

    handleEvent(drop, "drop", (e) => {
      e = e || window.event;
      if (e.preventDefault) {
        e.preventDefault(); // stop browser redirect to img path
      }

      const dataTransfer = e.dataTransfer;
      const files = dataTransfer.files;

      for (let i = 0; i < files.length; i++) {
        if (i > 0) return;

        const file = files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        handleEvent(
          reader,
          "loadend",
          function (e, file) {
            const bin = this.result;

            const img = document.createElement("img");
            img.file = file;
            img.src = bin;

            status.innerHTML = `Subiste: 1 archivo: ${file.name} - ${file.size}b`;

            list.querySelector("img").remove();
            list.appendChild(img);
            localStorage.setItem(localStorageImageKey, bin);
          }.bindHandleEvent(file)
        );
      }
      return false;
    });

    Function.prototype.bindHandleEvent = function bindHandleEvent() {
      var handler = this;
      var boundParameters = Array.prototype.slice.call(arguments);

      // Creo el closure
      return function (e) {
        e = e || window.event;
        boundParameters.unshift(e);
        handler.apply(this, boundParameters);
      };
    };

    function cancelEvent(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      return false;
    }
  });
} else {
  document.querySelector(".sbl__uploadfile--status").innerHTML =
    "El navegador no acepta FileReader";
}
