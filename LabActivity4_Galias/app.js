let item = []; //product objects will be stored here
let i = 0;
const lowStockThreshold = 10; //arbitrary threshold for low stock
let controlsDiv = document.getElementById("controls");
let summary = document.getElementById("summary");

//helper object for UI tasks
let UIhelper = 
{
    controlsDivclear: function() //clear controls div if it has children. in other words, if it has been used
    {
        if (controlsDiv.children.length > 0) 
        {
            reset();
        }
    },

    errorChecking: function(...args) //checks if any of the passed elements exist. returns true if any are missing
    {
        for (let i = 0; i < args.length; i++) {
            if (!args[i]) 
            {
                return true;
            }
        }
        return false;
    },
}

//product structure
let product =
{
    name: "",
    code: "",
    quantity: 0,
    category: "",
    lowStockAlert: function()
    {
        alert("Low stock for item: " + this.name);
    }
}

function sort(sortField, ascending = true)
{
    let itemCopy = item.slice(); //clone array to avoid mutating original

    itemCopy.sort((a, b) => 
        {
            let valA = a[sortField];
            let valB = b[sortField];

            //sort alphabetically
            if (typeof valA === "string" && typeof valB === "string") {
                if (ascending) { return valA.localeCompare(valB); }
                else { return valB.localeCompare(valA); }
            }

            //sort numerically
            if (typeof valA === "number" && typeof valB === "number") {
                if (ascending) { return valA - valB; }
                else { return valB - valA; }
            }

            //sort hybrid string/number
            valA = String(valA);
            valB = String(valB);
            if (ascending) { return valA.localeCompare(valB); }
            else { return valB.localeCompare(valA); }
        });
        displayInventory(itemCopy);
}

function addToInventory() 
{
    //error checking for empty fields
    if (document.getElementById("item").value === "" || 
        document.getElementById("itemCode").value === "" || 
        document.getElementById("quantity").value === "") 
    {
        alert("Please fill in all fields.");
        return;
    }

    //gather input values
    let name = document.getElementById("item").value;
    let code = document.getElementById("itemCode").value;
    let quantity = parseInt(document.getElementById("quantity").value);
    let category = document.getElementById("category").value;

    //error checking for duplicates
    if (item.some(it => it.name === name || it.code === code)) 
    {
        alert("Item with this name or code already exists.");
        return;
    }

    //create new product object
    let newProduct = Object.assign({}, product); // clone structure
    newProduct.name = name;
    newProduct.code = code;
    newProduct.quantity = quantity;
    newProduct.category = category;

    //add to inventory array
    item[i] = newProduct;
    i++;
    console.log(item[i-1]);
    displayInventory(item);
}

function editItem()
{
    let uniqueField = document.getElementById("uniqueField");
    let searchButtonEdit = document.getElementById("searchButtonEdit");

    UIhelper.controlsDivclear();

    let errorCheck = UIhelper.errorChecking(uniqueField, searchButtonEdit);

    //prevents creation of additional search inputs
    if (errorCheck) 
    {
        //creates uniqueField input
        uniqueField = document.createElement("input");
        uniqueField.id = "uniqueField";
        uniqueField.type = "text";
        uniqueField.placeholder = "Enter unique field to update (case-sensitive)";

        //creates search button
        searchButtonEdit = document.createElement("button");
        searchButtonEdit.id = "searchButtonEdit";
        searchButtonEdit.textContent = "Find Record";

        //attaches to controls div
        controlsDiv.appendChild(uniqueField);
        controlsDiv.appendChild(searchButtonEdit);
    }

    searchButtonEdit.onclick = function ()
    {
        let searchCode = uniqueField.value;
        let itemToEdit = item.find(it => it.name === searchCode || it.code === searchCode); //looks for specific item

        if (itemToEdit)
        {
            //dropdown to pick which field to update
            let selection = document.createElement("select");
            selection.id = "fieldSelection";

            //populate dropdown
            let fields = ["name", "code", "quantity", "category"];
            fields.forEach(field => 
            {
                let option = document.createElement("option");
                option.value = field;
                option.text = field.charAt(0).toUpperCase() + field.slice(1);
                selection.appendChild(option);
            });

            controlsDiv.appendChild(selection); //attaches to controls div

            //input field for new value
            let newValueInput = document.createElement("input");
            newValueInput.id = "newValue";
            newValueInput.type = "text";
            newValueInput.placeholder = "Enter new value";
            controlsDiv.appendChild(newValueInput);

            //update button
            let updateButton = document.createElement("button");
            updateButton.textContent =  "Update Item";
            controlsDiv.appendChild(updateButton);

            updateButton.onclick = function ()
            {
                let selectedField = selection.value;
                let newValue = newValueInput.value;

                if (newValue === "") //error checking for empty new value
                {
                    alert("Please enter a new value.");
                    return;
                }

                if (selectedField === "quantity") //applies new value to existing item
                {
                    itemToEdit[selectedField] = parseInt(newValue); //changes int in string to int
                }
                else
                {
                    itemToEdit[selectedField] = newValue;
                }
                displayInventory(item);
            };
        }
        else
        {
            alert("Item not found.");
        }
    };
}

