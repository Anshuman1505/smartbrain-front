import React,{Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Signin from './components/Signin/Signin.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Logo from './components/Logo/Logo.js';
import Register from './components/Register/Register.js';

import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import 'tachyons';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';

const app = new Clarifai.App({
 apiKey: 'c85cea2c606044d3aa40bbdac9879e7f'
});
const particlesOption = {
    
     particles: {
      number:{
        value:150,
        density:{
          enable:true,
          value_area:800
        }
      }
  }                                  
}
const initialstate = {
        
      input : "",
      imageurl:"",
      box :{},
      route:'signin',
      isSignedin:false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
    }

}
class App extends Component {
  constructor(){
    super();
    this.state = initialstate;
  }
  loadUser = (data)=>{
    this.setState({user:{
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined:data.joined
    }})
  }
 
  calculatefacelocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
        leftCol: clarifaiFace.left_col * width,
        topRow:clarifaiFace.top_row * height,
        rightCol:width - (clarifaiFace.right_col*width),
        bottomRow:height - (clarifaiFace.bottom_row*height)
    }
  }
  
  displayFaceBox = (box)=>{
    console.log(box);
    this.setState({box:box});
  }
  
  onInputchange = (event)=>{
    this.setState({input: event.target.value});
    //console.log(this.state.input);
  }

  onButtonsubmit = () =>{
    this.setState({imageurl:this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL,
     this.state.input).then(response =>{
      // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      if(response){
        fetch('https://morning-cliffs-75645.herokuapp.com/image',{
          method:'put',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            id:this.state.user.id
          })
        }).then(response=>response.json())
          .then(count=>{
            this.setState(Object.assign(this.state.user,{entries:count}))

      })
    }
     this.displayFaceBox(this.calculatefacelocation(response))
    }).catch(err=>console.log(err))
      
}
  onRouteChange = (route) =>{
    if(route==='signout'){
      this.setState(initialstate)
    }else if(route==='home'){
      this.setState({isSignedin:true})
    }
    this.setState({route:route});
  }
  
  render(){
      return (
      <div className="App">
        <Particles className="particles"
          params={particlesOption}
          />
        <Navigation isSignedin = {this.state.isSignedin} onRouteChange = {this.onRouteChange} />
        { this.state.route==='home'
        ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm 
            onInputchange = {this.onInputchange}
            onButtonsubmit = {this.onButtonsubmit}
            />  
              <FaceRecognition box = {this.state.box} imageurl = {this.state.imageurl}/>
          </div> : (
            this.state.route==='signin'?
          <Signin loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/> :
          <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
