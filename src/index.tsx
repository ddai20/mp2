import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import axios from 'axios';
import { strict } from 'assert';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function Start() : any[] {
  axios.get('https://jellybellywikiapi.onrender.com/api/beans',{
    responseType: 'stream',
    params: {pageIndex: 1, pageSize: 114},
  }).then(function(response) {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    return JSON.parse(response.data).items;
  });

  return [];
}


//True -> Descending
//sortBy = [id, name]
function listFilter(beanData : any[], searchInput : any, sortBy : string, descend : boolean) : Array<Object> {
  let lst : Array<Object> = [];

  beanData.forEach(element => {
    if (element.flavorName.substring(0, searchInput.length) == searchInput) {
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

function galleryFilter(beanData : any[], attributes : string[], values : any[]) : Array<Object> {
  let lst : Array<Object> = [];

  beanData.forEach(element => {
    for (let i = 0; i < attributes.length; i++) {
      if (element[attributes[i]] == values[i]) {
        lst.push(element);
      }
    }
  });

  return lst;
}

Start();