function filter() 
{
    let filterBy = document.getElementById("filterBy");

    UIhelper.controlsDivclear();

    let errorCheck = UIhelper.errorChecking(filterBy);

    //prevents creation of additional search inputs
    if (errorCheck) 
    {
        //creates filterBy dropdown
        filterBy = document.createElement("select");
        filterBy.id = "filterBy";

        let categories = new Set(); //to track unique categories
        
        //default option
        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "Select a category";
        filterBy.appendChild(defaultOption);

        //low stock option (hardcoded to always be at the top of the list)
        let lowStockOption = document.createElement("option");
        lowStockOption.value = "lowStock";
        lowStockOption.text = "Low Stock Items";
        filterBy.appendChild(lowStockOption);
        
        //dynamically add categories from existing items
        item.forEach((item) => 
            {
                if (item.category && !categories.has(item.category))
                {
                    let option = document.createElement("option");
                    option.value = item.category;
                    option.text = item.category;
                    filterBy.appendChild(option);
                    categories.add(item.category);
                }
            });

        controlsDiv.appendChild(filterBy); //attaches to controls div
    }

    filterBy.addEventListener("change", function () 
    {
        let selected = filterBy.value;
        let filteredItems;

        if (selected === "lowStock") //hardcoded low stock option
        {
            filteredItems = item.filter(it => it.quantity < lowStockThreshold);
        } 
        else //filter by category
        {
            filteredItems = item.filter(it => it.category === selected);
        }   
        displayInventory(filteredItems);
    });

}

function deleteItem() 
{
    let dropdown = document.getElementById("itemDropdown");
    let deleteButton = document.getElementById("deleteButton");

    UIhelper.controlsDivclear();

    let errorCheck = UIhelper.errorChecking(dropdown, deleteButton);

    if (errorCheck) 
    {
        dropdown = document.createElement("select");
        dropdown.id = "itemDropdown";
        item.forEach((item) => 
        {
            let option = document.createElement("option");
            option.value = item.name;
            option.text = item.name;
            dropdown.append(option);
        });
        controlsDiv.appendChild(dropdown);

        deleteButton = document.createElement("button");
        deleteButton.id = "deleteButton";
        deleteButton.textContent = "Delete Selected Item";
        controlsDiv.appendChild(deleteButton)
    }

    deleteButton.onclick = function() 
    {
        //create confirmation buttons
        let yesButton = document.createElement("button");
        let noButton = document.createElement("button");
        yesButton.textContent = "Yes";
        noButton.textContent = "No";

        //attach to controls div
        controlsDiv.appendChild(yesButton);
        controlsDiv.appendChild(noButton);

        //deletes item if "Yes" is clicked and removes confirmation buttons
        yesButton.onclick = function() 
        {
            let selectedItem = document.getElementById("itemDropdown").value;
            item = item.filter((item) => item.name !== selectedItem);
            controlsDiv.removeChild(dropdown);
            controlsDiv.removeChild(deleteButton);
            controlsDiv.removeChild(yesButton);
            controlsDiv.removeChild(noButton);
            displayInventory(item);
        }

        //removes confirmation buttons if "No" is clicked
        noButton.onclick = function() 
        {
            controlsDiv.removeChild(yesButton);
            controlsDiv.removeChild(noButton);
        }
    }

    displayInventory(item);
}

function sortBy() 
{
    let sortByOptions = document.getElementById("sortByOptions");
    let ascendingButton = document.getElementById("ascendingButton");
    let descendingButton = document.getElementById("descendingButton");

    UIhelper.controlsDivclear();

    let errorCheck = UIhelper.errorChecking(sortByOptions, ascendingButton, descendingButton);

    //prevents creation of additional dropdowns
    if (errorCheck) 
    {
        //creates sortByOptions dropdown
        sortByOptions = document.createElement("select");
        sortByOptions.id = "sortByOptions";
        let fields = ["name", "code", "quantity", "category"];
        fields.forEach(field => 
        {
            let option = document.createElement("option");
            option.value = field;
            option.text = "Sort by " + field;
            sortByOptions.appendChild(option);
        });

        controlsDiv.appendChild(sortByOptions); //attaches to controls div

        //creates ascending and descending buttons
        ascendingButton = document.createElement("button");
        ascendingButton.textContent = "Ascending";
        ascendingButton.id = "ascendingButton";
        controlsDiv.appendChild(ascendingButton);

        descendingButton = document.createElement("button");
        descendingButton.textContent = "Descending";
        descendingButton.id = "descendingButton";
        controlsDiv.appendChild(descendingButton);
    }

    ascendingButton.onclick = function() { ascending = true; sort(sortByOptions.value, ascending); } //sets ascending to true to sort in ascending order
    descendingButton.onclick = function() { ascending = false; sort(sortByOptions.value, ascending); } //sets ascending to false to sort in descending order
}

