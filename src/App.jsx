import * as React from 'react';

const isLoggedIn = true;

const App = () => {

  const useStorageState = (key, initialState) =>{
    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialState
    );

    React.useEffect(() =>{
    localStorage.setItem(key , value);
    }, [key, value]);

    return [value, setValue]
  };

   const [searchValue, setSearchValue] = useStorageState('search', 'React');

  

  const handleSearch = (event) =>{
    setSearchValue(event.target.value);
  }

  const stories = [
    {
    title: 'React',
    url: 'https://react.dev/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
    },
    {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
    },
  ];

  const matchStory = stories.filter((story) => 
    story.title.toLowerCase().includes(searchValue.toLowerCase())
  ) ;
  
  return(
    <>
    
      <div>
        <List list={matchStory}/>
        <Search search= {searchValue}  onSearch= {handleSearch}/>
      </div>
    </>
  )
}

const List = ({list})=> 
    <>
      {isLoggedIn ? 
          <ul>
            {list.map(({objectID, ...item})=>
              <Item key={objectID} {...item}/>
            )}
          </ul> : "Plz log in"}
         
    </>

const Item = ({title, url, author, num_comments, points})=>
  <>
    <li>
        <span><a  href={url}> {title} </a></span>
        <span><p>Author : {author}</p></span>
        <span>No of comments : {num_comments}</span>
        <span><p>Points : {points}</p></span>
    </li>
  </>


const Search = ({search , onSearch}) => 
  (
    <>
      <label htmlFor="search">Search: </label>
      <input type="text" id="search" value={search} onChange={onSearch}/>
    </>
  )  


export default App;
