import Fw from './fetch-wrapper.js'
import { capitalize, calculateCalories } from "./helpers.js";
import AppData from "./app-data.js";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let API = new Fw('/calApi/');

const appData = new AppData();

const list    = document.querySelector("#food-list");
const form    = document.querySelector("#create-form");
const name    = document.querySelector("#create-name");
const carbs   = document.querySelector("#create-carbs");
const protein = document.querySelector("#create-protein");
const fat     = document.querySelector("#create-fat");

const displayEntry = (name, carbs, protein, fat) => {
    appData.addFood(carbs, protein, fat);
    list.insertAdjacentHTML(
      "beforeend",
      `<li class="card">
          <div>
            <h3 class="name">${capitalize(name)}</h3>
            <div class="calories">${calculateCalories(carbs, protein, fat)} calories</div>
            <ul class="macros">
              <li class="carbs"><div>Carbs</div><div class="value">${carbs}g</div></li>
              <li class="protein"><div>Protein</div><div class="value">${protein}g</div></li>
              <li class="fat"><div>Fat</div><div class="value">${fat}g</div></li>
            </ul>
          </div>
        </li>`
    );
};

form.addEventListener("submit", (event) => {
    event.preventDefault();
  
    API.post("add-food", {
        token: localStorage.getItem('token'),
        fields: {
            name:    name.value,
            carbs:   carbs.value,
            protein: protein.value,
            fat:     fat.value
        },
    }).then((data) => {
      console.log(data);
      if (data.error) {
        alert(data.error);
        window.location.href = 'login.html';
        return;
      }
        
      displayEntry(name.value, carbs.value, protein.value, fat.value);
      render();
  
      name.value = "";
      carbs.value = "";
      protein.value = "";
      fat.value = "";
    });
});


const init = () => {
  API.post("get-user-food", {token: localStorage.getItem('token')})
  .then((data) => {
    console.log(data);
    data.documents?.forEach((doc) => {

      displayEntry(
        doc.name,
        doc.carbs,
        doc.protein,
        doc.fat
      );
    });
    render();
  });
};

let chartInstance = null;
const renderChart = () => {
  chartInstance?.destroy();
  const context = document.querySelector("#app-chart").getContext("2d");

  chartInstance = new Chart(context, {
    type: "bar",
    data: {
      labels: ["Carbs", "Protein", "Fat"],
      datasets: [
        {
          labels: ["Macronutrients", "2", "1"],
          data: [
            appData.getTotalCarbs(),
            appData.getTotalProtein(),
            appData.getTotalFat(),
          ],
          backgroundColor: ["#25AEEE", "#FECD52", "#57D269"],
          borderWidth: 3, // example of other customization
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
};

const totalCalories = document.querySelector("#total-calories");

const updateTotalCalories = () => {
  totalCalories.textContent = appData.getTotalCalories();
};

const render = () => {
  renderChart();
  updateTotalCalories();
};

let clean_entrys_button = document.querySelector('#clean-entrys');
let log_out_button = document.querySelector('#log-out');

clean_entrys_button.addEventListener('click', event => { 
  API.post("clean-user-entrys", {token: localStorage.getItem('token')})
  .then((data) => {
    if (data.error) {
      alert(data.error);
      return;
    }

    list.innerHTML = "";
    appData.reset();
    init()
  });
});

log_out_button.addEventListener('click', event => { 
    localStorage.removeItem('token');
    location.reload();
});

init();