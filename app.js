'use strict';

// ******** GLOBAL VARIABLES **************
let totalVotes = 25;
let allProducts = [];

// ********* DOM REFERENCES ****************
let imgContainer = document.getElementById('img-container');
let imgOne = document.getElementById('img-one');
let imgTwo = document.getElementById('img-two');
let imgThree = document.getElementById('img-three');

let resultBtn = document.getElementById('show-results-btn');
let resultsList = document.getElementById('results-list');

// ************ LOCAL STORAGE CONTINUES **************

// STEP 3: GET DATA OUT OF LOCAL STORAGE

let retreivedProducts = localStorage.getItem('myProducts');


console.log('retrievedProducts', retreivedProducts);

let parsedProducts = JSON.parse(retreivedProducts);

console.log('parsedProducts >>> ', parsedProducts);

// ********* CONSTRUCTOR FUNCTION *************

function Product(name, photoExtension = 'jpg') {
  this.name = name;
  this.photo = `img/${name}.${photoExtension}`;
  this.views = 0;
  this.votes = 0;
  
  allProducts.push(this);
}


// ********* OBJECT CREATION ******************
if (retreivedProducts) {
  console.log('here');
  allProducts = parsedProducts;

}else {
  new Product('bag');
  new Product('banana');
  new Product('bathroom');
  new Product('boots');
  new Product('breakfast');
  new Product('bubblegum');
  new Product('chair');
  new Product('cthulhu');
  new Product('dog-duck');
  new Product('dragon');
  new Product('pen');
  new Product('pet-sweep');
  new Product('scissors');
  new Product('shark');
  new Product('sweep', 'png');
  new Product('tauntaun');
  new Product('unicorn');
  new Product('water-can');
  new Product('wine-glass');
  // localStorage.setItem('myProducts', JSON.stringify(allProducts));
}

  // *********** HELPER FUNCTIONS ***************
  
  function randomIndexGenerator() {
    return Math.floor(Math.random() * allProducts.length);
  }
  
  let productIndexArr = [];
  
  function renderImgs() {
    while (productIndexArr.length < 6) {
      let randomNum = randomIndexGenerator();
      if (!productIndexArr.includes(randomNum)) {
        productIndexArr.push(randomNum);
      }
    }


    let imgOneIndex = productIndexArr.shift();
    let imgTwoIndex = productIndexArr.shift();
    let imgThreeIndex = productIndexArr.shift();
    console.log([imgOneIndex, imgTwoIndex, imgThreeIndex]);
    console.log(productIndexArr)
    // make sure they are unique each round
    // while(imgOneIndex === imgTwoIndex || imgTwoIndex === imgThreeIndex || imgThreeIndex === imgOneIndex){
      //   imgTwoIndex = randomIndexGenerator();
      //   imgThreeIndex = randomIndexGenerator();
    // }
    
    // *** maybe use a container to store your 3 index numbers and do validation against that collection/container ***
    
    imgOne.src = allProducts[imgOneIndex].photo;
    imgOne.alt = allProducts[imgOneIndex].name;
    imgOne.name = allProducts[imgOneIndex].name;
    allProducts[imgOneIndex].views++;

    imgTwo.src = allProducts[imgTwoIndex].photo;
    imgTwo.alt = allProducts[imgTwoIndex].name;
    imgTwo.name = allProducts[imgTwoIndex].name;
    allProducts[imgTwoIndex].views++;
    
    imgThree.src = allProducts[imgThreeIndex].photo;
    imgThree.alt = allProducts[imgThreeIndex].name;
    imgThree.name = allProducts[imgThreeIndex].name;
    allProducts[imgThreeIndex].views++;
  }

  renderImgs();
  
  // *********** EVENT HANDLERS  *****************
  
  function handleClick(event) {
    // - click - on the imgs - rerender new images(increase the views on the goats that are rendered) - count the vote of the goat that was clicked/ lower our total number of votes
    let imgClicked = event.target.name;
    console.dir(imgClicked);
    
    for (let i = 0; i < allProducts.length; i++) {
      if (imgClicked === allProducts[i].name) {
        allProducts[i].votes++;
      }
    }
    totalVotes--;
    
    renderImgs();
    
    if (totalVotes === 0) {
      // ********** LOCAL STORAGE STARTS HERE ***********
      // STEP 1: STRINGIFY THE DATA
      let stringifiedProducts = JSON.stringify(allProducts);
      
      console.log('stringifiedProducts >>>', stringifiedProducts);
      
      // STEP 2: ADD TO LOCAL STORAGE
      localStorage.setItem('myProducts', JSON.stringify(allProducts));
      

      imgContainer.removeEventListener('click', handleClick);
    }
  }

  function handleShowResults() {
    if (totalVotes === 0) {
      renderChart();
    
      resultBtn.removeEventListener('click', handleShowResults);
    }
  }
  // ************** CHART DEMO ************************

  // *** CANVAS ELEMENT NEEDED TO RENDER THE CHART ***
  let canvasElem = document.getElementById('my-chart');

  function renderChart() {

    // **** CREATING EMPTY ARRAYS TO POPULATE WITH THE INFO FOR OUR CHART ****

    let productNames = [];
    let productVotes = [];
    let productViews = [];

    // *** THIS FOR LOOP TAKES ALL THE DATA AFTER THE VOTING ROUNDS ARE COMPLETED AND POPULATES THE ARRAYS CREATED ABOVE ***
    for (let i = 0; i < allProducts.length; i++) {
      productNames.push(allProducts[i].name);
      productViews.push(allProducts[i].views);
      productVotes.push(allProducts[i].votes);
    }
    // *** CONFIG OBJECT THAT CHART.JS USES TO RENDER THE CHART ***
    let myObj = {
      type: 'bar',
      data: {
        labels: productNames,
        datasets: [{
          label: '# of Votes',
          data: productVotes,
          backgroundColor: [
            '#7fced8',

          ],
          borderColor: [
            '#ba1c9d',

          ],
          borderWidth: 1
        },
        {
          label: '# of Views',
          data: productViews,
          backgroundColor: [
            '#ba1c9d',
          ],
          borderColor: [
            '#7fced8',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    // *** CONSTRUCTOR CALL TO RENDER THE CHART ***
    new Chart(canvasElem, myObj);

  }

  // ********* EVENT LISTENERS *******************
  imgContainer.addEventListener('click', handleClick);
  resultBtn.addEventListener('click', handleShowResults);
