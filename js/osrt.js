      let cart = [];
      let deliveryFee = 250;

      var crt = 0;
      var flt = 0;
      var dlc = 0;

      const form = document.getElementById("form");
      const submitButton = document.getElementById("submit-button");
      const cancelButton = document.getElementById("cancel-button");
      const messageDiv = document.getElementById("message");
      const captchaKeyDiv = document.getElementById("key");

      function addToCart(name, price, qtyId) {
        let qty = parseInt(document.getElementById(qtyId).value);
        cart.push({ name, price, qty });
        renderCart();
      }

      function renderCart() {
        let list = document.getElementById("cartList");
        list.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
          let subtotal = item.price * item.qty;
          total += subtotal;

          let li = document.createElement("li");
          li.className =
            "list-group-item d-flex justify-content-between align-items-center";

          li.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        ₱${item.price} x 
        <input type="number" value="${item.qty}" min="1" 
        style="width:60px" 
        onchange="updateQty(${index},this.value)">
      </div>
      <div>
        ₱${subtotal}
        <button class="btn btn-sm btn-danger ms-2" onclick="removeItem(${index})">X</button>
      </div>
    `;

          list.appendChild(li);
        });

        dlc = deliveryFee;
        crt = document.getElementById("productTotal").innerText = total;
        flt = document.getElementById("finalTotal").innerText = total + deliveryFee;
        // return {"Product Total": pdt,"Final Total": flt, "Delivery Fee": deliveryFee};
      }

      function updateQty(index, qty) {
        cart[index].qty = parseInt(qty);
        renderCart();
      }
      function removeItem(index) {
        cart.splce(index, 1);
        renderCart();
      }
       function openModal(title, desc) {
        document.getElementById("modalTitle").innerText = title;
        document.getElementById("modalDesc").innerText = desc;
        document.getElementById("modal").style.display = "flex";
      }

      function closeModal() {
        document.getElementById("modal").style.display = "none";
      }

// Function to handle file upload
async function uploadFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (e) => {
      const data = e.target.result.split(",");
      const obj = {
        fileName: file.name,
        mimeType: data[0].match(/:(\w.+);/)[1],
        data: data[1],
      };
      resolve(obj);
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

// form.addEventListener("submit", async function (e) {
submitButton.addEventListener("click", async function (e) {
//   const captchaR = printmsg();
  renderCart();
const totals = {"Cart Total": crt, "Final Total": flt, "Delivery Charge":  dlc};
  e.preventDefault();

  messageDiv.textContent = "Submitting...";
  messageDiv.style.display = "block";
  messageDiv.style.backgroundColor = "beige";
  messageDiv.style.color = "black";
  submitButton.disabled = true;
  submitButton.classList.add("is-loading");

//   if (captchaR === 1) {
    try {
      // const formData = new FormData();
      const formData = new FormData(form);
      const formDataObj = {...totals};

      // Convert FormData to object
      for (let [key, value] of formData.entries()) {
        formDataObj[key] = value;
        console.log("", formDataObj[key]);
      }
      // Handle file upload if a file is selected
      // if (fileInput.files.length > 0) {
      //   const fileObj = await uploadFile(fileInput.files[0]);
      //   formDataObj.fileData = fileObj; // Add file data to form data
      // }
      console.log("form Data", formDataObj)
      // Submit form data
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxoOcqJvPicdt7jl7Oqq1_RzFSIkY2AdV00A8J6tg_QgLh87zIrjdKu8PMHOdRLiOgJ/exec";

      const response = await fetch(scriptURL, {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify(formDataObj),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      });
    //   console.log("form select", selectText);
      const data = await response.json();

      if (data.status === "success") {
        console.log("1");
        messageDiv.textContent = data.message || "Data submitted successfully!";
        messageDiv.style.backgroundColor = "#48c78e";
        messageDiv.style.color = "white";
        form.reset();
        // fileNameDisplay.textContent = "No file selected";
      } else {
        console.log("0");
        throw new Error(data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
      messageDiv.textContent = "Error: " + error.message;
      messageDiv.style.backgroundColor = "#f14668";
      messageDiv.style.color = "white";
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");

      setTimeout(() => {
        messageDiv.textContent = "";
        messageDiv.style.display = "none";
        captchaKeyDiv.textContent = "";
      }, 4000);
    }
//   } else {
//     form.reset();
//     messageDiv.style.display = "none";
//     captchaKeyDiv.style.color = "Red";
//     submitButton.disabled = false;
//     submitButton.classList.remove("is-loading");
//   }
});

cancelButton.addEventListener("click", function () {
  form.reset();
});
