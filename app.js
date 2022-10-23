// class with constructor for Asset that mirrors API schema
class Asset {
    constructor(type, category, name, value) {
        this.type = type;
        this.category = category;
        this.name = name;
        this.value = value;
    }
}

// class for data handling function
class AssetData {
    static url = `https://6353ffe1ccce2f8c020110da.mockapi.io/assets`;

    // get request for all assets in the api
    static getAllAssets() {
        return $.get(this.url);
    }

    // get request for single asset by id
    static getAsset(id) {
        return $.get(this.url + `/${id}`);
    }

    static createAsset() {
        // ensures comma's don't interfere with the returned number value;
        let value = $("#valueInput").val().replace(",","");
        // sends a post request for a new Asset with the values of the input fields
        return $.post(this.url, new Asset($("#typeSelect").val(), $("#categorySelect").val(), $("#nameInput").val(), value));
    }
}

// class for handing DOM manipulation
class DOMManager {

    // this gets all values and then renders the total value of all assets
    static getAllValues() {
        AssetData.getAllAssets().then(assets => this.renderTotalAssetsValue(assets));
        AssetData.getAllAssets().then(assets => this.renderTypeValues(assets));
    }

    // gets assets of a particular category
    static getCategory(category) {
        AssetData.getAllAssets().then(assets => this.renderAssetsOfCategory(assets, category));
    }

    // renders the total assets value in the asset header
    static renderTotalAssetsValue(assets) {
        let totalAssetValue = 0;
        for (let asset of assets) {
            if (asset.value != "") {
                totalAssetValue += parseInt(asset.value);
            } 
        }
        $("#totalAssetValue").empty();
        $("#totalAssetValue").append(
            `<span>Total Asset Value: $${totalAssetValue.toLocaleString()}</span>`
        )
    }

    // ugly repetitive code, but clock is ticking and it works, refactor later
    // this renders the values for each asset type
    static renderTypeValues(assets) {
        let personalValue = 0;
        let realEstateValue = 0;
        let equityValue = 0;
        for (let asset of assets) {
            if (asset.type === 'personal') {
                if(asset.value != "") {
                    personalValue += parseInt(asset.value);
                }
            } else if (asset.type === 'realEstate') {
                if (asset.value != "") {
                    realEstateValue += parseInt(asset.value);
                }
            } else if (asset.type === 'equity') {
                if (asset.value != "") {
                    equityValue += parseInt(asset.value);
                }
            }
        } 
        $(".type-value").empty();
        $("#personalValue").append(
            `${personalValue.toLocaleString()}`
        );
        $("#realEstateValue").append(
            `${realEstateValue.toLocaleString()}`
        );
        $("#equityValue").append(
            `${equityValue.toLocaleString()}`
        )
    }

    // renders assets for a category when the onclick event prompts it
    static renderAssetsOfCategory(assets, category) {
        $(`#${category}AssetList`).empty();
        for (let asset of assets) {
            if (asset.category === category) {
                $(`#${category}AssetList`).append(
                    `<div class="row w-100 mx-auto ps-2 border-start border-bottom border-end border-1 asset">
                        <div class="col-9 p-0">
                            <li class="list-group-item rounded-0 p-0 border-0 fs-4">${asset.name} - $${asset.value}</li>
                        </div>
                        <div class="col-3 p-0">
                            <button class="btn btn-danger w-50 p-0 border-0 w-100 h-100 delete-btn" onclick="DOMManager.deleteAsset(${asset.id})" id="${asset.id}D">Delete</button>
                        </div>
                    </div>`
                )
            }
        }
    }

    // send delete request 
    static deleteAsset(id) {
        $.ajax({
            url: AssetData.url + `/${id}/`,
            method: 'DELETE',
            success: function() {
                DOMManager.getAllValues();
                $(".asset-list").empty();
                $(".category-item").addClass("closed");
            }
        })
    }
}

// on start up, renders values that always need to display
DOMManager.getAllValues();

// on click event for listing assets of a category
$(".category-item").on('click', (e) => {
    if ($(e.target).hasClass("closed")) {
        DOMManager.getCategory(e.target.id);
        $(e.target).removeClass("closed");
    } else {
        $(`#${e.target.id}AssetList`).empty();
        $(e.target).addClass("closed");
    }
}) 

// on click event for creating a new asset
$(".submit-btn").on("click", () => {
    AssetData.createAsset();
    DOMManager.getAllValues();
    // resets the input text
    $(".form-control").val("");
})

// on click event for the delete button 
$(".delete-btn").on('click', (e) => {
    console.log(e.target.id);
})

// changes the 2nd select values based on the first select's value
// ensures that the subcategory matches the category
$("#typeSelect").on('change', function() {
    if ($(this).val() === "personal") {
        $("#categorySelect").empty();
        $("#categorySelect").append(
            `<option value="cash">Cash</option>
            <option value="home">Home</option>
            <option value="item">Item</option>`
        )
    } else if ($(this).val() === "realEstate") {   
        $("#categorySelect").empty();
        $("#categorySelect").append(
            `<option value="rental">Rental</option>
            <option value="flip">Flip</option>
            <option value="land">Land</option>`
        )
    }
    else if ($(this).val() === "equity") {
        $("#categorySelect").empty();
        $("#categorySelect").append(
            `<option value="etf">ETF</option>
            <option value="stock">Stock</option>
            <option value="crypto">Crypto</option>`
        )
    }
})


