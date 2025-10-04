let item = [];
let i = 0;

function addToInventory() 
{    
    if (document.getElementById("item").value === "" || document.getElementById("itemCode").value === "" || document.getElementById("quantity").value === "")
    {
        alert("Please fill in all fields.");
        return;
    }
    item[i] =  
    {
        name: document.getElementById("item").value,
        code: document.getElementById("itemCode").value,
        quantity: document.getElementById("quantity").value
    };
    i++;
    console.log(item[i-1]);
    displayInventory();
}

function filter()
{
    if (!document.getElementById("searchTerm")) //prevents creation of additional filter inputs
    {
        let searchTerm = document.createElement("input");
        searchTerm.id = "searchTerm";
        searchTerm.type = "text";
        searchTerm.placeholder = "Enter item name to filter";
        document.body.appendChild(searchTerm);
    }
    else
    {
        document.getElementById("searchTerm").remove();
    }
}

function deleteItem()
{

    let dropdown = document.createElement("select");
    if (!document.getElementById("itemDropdown") && item.length > 0) //prevents creation of additional dropdowns and doesnt create a dropdown if there are no items
    {
        
        dropdown.id = "itemDropdown";
        item.forEach((item) => {
        let option = document.createElement("option");
        option.value = item.name;
        option.text = item.name;
        dropdown.append(option);
        document.body.appendChild(dropdown);
    });
    }
    else
    {
        document.getElementById("itemDropdown").remove();
    }
    
    if (!document.getElementById("deleteButton") && item.length > 0) //prevents creation of additional delete buttons and doesnt create a delete button if there are no items
    {
        let deleteButton = document.createElement("button");
        deleteButton.id = "deleteButton";
        deleteButton.textContent = "Delete Selected Item";
        deleteButton.onclick = function() {
        let selectedItem = dropdown.value;
        item = item.filter((item) => item.name !== selectedItem);
        document.body.removeChild(dropdown);
        document.body.removeChild(deleteButton);
        displayInventory();
        }
        document.body.appendChild(deleteButton);
    }
    else
    {
        document.getElementById("deleteButton").remove();
    }


}

function sortBy()
{

}

function reset()
{

}

function displayInventory()    
{
    let inventoryDiv = document.getElementById("list");
    inventoryDiv.innerHTML = ""; // clear previous content

    if (item.length === 0) {
        inventoryDiv.innerHTML = "<p>No items in inventory.</p>";
        return;
    }

    let html = "<ul>";
    item.forEach((item) => {
        html += `<li>${item.name} - ${item.code} - Quantity: ${item.quantity}</li>`;
    });
    html += "</ul>";

    inventoryDiv.innerHTML = html;
}