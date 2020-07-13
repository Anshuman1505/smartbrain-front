import React from 'react';
class Register extends React.Component{
	constructor(props){
		super(props);
		this.state={
			email:"",
			password: "",
			name:""
		}
	}
	onNamechange = (event)=>{
		this.setState({name:event.target.value})
	}
	
	onEmailchange = (event)=>{
		this.setState({email:event.target.value})
	}
	onPasswordChange = (event)=>{
		this.setState({password:event.target.value})
	}
	onSubmitRegister = ()=>{
		//console.log(this.state);
		fetch('https://morning-cliffs-75645.herokuapp.com/register',{
			method:'post',
			headers:{'Content-Type':'application/json'},
			body:JSON.stringify({
				email:this.state.email,
				password:this.state.password,
				name:this.state.name
			})
		}).then(response=>response.json())
			.then(user=>{
				if(user.id){
					this.props.loadUser(user)
					this.props.onRouteChange('home');
				}
				else{

				}
			})
		
	}
	render(){
		return(
			<article className="br3 ba shadow-5 b--black-10 mv4 w-100 w-50-m w-25-l mw6 center">
				<main className="pa4 black-80">
					<div className="measure">
				    	<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
					      <legend className="f1 fw6 ph0 mh0">Register</legend>
					      <div className="mt3">
					        <label className="db fw6 lh-copy f6" htmlfor="name">Name</label>
					        <input onChange = {this.onNamechange}
					        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
					        type="text" name="name"  id="name"/>
					      </div>
					      <div className="mt3">
					        <label 
					        className="db fw6 lh-copy f6" htmlfor="email-address">Email</label>
					        <input onChange = {this.onEmailchange}
					        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
					        type="email" name="email-address"  id="email-address"/>
					      </div>
					      
					      <div className="mv3">
					        <label className="db fw6 lh-copy f6" htmlfor="password">Password</label>
					        <input onChange = {this.onPasswordChange}
					        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
					        type="password" name="password"  id="password"/>
					      </div>
					    </fieldset>
				    	<div className="">
				      		<input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
				      		type="submit" onClick = {this.onSubmitRegister} value="Register"/>
				 		</div>
	  				</div>
				</main>
			</article>
		);
	}	
}
export default Register;