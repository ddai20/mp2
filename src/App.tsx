import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";
import './App.scss';
import {listFilter, galleryFilter, updateDetailColor, getColorGroups, getGroupNames} from './index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Select, { MultiValue, SingleValue } from 'react-select';

function App() {
  return (
    <BrowserRouter basename='/mp2'>
      <div>
        <div className='navBar'>
          <Link to='../' className='navBarText'> <b>List View</b> </Link>
          <Link to='../gallery' className='navBarText'> <b>Gallery View</b> </Link>
        </div>
        <Routes>
          <Route path= '/' element={<ListView/>}/>
          <Route path= '/gallery' element={<Galleryview/>}/>
          <Route path='/:id' element={<DetailView/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Galleryview() {
  const[colorGroup, newColor] = useState('');
  const[groupNames, newNames] = useState([] as string[]);

  useEffect(() => updateDetailColor('rgb(222, 184, 135)', true))

  function changeColorGroup(event : SingleValue<{value: string;label: string;}>) {
    console.log("hello");
    if (event == null) {
      newColor('');
    } else {
      newColor(event.value);
    }
  }

  function changeGroupName(event : MultiValue<{value: string;label: string;}>) {
    if (event == null) {
      newNames([]);
    } else {
      newNames(Array.from(event.map((item) => item.value)));
    }
  }

  return(
    <div className='galleryView'>
      <h1> Jelly Bean Gallery</h1>
      <h2> Filter Options</h2>
      <div className='groupingBox'>
        <div className='groupInput'>
          <p>Group Color: </p>
            <Select
              isClearable
              options = {getColorGroups().map((item) => ({'value': item, 'label' : item}))}
              onChange={(event) => changeColorGroup(event)}
            />
        </div>
        <div className='groupInput'>
          <p>Group Name: </p>
          <Select
            isMulti
            options = {getGroupNames().map((item) => ({'value': item, 'label' : item}))}
            onChange={(event) => changeGroupName(event)}
          />
        </div>
      </div>
      <div className='galleryEntryBox'>
        {galleryFilter(['colorGroup','groupName'], [colorGroup,groupNames]).map((item) => 
          (<Link className='galleryLink' to={`../${item.beanId}`}>
            <div className='galleryEntries'>
              <div>
                <img alt="Bean" src={item.imageUrl} className='galleryImage'></img>
              </div>
              <h3>{item.flavorName}</h3>
              <div>
                {item.description}
              </div>
            </div>
          </Link>
          ))}
      </div>

    </div>
  )
}


function ListView() {
  const [currSearch, nextSearch] = useState("");
  const [sortBy, newSort] = useState('beanId');
  const [descend, newDescend] = useState(false);

  useEffect(() => updateDetailColor('rgb(222, 184, 135)', true))

  let beanList = listFilter(currSearch, sortBy, !descend);

  return (
  <div className='listView'>
    <h1> Jelly Bean List </h1>
    <div className='listBox'>
      <input type='text' name="searchBar" onInput={(event) => {nextSearch(event.currentTarget.value);}} placeholder='Search for a bean!' className='searchInput'/>
      <div className='listParametersBox'>
        <div>
          <h3>Sort By: </h3>
          <select name='sorting selection' onChange={(event) => newSort(event.currentTarget.value)}>
            <option value='beanId'>ID</option>
            <option value="flavorName">Name</option>
          </select> 
        </div>
        <div>
          <h3>Direction: </h3>
          <select name='direction selection' onChange={(event) => newDescend(event.currentTarget.value === 'true')}>
            <option value='false'>Ascending</option>
            <option value="true">Descending</option>
          </select>
        </div> 
      </div>
      <div className='listEntryBox'>
        {beanList.map((item) =>
          (<div className='listEntry'>
            <img alt="Bean" src={item.imageUrl} className='listImage'></img>
              <Link className='listText' to={`../${item.beanId}`}> {item.flavorName}</Link>
          </div>)
        )}
      </div>
    </div>
  </div>);
}

function DetailView() {
  let params = useParams();
  const [currId, nextId] = useState(params.id);

  let currBean = galleryFilter(['beanId'],[currId])[0];

  console.log(currBean);

  useEffect(() => {
    updateDetailColor(currBean.backgroundColor, false);
  });

  let groupNameFormatted = "";

  currBean.groupName.forEach(item => groupNameFormatted += item + ", ");
  groupNameFormatted = groupNameFormatted.substring(0,groupNameFormatted.length - 2);

  let ingredientsFormatted = "";

  currBean.ingredients.forEach(item => ingredientsFormatted += item + ", ");
  ingredientsFormatted = ingredientsFormatted.substring(0,ingredientsFormatted.length - 2);

  if (currId === undefined) {
    return <div></div>;
  }

  let nextPath = Math.min(114,(parseInt(currId) + 1)).toString();
  let prevPath = Math.max(1,parseInt(currId) - 1).toString();

  return (
      <div className='detailView'>
        <Link to={`../${prevPath}`} onClick={() => nextId(prevPath)} className='detailArrow' title='Previous Item'> <FontAwesomeIcon icon={faChevronLeft} size='5x' /> </Link>
        <div className='detailBox'>
          <h1>{currBean.flavorName}</h1>
          <img alt="Bean" className='detailImage' src={currBean.imageUrl}></img>
          <p> {currBean.description}</p>
          <div>
            <h2> Group Name</h2>
            <p>{groupNameFormatted}</p>
          </div>
          <div className='baseInfo'>
            <div>
              <h3>Color Group: <i>{currBean.colorGroup}</i></h3>
              <h3>Gluten Free: <i>{currBean.glutenFree.toString()}</i></h3>
            </div>
            <div>
              <h3>Sugar Free: <i>{currBean.sugarFree.toString()}</i></h3>
              <h3>Kosher: <i>{currBean.kosher.toString()}</i></h3>
            </div>
          </div>
          <div>
            <h2>Ingredients</h2>
            <p>{ingredientsFormatted}</p>
          </div>
          <div>
            <h3>ID: <i>{currBean.beanId}</i></h3>
          </div>
        </div>
        <Link to={`../${nextPath}`} onClick={() => nextId(nextPath)} className='detailArrow' title='Previous Item'> <FontAwesomeIcon icon={faChevronRight} size='5x' /> </Link>
      </div>);
}



export default App;
