let item = [];
let i = 0;
const lowStockThreshold = 10; //arbitrary threshold for low stock
let controlsDiv = document.getElementById("controls");

function sort(sortField, ascending = true)
{
    item.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            // Sort alphabetically
            if (typeof valA === "string" && typeof valB === "string") {
                if (ascending) { return valA.localeCompare(valB); }
                else { return valB.localeCompare(valA); }
            }

            // Sort numerically
            if (typeof valA === "number" && typeof valB === "number") {
                if (ascending) { return valA - valB; }
                else { return valB - valA; }
            }

            // Hybrid string/number
            valA = String(valA);
            valB = String(valB);
            if (ascending) { return valA.localeCompare(valB); }
            else { return valB.localeCompare(valA); }
        });
        displayInventory(item);
}

function addToInventory() {
    if (document.getElementById("item").value === "" || 
        document.getElementById("itemCode").value === "" || 
        document.getElementById("quantity").value === "") 
    {
        alert("Please fill in all fields.");
        return;
    }

    item[i] = {
        name: document.getElementById("item").value,
        code: document.getElementById("itemCode").value,
        quantity: document.getElementById("quantity").value,
        category: document.getElementById("category").value,
    };
    i++;
    console.log(item[i-1]);
    displayInventory(item);
}

function filter() {
    let uniqueField = document.getElementById("uniqueField");
    let searchButton = document.getElementById("searchButton");

    let filterBy = document.getElementById("filterBy");

    if (!uniqueField || !searchButton || !filterBy) {
        // Prevents creation of additional search inputs
        uniqueField = document.createElement("input");
        uniqueField.id = "uniqueField";
        uniqueField.type = "text";
        uniqueField.placeholder = "Enter unique field to update (case-sensitive)";

        searchButton = document.createElement("button");
        searchButton.id = "searchButton";
        searchButton.textContent = "Find Record";

        filterBy = document.createElement("select");
        filterBy.id = "filterBy";
        
        let categories = new Set();
        let lowStockOption = document.createElement("option");
        lowStockOption.value = "lowStock";
        lowStockOption.text = "Low Stock Items";
        filterBy.appendChild(lowStockOption);
        item.forEach((item) => {
            if (item.category && !categories.has(item.category)) {
                let option = document.createElement("option");
                option.value = item.category;
                option.text = item.category;
                filterBy.appendChild(option);
                categories.add(item.category);
            }
        });

        filterBy.addEventListener("change", function () {
        let selected = filterBy.value;
        let filteredItems;

        if (selected === "lowStock") {
            filteredItems = item.filter(it => it.quantity < lowStockThreshold);
        } else {
            filteredItems = item.filter(it => it.category === selected);
        }

        displayInventory(filteredItems);
        });

        controlsDiv.appendChild(filterBy);
        controlsDiv.appendChild(uniqueField);
        controlsDiv.appendChild(searchButton);

        searchButton.onclick = function () {
        let searchCode = uniqueField.value;
        let itemToUpdate = item.find(it => it.name === searchCode || it.code === searchCode);

        if (itemToUpdate)
        {
            // Dropdown to pick which field to update
            let selection = document.createElement("select");
            selection.id = "fieldSelection";

            let fields = ["name", "code", "quantity", "category"];
            fields.forEach(field => {
                let option = document.createElement("option");
                option.value = field;
                option.text = "Update " + field;
                selection.appendChild(option);
            });
            controlsDiv.appendChild(selection);
            
            let newValue = document.getElementById("newValue");
            let confirmButton = document.getElementById("confirmButton");

            selection.addEventListener("change", function() 
            {
                if (!document.getElementById("newValue") || !document.getElementById("confirmButton")) {
            // Input for new value
                    newValue = document.createElement("input");
                    newValue.type = "text";
                    newValue.id = "newValue";
                    newValue.placeholder = "Enter new value";
                    controlsDiv.appendChild(newValue);

            // Confirm button
            confirmButton = document.createElement("button");
            confirmButton.id = "confirmButton";
            confirmButton.textContent = "Confirm Update";
            controlsDiv.appendChild(confirmButton);

            confirmButton.onclick = function () {
                let field = selection.value;
                let val = newValue.value;

                if (val) {
                    if (field === "quantity") {
                        val = parseInt(val); // Convert to integer if updating quantity
                    }
                    itemToUpdate[field] = val; // Only update the chosen field
                    displayInventory(item);
                }
                }  
            };
            });
            } else {
            alert("No record found with code: " + searchCode);
        }
        };


    } else {
        document.getElementById("uniqueField").remove();
        document.getElementById("searchButton").remove();
        if (document.getElementById("filterBy") || document.getElementById("newValue") || document.getElementById("confirmButton") || document.getElementById("fieldSelection"))
        {
            document.getElementById("filterBy").remove();
            document.getElementById("newValue").remove();
            document.getElementById("confirmButton").remove();
            document.getElementById("fieldSelection").remove();
        }
    }
    
}

