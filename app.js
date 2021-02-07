const itemList = document.querySelector('#listData');
const itemSubmit = document.querySelector('#itemInfo');
const addItemButton = document.querySelector('.addItem');

// // counts total amount & items
let totalCount = 0;
let totalAmt = 0;

class Item {
    constructor(name, cost, date) {
        this.name = name;
        this.cost = cost;
        this.date = date;
    }
};

class UI {
    static displayItems() {
        const items = store.getItemfromStorage();
        items.forEach((item) => UI.addItemInfo(item));

        UI.displayTotal();
    }

    static addItemInfo(item) {
        const newElement = document.createElement('tr');
        newElement.innerHTML =
            `
        <td>${item.name}</td>
        <td>${item.cost}</td>
        <td>${item.date}</td>
        <td><button type="button" class="btn btn-sm btn-danger delete">X</button></td> </td>
        `;

        totalCount++;
        totalAmt += parseInt(item.cost);
        itemList.appendChild(newElement);
        UI.displayTotal();
    }

    static removeItem(item) {
        item.parentElement.parentElement.remove();

        const cost = parseInt(item.parentElement.previousElementSibling.previousElementSibling.textContent);
        totalCount--;
        totalAmt -= cost;
        UI.displayTotal();
    }

    static clearFields() {
        document.querySelector('#item').value = "";
        document.querySelector('#amount').value = "";
        document.querySelector('#purchaseDate').value = "";
    }

    static displayTotal() {
        const totalItems = document.querySelector('#totalItems');
        const totalPrice = document.querySelector('#totalCost');

        totalItems.innerHTML = `<b>${totalCount}</b>`;
        totalPrice.innerHTML = `<b>${totalAmt}</b>`;
    }
};

class store {
    static getItemfromStorage() {
        let items;
        if (localStorage.getItem('items') === null) {
            items = [];
        } else {
            items = JSON.parse(localStorage.getItem('items'));
        }

        return items;
    }

    static addItemToStorage(item) {
        let items = store.getItemfromStorage();
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
    }

    static deleteItemFromStorage(item) {
        let items = store.getItemfromStorage();
        items.forEach((ele, index) => {
            if (item.name === ele.name && item.cost === ele.cost && item.date === ele.date) {
                items.splice(index, 1);
            }
        });

        localStorage.setItem('items', JSON.stringify(items));
    }
};

document.addEventListener('DOMContentLoaded', UI.displayItems());

addItemButton.addEventListener('click', (e) => {
    // e.preventDefault();
    const item = document.querySelector('#item');
    const amount = document.querySelector('#amount');
    const purchaseDate = document.querySelector('#purchaseDate');

    if (item.value === "" || amount.value === "" || purchaseDate.value === "") {
        alert("Fill all values !");
    } else {
        const newItem = new Item(item.value, amount.value, purchaseDate.value);
        UI.addItemInfo(newItem);
        store.addItemToStorage(newItem);
        UI.clearFields();
    }
});

itemList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        UI.removeItem(e.target);

        const date = e.target.parentElement.previousElementSibling.textContent;
        const amount = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
        const itemName = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        const delItem = new Item(itemName, amount, date);
        store.deleteItemFromStorage(delItem);
    }
});

console.log(totalAmt, totalCount);