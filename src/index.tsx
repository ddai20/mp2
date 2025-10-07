import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import axios from 'axios';

interface beanData {
  beanId : number,
  groupName : string[],
  ingredients : string[],
  flavorName : string,
  description : string,
  colorGroup : string,
  backgroundColor : string,
  imageUrl : string,
  glutenFree : boolean,
  sugarFree : boolean,
  seasonal : boolean,
  kosher : boolean
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

let allBeans : beanData[];

function Start() : beanData[] {
  axios.get('https://jellybellywikiapi.onrender.com/api/beans',{
    responseType: 'stream',
    params: {pageIndex: 1, pageSize: 114},
  }).then(function(response) {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    allBeans = JSON.parse(response.data).items;
  });

  return [];
}


//True -> Descending
//sortBy = [id, name]
export function listFilter(searchInput : string, sortBy : string, descend : boolean) : beanData[] {
  let lst : beanData[] = [];

  allBeans.forEach(element => {
    if (element.flavorName.substring(0, searchInput.length).toLocaleLowerCase() == searchInput.toLocaleLowerCase()) {
      lst.push(element);
    }
  });

  lst.sort((a : any,b : any) => {
    if (a[sortBy] < b[sortBy]) {
      if (descend) {
        return -1;
      } else {
        return 1;
      }
    } else {
      if (descend) {
        return 1;
      } else {
        return -1;
      }
    }
  });

  return lst;
}

export function galleryFilter(attributes : (keyof beanData)[], values : any[]) : beanData[] {
  let lst : beanData[] = [];

  allBeans.forEach(element => {
    for (let i = 0; i < attributes.length; i++) {
      if (element[attributes[i]] == values[i]) {
        lst.push(element);
      }
    }
  });

  return lst;
}

export function updateDetailColor(color : string) {
  let navBar = document.getElementsByClassName('navBar')[0] as HTMLElement;
  let navBarText = document.getElementsByClassName('navBarText');
  
  navBar.style.color = color;

  let darker = changeColor(navBar.style.color, 50);
  let lighter = changeColor(navBar.style.color, -50);

  navBar.style.backgroundColor = lighter;
  navBar.style.borderBottomColor = darker;

  for(let i = 0; i < navBarText.length; i++) {
    let t = navBarText[i] as HTMLElement;
    t.style.color = darker;
  }

  let boxes = document.getElementsByClassName('detailBox');
  let arrows = document.getElementsByClassName('detailArrow');

  if (boxes.length == 0) {
    return;
  }

  let box = boxes[0] as HTMLElement;
  box.style.color = darker;

  for(let i = 0; i < arrows.length; i++) {
    let t = arrows[i] as HTMLElement;
    t.style.color = lighter;
  }

}

function changeColor(color : string, amount : number) {
    const parts = color.match(/\d+/g);  

    if (parts == null) {
      return color;
    }

    let p = parts.map(Number);

    let r = Math.min(Math.max(0, p[0] - amount), 230);
    let g = Math.min(Math.max(0, p[1] - amount), 230);
    let b = Math.min(Math.max(0, p[2] - amount), 230);

    return `rgb(${r}, ${g}, ${b})`;
}

Start();
