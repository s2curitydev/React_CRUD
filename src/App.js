import "./App.css";
import {useState} from 'react';


function Nav(props) {
  const lis =[  ]
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}><a id={t.id} href={"/read"+t.id} onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode(Number(event.target.id));
    }}>{t.title}</a></li>)
  }
  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  );
}

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}

function Header(props) {
  return (
    <header>
      <h1><a href="/" onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode();
      }}>{props.title}</a></h1>
    </header>
  );
}

function Create(props){
  return(
    <article>
      <h2>Create</h2>
      <form onSubmit={event=>{
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
      }}>
       <p><input type="text" name="title" placeholder="title"/></p>
        <p><textarea name="body" placeholder="body"/></p>
        <p><input type="submit" value="Create"/></p>
      </form>
    </article>
  )
}

function Update(props){
  const [title, setTitle]=useState(props.title);
  const [body, setBody]=useState(props.body);

  return(
    <article>
      <h2>Update</h2>
      <form onSubmit={event=>{
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onUpdate(title, body);
      }}>
       <p><input type="text" name="title" value={title} onChange={(event)=>{
        console.log(event.target.value);
        setTitle(event.target.value);
       }}/></p>
        <p><textarea name="body" value={body} onChange={(event)=>{
          setBody(event.target.value);
        }}/></p>
        <p><input type="submit" value="Update"/></p>
      </form>
    </article>
  )
}
function App() {
  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState(null);
  const [nextId, setNextid] = useState(4);

  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]);

  let content= null;
  let contextControl = null;

  if(mode === "WELCOME"){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  }else if(mode ==="READ"){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = 
    <>
      <li><a href={'/update'+id} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}>UPDATE</a></li> 
    <li><input type='button' value="DELETE" onClick={()=>{
      const newTopics = [];
      for(let i=0; i<topics.length;i++){
        if(topics[i].id !== id){
          newTopics.push(topics[i]);
        }
        setTopics(newTopics);
        setMode("WELCOME");
      }
    }}/></li>
    </>
  }else if(mode === "CREATE"){
    content=<Create onCreate={(_title,_body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextid(nextId+1);
    }}></Create>
  }else if(mode === "UPDATE"){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      console.log("title, body"+title,body);
      const newTopics = [...topics]
      const updatedTopic ={id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      // console.log("newTopics:"+newTopics);
      setTopics(newTopics);
      setMode("READ");
    }}></Update>
  }
  return (
    <div className="App">
      <Header title="WEB" onChangeMode={()=>{
        setMode("WELCOME");
        console.log(mode);
        }}></Header>
      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode("READ");
        setId(_id)
        console.log(mode);
      }}></Nav>
      {content}
      <ul>
        <li><a href="/create" onClick={event=>{
          event.preventDefault();
          setMode("CREATE");
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
