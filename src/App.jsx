import * as React from 'react';

const initialStories = [
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
const getAsyncStories = ()=>
  new Promise((resolve, reject)=>
    setTimeout(()=>{
      resolve({data : {stories : initialStories}})
      
    },2000)
  )

  const storiesReducer = (state, action) =>{
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
          return {
          ...state,
          isLoading: true,
          isError: false,
          };
        case 'STORIES_FETCH_SUCCESS':
          return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
          };
        case 'STORIES_FETCH_FAILURE':
          return {
          ...state,
          isLoading: false,
          isError: true,
          };
        case 'REMOVE_STORY':
          return {
          ...state,
          data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
          ),
          };
        default:
          throw new Error();
    }

  }

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
  const [stories, dispatchStories] = React.useReducer(storiesReducer ,{data : [], isLoading : false, isError : false}); 

  React.useEffect(()=>{
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    getAsyncStories().then(result => 
      { dispatchStories({
        type : "STORIES_FETCH_SUCCESS",
        payload : result.data.stories,
      });
      }).catch(()=> dispatchStories({ type: 'STORIES_FETCH_FAILURE' }))
  },[])

  const handleSearch = (event) =>{
    setSearchValue(event.target.value);
  }

  const matchStory = stories.data.filter((story) => 
    story.title.toLowerCase().includes(searchValue.toLowerCase())
  ) ;

  const handleRemoveStory = (item) => {
    dispatchStories({
    type: 'REMOVE_STORY',
    payload: item,
    });
  };
  
  return(
    <>
    
      <div>
        {stories.isError && <p>Something went wrong ...</p>}
        {(stories.isLoading) ? (<p>Loading...</p>)
        :
        (<List list={matchStory} handleDelete={handleRemoveStory}/>)
        }
        
        <InputWithLabel id= "search" value= {searchValue} onInputChange= {handleSearch}>
        Search : 
        </InputWithLabel> 
      </div>
    </>
  )
}

const List = ({list, handleDelete})=> 
    <>
      <ul>
          {list.map((item)=>
              <Item key={item.objectID} item={item} handleDelete={handleDelete}/>
          )}
        </ul>    
    </>

const Item = ({item, handleDelete})=>{
  
  return(
  <>
    <li>
        <span><a  href={item.url}> {item.title} </a></span>
        <span><p>Author : {item.author}</p></span>
        <span>No of comments : {item.num_comments}</span>
        <span><p>Points : {item.points}</p></span>
        <span><button onClick={()=>handleDelete(item)}>Delete Story</button></span>
    </li>
  </>
  )
}

const InputWithLabel = ({id, children, value, onInputChange, type = "text"}) => 
  (
    <>
      <label htmlFor={id} > {children} </label>
      <input type={type} id={id} value={value} onChange={onInputChange}/>
    </>
  )  

export default App;