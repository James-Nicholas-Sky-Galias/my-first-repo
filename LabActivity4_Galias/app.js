let item = [];
let i = 0;
const lowStockThreshold = 10; //arbitrary threshold for low stock
let controlsDiv = document.getElementById("controls");

let UIhelper = 
{
    controlsDivclear: function()
    {
        if (controlsDiv.children.length > 0) 
        {
            reset();
        }
    },

    errorChecking: function(...args)
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
    item.sort((a, b) => 
        {
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

function addToInventory() 
{
    if (document.getElementById("item").value === "" || 
        document.getElementById("itemCode").value === "" || 
        document.getElementById("quantity").value === "") 
    {
        alert("Please fill in all fields.");
        return;
    }

    let name = document.getElementById("item").value;
    let code = document.getElementById("itemCode").value;
    let quantity = parseInt(document.getElementById("quantity").value);
    let category = document.getElementById("category").value;

    let newProduct = Object.assign({}, product); // clone structure
    newProduct.name = name;
    newProduct.code = code;
    newProduct.quantity = quantity;
    newProduct.category = category;

    item[i] = newProduct
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

    if (errorCheck) 
    {
        // Prevents creation of additional search inputs
        uniqueField = document.createElement("input");
        uniqueField.id = "uniqueField";
        uniqueField.type = "text";
        uniqueField.placeholder = "Enter unique field to update (case-sensitive)";

        searchButtonEdit = document.createElement("button");
        searchButtonEdit.id = "searchButtonEdit";
        searchButtonEdit.textContent = "Find Record";

        controlsDiv.appendChild(uniqueField);
        controlsDiv.appendChild(searchButtonEdit);
    }

    searchButtonEdit.onclick = function ()
    {
        let searchCode = uniqueField.value;
        let itemToEdit = item.find(it => it.name === searchCode || it.code === searchCode);

        if (itemToEdit)
        {
            // Dropdown to pick which field to update
            let selection = document.createElement("select");
            selection.id = "fieldSelection";

            let fields = ["name", "code", "quantity", "category"];
            fields.forEach(field => 
            {
                let option = document.createElement("option");
                option.value = field;
                option.text = field.charAt(0).toUpperCase() + field.slice(1);
                selection.appendChild(option);
            });

            controlsDiv.appendChild(selection);

            // Input field for new value
            let newValueInput = document.createElement("input");
            newValueInput.id = "newValue";
            newValueInput.type = "text";
            newValueInput.placeholder = "Enter new value";
            controlsDiv.appendChild(newValueInput);

            // Update button
            let updateButton = document.createElement("button");
            updateButton.textContent =  "Update Item";
            controlsDiv.appendChild(updateButton);

            updateButton.onclick = function ()
            {
                let selectedField = selection.value;
                let newValue = newValueInput.value;

                if (newValue === "") 
                {
                    alert("Please enter a new value.");
                    return;
                }

                itemToEdit[selectedField] = newValue;
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

    if (errorCheck) 
    {
        // Prevents creation of additional search inputs
        filterBy = document.createElement("select");
        filterBy.id = "filterBy";
    
        let categories = new Set();
        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "Select a category";
        filterBy.appendChild(defaultOption);

        let lowStockOption = document.createElement("option");
        lowStockOption.value = "lowStock";
        lowStockOption.text = "Low Stock Items";
        filterBy.appendChild(lowStockOption);
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

        controlsDiv.appendChild(filterBy);  
    }

    filterBy.addEventListener("change", function () 
    {
        let selected = filterBy.value;
        let filteredItems;

        if (selected === "lowStock")
        {
            filteredItems = item.filter(it => it.quantity < lowStockThreshold);
        } 
        else 
        {
            filteredItems = item.filter(it => it.category === selected);
        }   
        displayInventory(filteredItems);
    });

}

function deleteItem() {
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
        let yesButton = document.createElement("button");
        let noButton = document.createElement("button");
        yesButton.textContent = "Yes";
        noButton.textContent = "No";

        controlsDiv.appendChild(yesButton);
        controlsDiv.appendChild(noButton);

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

        noButton.onclick = function() 
        {
            controlsDiv.removeChild(yesButton);
            controlsDiv.removeChild(noButton);
        }
    }
}

function sortBy() 
{
    UIhelper.controlsDivclear();
    
    let sortByOptions = document.getElementById("sortByOptions");
    let ascendingButton = document.getElementById("ascendingButton");
    let descendingButton = document.getElementById("descendingButton");

    let errorCheck = UIhelper.errorChecking(sortByOptions, ascendingButton, descendingButton);

    if (errorCheck) 
    {
        // Prevents creation of additional dropdowns
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

        controlsDiv.appendChild(sortByOptions);

        ascendingButton = document.createElement("button");
        ascendingButton.textContent = "Ascending";
        ascendingButton.id = "ascendingButton";
        controlsDiv.appendChild(ascendingButton);

        descendingButton = document.createElement("button");
        descendingButton.textContent = "Descending";
        descendingButton.id = "descendingButton";
        controlsDiv.appendChild(descendingButton);
    }

    ascendingButton.onclick = function() { ascending = true; sort(sortByOptions.value, ascending); }
    descendingButton.onclick = function() { ascending = false; sort(sortByOptions.value, ascending); }
}

function reset() 
{
    document.getElementById("controls").innerHTML = "";
    displayInventory(item);
}

function search() {
    let liveSearch = document.getElementById("liveSearch");
    let searchButton = document.getElementById("searchButton");
    let dropdown = document.getElementById("searchDropdown");

    if (!liveSearch)
    {
        // Prevent multiple creations
        liveSearch = document.createElement("input");
        liveSearch.id = "liveSearch";
        liveSearch.type = "text";
        liveSearch.placeholder = "Enter item name";
        document.body.appendChild(liveSearch);
    }

    if (!searchButton)
    {
        searchButton = document.createElement("button");
        searchButton.id = "searchButton";
        searchButton.textContent = "Search";
        document.appendChild(searchButton);
    }

    // Create dropdown (always appended once)
    dropdown = document.createElement("select");
    dropdown.id = "searchDropdown";
    dropdown.style.display = "none"; // start hidden
    controlsDiv.appendChild(dropdown);

    // 🔍 Live search event
    liveSearch.addEventListener("input", function () 
    {
        let term = liveSearch.value.trim().toLowerCase();
        dropdown.innerHTML = ""; // clear old options

        if (term === "") 
        {
            document.getElementById("list").innerHTML = "";
            dropdown.style.display = "none";
            return;
        }

        let results = item.filter((it) => it.name.includes(term));

        if (results.length === 0) 
        {
            dropdown.style.display = "none";
            return;
        }

        // Populate dropdown
        results.forEach(match => 
        {
            let option = document.createElement("option");
            option.value = match.name;
            option.text = `${match.name} — Qty: ${match.quantity}`;
            dropdown.appendChild(option);
        });

        // Make dropdown visible
        dropdown.style.display = "block";

        // Optional: show preview below
        displayInventory(results);
    });

    // 🔘 Button manual search
    searchButton.onclick = function () 
    {
        let term = liveSearch.value.trim().toLowerCase();
        let results = item.filter((it) => it.name.includes(term));
        displayInventory(results);
    };

    // ✅ Bonus: clicking an option auto-filters
    dropdown.addEventListener("change", function () {
        let selectedName = dropdown.value;
        let selectedItem = item.find(it => it.name === selectedName);
        if (selectedItem) displayInventory([selectedItem]);
    });
}

window.onload = function() {search();};

let tableView = true; // start in table view mode

function toggleView() {
  tableView = !tableView; // flip mode
  const toggleBtn = document.getElementById("toggleView");
  toggleBtn.value = tableView ? "Switch to Card View" : "Switch to Table View";

  displayInventory(item); // re-render using the chosen mode
}

// Modify your existing displayInventory() to support both
function displayInventory(items) {
  const list = document.getElementById("list");

  if (items.length === 0) {
    list.innerHTML = "<i>No items found.</i>";
    return;
  }

  if (tableView) {
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
    items.forEach(p => {
      html += `
        <tr>
          <td>${p.name}</td>
          <td>${p.code}</td>
          <td>${p.quantity}</td>
          <td>${p.category}</td>
        </tr>
      `;
    });
    html += `</table>`;
    list.innerHTML = html;

  } else {
    // 🗂️ Card View
    let html = `<div style="display:flex; flex-wrap:wrap; gap:10px;">`;
    items.forEach(p => {
      html += `
        <div style="border:1px solid #888; padding:10px; border-radius:10px; width:150px;">
          <b>${p.name}</b><br>
          <small>Code: ${p.code}</small><br>
          Qty: ${p.quantity}<br>
          <i>${p.category}</i>
        </div>
      `;
    });
    html += `</div>`;
    list.innerHTML = html;
  }
}