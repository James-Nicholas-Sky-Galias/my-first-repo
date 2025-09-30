let item = [];
let i = 0;

function addToInventory() 
{    
    item[i] =  
    {
        name: document.getElementById("item").value,
        code: document.getElementById("itemCode").value,
        quantity: document.getElementById("quantity").value
    };
    i++;
    console.log(item[i-1]);
}

function updateItem()
{

}

function filter()
{

}

function deleteItem()
{

}

function sortBy()
{

}

function reset()
{

}

function displayInventory() {
    let inventoryDiv = document.getElementById("list");
    inventoryDiv.innerHTML = ""; // clear previous content

    if (item.length === 0) {
        inventoryDiv.innerHTML = "<p>No items in inventory.</p>";
        return;
    }

    let html = "<ul>";
    item.forEach((entry, index) => {
        html += `<li>${index + 1}. ${entry.name} - ${entry.code} - Quantity: ${entry.quantity}</li>`;
    });
    html += "</ul>";

    inventoryDiv.innerHTML = html;
}