function reset() 
{
    //clears controls div and displays full inventory
    document.getElementById("controls").innerHTML = "";
    displayInventory(item);
}

function search() {
    let liveSearch = document.getElementById("liveSearch");
    let searchButton = document.getElementById("searchButton");
    let dropdown = document.getElementById("searchDropdown");

    let errorCheck = UIhelper.errorChecking(liveSearch, searchButton);

    //prevent multiple creations
    if (errorCheck)
    {
        liveSearch = document.createElement("input");
        liveSearch.id = "liveSearch";
        liveSearch.type = "text";
        liveSearch.placeholder = "Enter item name";
        document.body.appendChild(liveSearch);

        searchButton = document.createElement("button");
        searchButton.id = "searchButton";
        searchButton.textContent = "Search";
        document.body.appendChild(searchButton);
    }

    //create dropdown (always appended once)
    dropdown = document.createElement("select");
    dropdown.id = "searchDropdown";
    dropdown.style.display = "none"; // start hidden
    controlsDiv.appendChild(dropdown);

    //live search logic
    liveSearch.addEventListener("input", function () 
    {
        let term = liveSearch.value.trim().toLowerCase(); //get current input
        dropdown.innerHTML = ""; // clear old options
        let results = item.filter((it) => it.name.includes(term));

        if (term === "" || results.length === 0) // hide dropdown if input is empty
        {
            document.getElementById("list").innerHTML = "";
            dropdown.style.display = "none";
            return;
        }

        //populate dropdown
        results.forEach(match => 
        {
            let option = document.createElement("option");
            option.value = match.name;
            option.text = `${match.name} — Qty: ${match.quantity}`;
            dropdown.appendChild(option);
        });

        //make dropdown visible
        dropdown.style.display = "block";

        //displays as table or cards based on current mode, also shows live updates results
        displayInventory(results);
    });

    //button manual search if some reason user prefers that
    searchButton.onclick = function () 
    {
        let term = liveSearch.value.trim().toLowerCase();
        let results = item.filter((it) => it.name.includes(term));
        displayInventory(results);
    };
}

function toggleView() {
  tableView = !tableView; // flip mode
  const toggleBtn = document.getElementById("toggleView");
  toggleBtn.value = tableView ? "Switch to Card View" : "Switch to Table View"; //switches button text

  displayInventory(item); // re-render using the chosen mode
}

function updateSummary() 
{
    let totalItems = item.length;
    let totalQuantity = 0;
    for (let i = 0; i < item.length; i++) //adds up total quantity of all items in the array
    {
        totalQuantity += item[i].quantity;
    }
    let lowStockItems = [];
    lowStockItems = item.filter(it => it.quantity < lowStockThreshold); //filters low stock items into new array
    LowStockNames = lowStockItems.map(it => it.name).join(", "); //isolates names of low stock items and joins them into a string
    
    //updates summary div
    summary.innerHTML = `
      <h3>Inventory Summary</h3>
      <p>Total Items: ${totalItems}</p>
      <p>Total Quantity: ${totalQuantity}</p>
      <p>Low Stock Items: ${LowStockNames}</p>
    `;
}

function displayInventory(items) 
{
    const list = document.getElementById("list");

    if (items.length === 0) 
    {
        list.innerHTML = "<i>No items found.</i>";
        return;
    }

    if (tableView) 
    {
        // 🧾 Table View
        let html = `
            <table border="1" cellspacing="0" cellpadding="6">
            <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Quantity</th>
                <th>Category</th>
            </tr>
        `;
        items.forEach(p => 
        {
            let lowStock = "";
            if (p.quantity < lowStockThreshold)
            {
                lowStock = 'style="color:red; font-weight:bold;"';
            }
            html += `
            <tr style="${lowStock}">
                <td>${p.name}</td>
                <td>${p.code}</td>
                <td ${lowStock}>${p.quantity}</td>
                <td>${p.category}</td>
            </tr>
            `;
        });
        html += `</table>`;
        list.innerHTML = html;

    } 
    else 
    {
        // 🗂️ Card View
        let html = `<div style="display:flex; flex-wrap:wrap; gap:10px;">`;
        items.forEach(p => 
        {
            let lowStock = "";
            if (p.quantity < lowStockThreshold)
            {
                lowStock = 'style="color:red; font-weight:bold;"';
            }
            html += `
            <div style="border:1px solid ${lowStock ? 'red' : '#888'}; padding:10px; border-radius:10px; width:150px; color:${lowStock ? 'red' : 'black'};">
                <b>${p.name}</b><br>
                <small>Code: ${p.code}</small><br>
                Qty: <span style="${lowStock}">${p.quantity}</span><br>
                <i>${p.category}</i>
            </div>
            `;
        });
        html += `</div>`;
        list.innerHTML = html;
    }

    updateSummary();
}

window.onload = function() {search();};

let tableView = true; // start in table view mode

for (i = 0; i < item.length; i++)
{
    if (item[i].quantity < lowStockThreshold)
    {
        item[i].lowStockAlert();
    }
}