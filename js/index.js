let session = sessionStorage.getItem("user");
let body;
let signInTemplate;
let quantityAdderTemplate;
let checkOutTmplate;
let productGrid;
let signInBtn;
let signOutBtn;
let userDisplay;

let user;

let itemsToCheckOut = [];
let itemsToCheckOutGrid;

window.addEventListener('DOMContentLoaded', (event) => {

    body = document.body;
    productGrid = document.querySelector('#productsGrid');
    itemsToCheckOutGrid = document.querySelector('#itemsToCheckout');
    checkOutTmplate = document.querySelector('#checkOut');
    signInBtn = document.querySelector('#signInBtn');
    userDisplay = document.querySelector('#userDisplay');
    signOutBtn = document.querySelector('#signOutBtn');

    setUser();

    signOutBtn.addEventListener('click', evt => {
        evt.preventDefault();
        sessionStorage.clear();
        session = null;
        setUser();
    });

    signOutBtn.addEventListener('click', evt => {
        evt.preventDefault();
        signIn();
    });

    document.querySelector('#filterValueInput').addEventListener('keyup', evt => {
        const inputField = evt.target;
        const filterValue = inputField.value;
        const filterBy = document.querySelector('#by').value;

        updateProductGrid({ by: filterBy, value: filterValue });
    });

    document.querySelector('#checkOutBtn').addEventListener('click', evt=>{
        openCheckout();
    });

});

function signIn() {

    if (document.querySelector('#signInForm')) {
        return;
    }

    signInTemplate = document.querySelector('#signin').content.cloneNode(true);
    body.insertBefore(signInTemplate, body.firstChild);
    
    document.querySelector('#signInForm').addEventListener('submit', async evt => {
        evt.preventDefault();
        const form = evt.target;
        const signInData = new FormData(form);
        const user = await authenticate(signInData.get('username'), signInData.get('password'));
        if (!user) {
            alert("user does not exist");
            return;
        }
        else {
            session = JSON.stringify(user);
            sessionStorage.setItem("user", session);
            setUser();
        }
    });
}

function setUser() {

    if (session == null) {
        signOutBtn.style.display = "none";
        signInBtn.style.display = "inline";
        userDisplay.style.display = "none";
        signIn();
    }
    else {
        signOutBtn.style.display = "inline";
        signInBtn.style.display = "none";
        userDisplay.style.display = "inline";

        if (document.getElementById('signInForm')) {
            document.getElementById('signInForm').remove();
        }

        const userData = JSON.parse(session);
        user = new User(userData.name, userData.username);
        userDisplay.innerHTML = user.name;
    }

    updateProductGrid();

}

function calculateTotal() {
    return itemsToCheckOut.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateProductGrid(filter = { by: "name", value: "" }) {

    productGrid.innerHTML = '';

    if (session == null) {
        return;
    }

    productGrid.innerHTML = '<tr><td colspan="5">Searching...</td></tr>';
    products().then(products => {
        const filteredProducts = products.filter(product => {
            const nameSubStr = product[filter.by].toString().toLowerCase().substring(0, filter.value.length);
            return nameSubStr == filter.value.toLowerCase();
        });

        productGrid.innerHTML = filteredProducts.map((product, index) => `<tr cellspacing="0">
                <td>${product.name}</td>
                <td>${product.code}</td>
                <td>${product.qty}</td>
                <td>${product.price}</td>
                <td><button type="button" class="post-btn selectBtn" data-productIndex="${index}">Select</button></td>
            </tr>`)
            .join('');

        productGrid.querySelectorAll('.selectBtn').forEach(btn => {
            btn.addEventListener('click', evt => {
                const clickButton = evt.target;
                const product = filteredProducts[parseInt(clickButton.dataset.productindex)];
                addItemToCheckoutBusket(product);
            });
        });
    });
}

function updateItemsToCheckoutGrid() {
    itemsToCheckOutGrid.querySelector('tbody').innerHTML = itemsToCheckOut.map((item, index) => `<tr cellspacing="0">
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
        <td><button type="button" class="post-btn selectBtn" data-productIndex="${index}">&times;</button></td>
    </tr>`).join('');

    itemsToCheckOutGrid.querySelectorAll('tbody button').forEach(btn => {
        btn.addEventListener('click', evt => {
            const clickedButton = evt.target;
            const clickedButtonData = clickedButton.dataset;
            removeItemToCheckout(parseInt(clickedButtonData.productIndex));
        })
    });

    document.querySelector('.total').innerHTML = calculateTotal().toFixed(2);
}

async function addItemToCheckoutBusket(product) {
    const qty = await askQuantity();
    const existingIndex = itemsToCheckOut.findIndex(item => item.name == product.name);
    if (existingIndex > -1) {
        itemsToCheckOut[existingIndex].quantity += qty;
    }
    else {
        itemsToCheckOut.push({
            ...product,
            quantity: qty
        });
    }
    updateItemsToCheckoutGrid();
}

function removeItemToCheckout(index) {
    itemsToCheckOut.splice(index, 1);
    updateItemsToCheckoutGrid();
}

async function askQuantity() {
    if (document.querySelector('#quantityAdder')) {
        return;
    }
    quantityAdderTemplate = document.querySelector('#quantityAdderTmpl').content.cloneNode(true);
    body.insertBefore(quantityAdderTemplate, body.firstChild);
    
    document.querySelector('#quantityAdder .pos-close').addEventListener('click', evt=>{
        const clicked = evt.target;
        clicked.closest('.pos-modal').remove();
    })
    return await new Promise(rs => {
        document.querySelector('#quantityAdder button#ok').addEventListener('click', evt => {
            const qty = document.querySelector('#quantityAdder input').value;
            rs(qty);
            document.querySelector('#quantityAdder').remove()
        });
    });
}

function openCheckout(){
    if (document.querySelector('#checkOutForm')) {
        return;
    }
    quantityAdderTemplate = document.querySelector('#checkOut').content.cloneNode(true);
    body.insertBefore(quantityAdderTemplate, body.firstChild);

    document.querySelector('.total').innerHTML = calculateTotal().toFixed(2);

    document.querySelector('#checkOutForm .pos-close').addEventListener('click', evt=>{
        const clicked = evt.target;
        clicked.closest('.pos-modal').remove();
    })

    document.querySelector('#checkOutForm #amount').addEventListener('keyup', evt=>{
        const amount = evt.target.value;
        document.querySelector('#checkOutForm .change').innerHTML = (parseInt(amount) - calculateTotal()).toFixed(2);
    });

    document.querySelector('#checkOutForm .pos-close').addEventListener('change', evt=>{
        const amount = evt.target.value;
        document.querySelector('#checkOutForm .change').innerHTML = (parseInt(amount) - calculateTotal()).toFixed(2);
    });

    document.querySelector('#checkOutForm').addEventListener('submit', evt=>{
        evt.preventDefault();
        itemsToCheckOut = [];
        updateItemsToCheckoutGrid();
        document.querySelector('#checkOutForm').remove();
    });
}