function deleteItem() {
    let dropdown = document.createElement("select");

    if (!document.getElementById("itemDropdown") && item.length > 0) {
        // Prevents creation of additional dropdowns and doesn't create if no items
        dropdown.id = "itemDropdown";
        item.forEach((item) => {
            let option = document.createElement("option");
            option.value = item.name;
            option.text = item.name;
            dropdown.append(option);
        });
        controlsDiv.appendChild(dropdown);
    } else {
        document.getElementById("itemDropdown").remove();
    }

    let deleteButton = document.createElement("button");

    if (!document.getElementById("deleteButton") && item.length > 0) {
        // Prevents creation of additional delete buttons
        deleteButton.id = "deleteButton";
        deleteButton.textContent = "Delete Selected Item";
        controlsDiv.appendChild(deleteButton);

        deleteButton.onclick = function() {
            let yesButton = document.createElement("button");
            let noButton = document.createElement("button");
            yesButton.textContent = "Yes";
            noButton.textContent = "No";

            controlsDiv.appendChild(yesButton);
            controlsDiv.appendChild(noButton);

            yesButton.onclick = function() {
                let selectedItem = document.getElementById("itemDropdown").value;
                item = item.filter((item) => item.name !== selectedItem);
                controlsDiv.removeChild(dropdown);
                controlsDiv.removeChild(deleteButton);
                controlsDiv.removeChild(yesButton);
                controlsDiv.removeChild(noButton);
                displayInventory(item);
            }

            noButton.onclick = function() {
                controlsDiv.removeChild(yesButton);
                controlsDiv.removeChild(noButton);
            }
        }
    } else {
        document.getElementById("deleteButton").remove();
    }
}

function sortBy(item) {
    let sortByOptions = document.createElement("select");
    let ascendingButton = document.createElement("button");
    let descendingButton = document.createElement("button");

    if (!document.getElementById("sortByOptions") || !document.getElementById("ascendingButton") || !document.getElementById("descendingButton")) {
        // Prevents creation of additional dropdowns
        sortByOptions.id = "sortByOptions";
        let fields = ["name", "code", "quantity", "category"];
        fields.forEach(field => {
            let option = document.createElement("option");
            option.value = field;
            option.text = "Sort by " + field;
            sortByOptions.appendChild(option);
        });

        controlsDiv.appendChild(sortByOptions);

        ascendingButton.textContent = "Ascending";
            ascendingButton.id = "ascendingButton";
            controlsDiv.appendChild(ascendingButton);

            descendingButton.textContent = "Descending";
            descendingButton.id = "descendingButton";
            controlsDiv.appendChild(descendingButton);

        ascendingButton.onclick = function() { ascending = true; sort(sortByOptions.value, ascending); }
        descendingButton.onclick = function() { ascending = false; sort(sortByOptions.value, ascending); }
    } else {
        document.getElementById("sortByOptions").remove();
        document.getElementById("ascendingButton").remove();
        document.getElementById("descendingButton").remove();
    }
}

function reset() {
    document.getElementById("list").innerHTML = ""; //dagdag mo controls div
    displayInventory(item);
}

function displayInventory(list) {
    let inventoryDiv = document.getElementById("list");
    inventoryDiv.innerHTML = ""; // Clear previous content

    if (item.length === 0) {
        inventoryDiv.innerHTML = "<p>No items in inventory.</p>";
        return;
    }

    let html = "<ul>";
    list.forEach((listItem) => {
        html += `<li>${listItem.name} - ${listItem.code} - Quantity: ${listItem.quantity}</li>`;
    });
    html += "</ul>";

    inventoryDiv.innerHTML = html;
}

function search() {
    let searchTerm = document.createElement("input");
    let searchButton = document.createElement("button");

    if (!document.getElementById("searchTerm") && !document.getElementById("searchButton")) {
        // Prevents creation of additional search inputs
        searchTerm.id = "searchTerm";
        searchTerm.type = "text";
        searchTerm.placeholder = "Enter item name";
        controlsDiv.appendChild(searchTerm);

        searchButton.id = "searchButton";
        searchButton.textContent = "Search";
        controlsDiv.appendChild(searchButton);

        searchButton.onclick = function () {
            let dropdown = document.getElementById("searchDropdown");
            if (!dropdown) {
                dropdown = document.createElement("select");
                dropdown.id = "searchDropdown";
                controlsDiv.appendChild(dropdown);
            }

            let term = searchTerm.value;
            let results = item.filter((item) => item.name.includes(term));

            let html = "<ul>";
            results.forEach(match => { html += `<li>${match.name} — Quantity: ${match.quantity}</li>`; });
            html += "</ul>";
            document.getElementById("list").innerHTML = html;

            results.forEach(match => {
                let option = document.createElement("option");
                option.value = match.name;
                option.text = match.name;
                dropdown.append(option);
            });
        };
    } else {
        document.getElementById("searchTerm").remove();
    }
}
