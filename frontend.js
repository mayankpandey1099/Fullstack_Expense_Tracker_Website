const apiUrl = `http://127.0.0.1:3000`;

const form = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const editExpenseForm = document.getElementById("editExpenseForm");
const cancelUpdateButton = document.getElementById("cancelUpdateButton");

form.addEventListener("submit", async(e) =>{
    e.preventDefault();

    const formData = new FormData(form);
    const expense = {
        name: formData.get("name"),
        quantity: formData.get("quantity"),
        amount: formData.get("amount"),
    };
    try{
        const response = await fetch(`${apiUrl}/api/expenses`,{

            method : "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(expense),
        });
        if(response.ok){
            form.reset();
            fetchExpenseList();
        } else{
            console.error("error submitting form", response.statusText);
        }
    }catch (err){
        console.error("error submitting form:",error);
    }
});

function fetchExpenseList(){
    expenseList.innerHTML = "";
    fetch(`${apiUrl}/api/expenses`)
         .then((response)=>response.json())
         .then((expenses) =>{
            expenses.forEach((expense) =>{
                const expenseItem = document.createElement("div");
                expenseItem.innerHTML = `
                <div class = "expense-item">
                <span>Name:${expense.name}</span>
                <span>Quantity: ${expense.quantity}</span>
                <span>Amount:${expense.amount}</span>
                <button data-expense-id="${expense.id}" class="update-button">Update</button>
                <button onclick="deleteExpense(${expense.id})">Delete</button>
                </div>
                `;
                expenseList.appendChild(expenseItem);
            });
         })
         .catch((error) =>{
            console.error("error fetching user:", error);
         });

}

expenseList.addEventListener("click",async (e) =>{
    if(e.target && e.target.matches("button.update-button")){
        const expenseId = e.target.getAttribute("data-expense-id");
        try{
            const response = await fetch(`${apiUrl}/api/expenses/${expenseId}`);

            if(response.ok){
                const expenseItem = await response.json();

                editExpenseForm.querySelector("#editExpenseId").value = expenseItem.id;
                editExpenseForm.querySelector("#editName").value = expenseItem.name;
                editExpenseForm.querySelector("#editQuantity").value = expenseItem.quantity;
                editExpenseForm.querySelector("#editAmount").value = expenseItem.amount;
                editExpenseForm.style.display = "block";
            }else{
                console.error("error fetching expense details:",response.statusText);
            }
        }catch(error){
            console.error("error fetching expense details:", error);
        }
    }

});

editExpenseForm.addEventListener("submit", async (e) =>{
    e.preventDefault();
    const formData = new FormData(editExpenseForm);
    const updatedExpense = {
            id: formData.get("editExpenseId"),
            name: formData.get("editName"),
            quantity: formData.get("editQuantity"),
            amount: formData.get("editAmount"),
        };
    try{
        const response = await fetch(`${apiUrl}/api/expenses/${updatedExpense.id}`,{
            method: "PUT",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedExpense),
        });
        if(response.ok){
            editExpenseForm.reset();
            editExpenseForm.style.display = "none";
            fetchExpenseList();
        }else{
            console.error("error updating expense:", response.statusText);
        }
    }catch(error){
        console.error("error updating expense:", error);
    }
});
cancelUpdateButton.addEventListener("click", ()=>{
    editExpenseForm.style.display = "none";
});

function deleteExpense(expenseId){
    fetch(`${apiUrl}/api/expenses/${expenseId}`,{
        method : "DELETE",
    })
    .then((response) =>{
        if(response.ok){
            fetchExpenseList();
        }else{
            console.error("error deleting user:", response.statusText);
        }
    })
    .catch((error) =>{
        console.error("error deleting user:", error);
    });
}

fetchExpenseList();