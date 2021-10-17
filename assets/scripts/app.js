const screenRes = {
    isMobile: window.matchMedia("screen and (max-width: 700px)").matches,
    isTablet: window.matchMedia("screen and (max-width: 1000px)").matches,
    isDesktop: window.matchMedia("screen and (min-width: 1001px)").matches,
};

const shopByLookCustomizer = document.querySelector(".shop_by_look_customizer");
if (shopByLookCustomizer) {
    console.log("init");

    const sblContentMain = document.querySelector(".sbl__content--main");

    const products = getProducts();

    if (!products) {
        const productList = sblContentMain.querySelector(".sbl__products");
        productList.innerHTML =
            "<p class='sbl__products--empty'>No hay productos seteados</p>";
    } else {
        products.forEach((product) => {
            createProductList(product.id, product.name);
        });
    }
}

function getProducts() {
    // Get all products from localStorage - shopByLookCustomizer -
    // if exists returns an array
    // else returns false
    const localStorageKey = "shopByLookCustomizer";
    const productsInLocalStorage = localStorage.getItem(localStorageKey);

    if (
        productsInLocalStorage === null ||
        productsInLocalStorage.length === 0
    ) {
        return false;
    }

    return JSON.parse(productsInLocalStorage);
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

        reRenderProductList();
        closeCreateProduct();
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

        reRenderProductList();
        closeCreateProduct();
        return;
    }

    productsStored.push(productData);
    localStorage.setItem(localStorageKey, JSON.stringify(productsStored));

    reRenderProductList();
    closeCreateProduct();

    function reRenderProductList() {
        const listContainer = document.querySelector(".sbl__products--main");
        listContainer.innerHTML = "";

        productsStored.forEach((product) => {
            createProductList(product.id, product.name);
        });
    }
}

function createProduct() {
    console.log("create");

    const productID = Date.now();
    createDot(productID);

    const productCreatePanel = document.querySelector(".sbl__content--create");
    productCreatePanel.classList.add("sbl__content--create--open");

    const productDot = document.querySelector(`#product--${productID}`);

    if (!screenRes.isDesktop) {
    } else {
        productDot.addEventListener("mouseenter", () =>
            handleButtonOpen(productDot)
        );
        productDot.addEventListener("mouseleave", () =>
            handleButtonOpen(productDot)
        );
    }

    const productDataUnformated = productCreatePanel.querySelectorAll("input");
    productDataUnformated.forEach((data) => {
        data.id === "sbl__product--id" && (data.value = productID);

        data.addEventListener("keyup", () => updateDot(data, productDot));
    });
}

function deleteProduct(el) {
    console.log("delete");
    console.log(el);
}

function closeCreateProduct() {
    const productCreatePanel = document.querySelector(".sbl__content--create");
    productCreatePanel.classList.remove("sbl__content--create--open");

    const form = document.querySelector("#sbl__content--form");
    form.reset();
}

function createDot(dotID) {
    const preview = document.querySelector(".sbl__preview");
    const previewArea = preview.querySelector(".sbl__preview--area");

    previewArea.innerHTML += `
        <button id="product--${dotID}" class="product__btn">
            <p>
                <span>Colaless</span>
                <strong> $2.500 </strong>
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

function createProductList(PID, name) {
    const listContainer = document.querySelector(".sbl__products--main");

    listContainer.innerHTML += `
        <div class="sbl__listItem">
            <h4>${name}</h4>
            <div class="actions">
                <button data-productId="${PID}" class="actions--edit" title="Editar producto">
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L9 9L1 17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button data-productId="${PID}" class="actions--delete" title="Borrar producto">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L9 9L1 17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 1L9 9L17 17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}
