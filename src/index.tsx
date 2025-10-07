import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import axios from 'axios';

export interface beanData {
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
let groupNames : Set<string> = new Set();
let colorGroups : Set<string> = new Set();


export function getGroupNames() : string[] {
  return Array.from(groupNames).sort();
}

export function getColorGroups() : string[] {
  return Array.from(colorGroups).sort();
}

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

    allBeans.forEach((item) => {
      item.groupName.forEach((name) => {
        groupNames.add(name);
      })
      colorGroups.add(item.colorGroup);
    })

  });

  return [];
}


//True -> Descending
//sortBy = [id, name]
export function listFilter(searchInput : string, sortBy : string, descend : boolean) : beanData[] {
  let lst : beanData[] = [];

  allBeans.forEach(item => {
    if (item.flavorName.substring(0, searchInput.length).toLocaleLowerCase() == searchInput.toLocaleLowerCase()) {
      lst.push(item);
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

  allBeans.forEach(item => {
    let valid = true;
    for (let i = 0; i < attributes.length; i++) {
      if (Array.isArray(values[i])) {
        for (let j = 0; j < values[i].length; j++) {
          let item2 = values[i][j];
          if (!((item[attributes[i]] as string[]).includes(item2))) {
            valid = false;
          }
        }
      } else if (values[i] == ''){
        continue;
      } else if (item[attributes[i]] != values[i]) {
        valid = false;
        break;
      }
    }

    if (valid) {
      lst.push(item);
    }
  });

  return lst;
}

export function updateDetailColor(color : string, main : boolean) {
  let navBar = document.getElementsByClassName('navBar')[0] as HTMLElement;
  let navBarText = document.getElementsByClassName('navBarText');
  
  navBar.style.color = color;

  let darker = changeColor(navBar.style.color, 50);
  let lighter = changeColor(navBar.style.color, -50);

  if (main) {
    darker= 'rgb(222, 184, 135)';
    lighter = 'rgb(245, 245, 220)';
  }

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
