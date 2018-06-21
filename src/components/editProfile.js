//edit user Profile
import React, { 
  Component, 
  View, 
  Text,
  ScrollView, 
  StyleSheet, 
  TextInput, 
  Image, 
  TouchableHighlight, 
  PickerIOS
} from 'react-native';
import host from './../../constants.js';
import FBSDKLogin, { FBSDKLoginButton } from 'react-native-fbsdklogin/';
import SignIn from './signin';
import Splash from './splash';

let that;

export default class Matches extends Component {

  constructor(props){
    super(props);

    that = this;

    let urlPath;

    this.state = {
      text: "",
      education: "Loading...",
      industry: "Loading...",
      bio:"Loading...",
      picture: "http://sierrafire.cr.usgs.gov/images/loading.gif",
      age: '?'
    };
  }


  componentWillMount (props) {
    urlPath = host.SERVER_URL + '/api/users/' + this.props.profile.id;
    //need to set authorization header
    // let accessToken = JSON.stringify(this.props.access_token)
    let queryObject = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  this.props.profile.access_token
      }
    };
    fetch(urlPath, queryObject)//trim newline characters out
      .then(function(res){
        result = JSON.parse(res._bodyText)
        that.setState({
          id: result.id,
          first_name : result.first_name,
          name: result.name,
          age: result.age || 'null',
          picture: result.picture,
          gender: result.gender,
          preference: result.preference,
          bio: result.bio,
          headline: result.headline,
          education: result.education,
          industry: result.industry
        })
      })
      .catch(function(error){
        console.log(err, "error")
      });
  }

  postData() {
    let queryObject = {  
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  that.props.profile.access_token
      },
      body: JSON.stringify({
        education: that.state.education,
        industry: that.state.industry,
        bio:that.state.bio,
        age: that.state.age
      })
    };

    if(Number(that.state.age)< 18){
      alert('Sorry, you must be at least 18 for this app')
    }else{
      fetch(urlPath, queryObject)
        .then(function(res){
          console.log(res)
          styles.saved.color = 'gray'
          that.onSavePress()
        })
        .catch(function(err){
          console.log(res)
        });
    }

  }

  onSavePress(){
    this.setState({
      text:"Saved"
    });
  }

  onBioChange (bio) {
    that.setState({
      bio: bio,
      text: ""
    });
  }

  onAgeChange (age) {
    that.setState({
      age: age,
      text: ""
    });
  }

  onIndustryChange (industry) {//There is 100% a way to prevent the repetition of these functions, but i've spent 40 minutes working on it, not worth it right now.
    that.setState({
      industry: industry,
      text: ""
    });
  }

  onEducationChange (education) {
    that.setState({
      education: education,
      text: ""
    });
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.imageBox}>
          <Image style={styles.image} source={{uri:this.state.picture}}/>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.inputsBox}>
            {this.header("Works in:")}
            {this.textInput(styles.smallBox, that.onIndustryChange, that.state.industry, 50, false)}
          </View>
          <View style={styles.inputsBox}>
            {this.header("Education:")}
            {this.textInput(styles.smallerBox, that.onEducationChange, that.state.education, 50, false)} 
            {this.header("Age:")}
            {this.textInput(styles.smallestBox, that.onAgeChange, that.state.age, 2, false)}
          </View>
          <View>
            {this.header("Pick up line:", styles.pickUp, styles.pickUpHeaderText)}
            <Text></Text>
            {this.textInput(styles.bigBox, that.onBioChange, that.state.bio, 50, false)}
          </View>
        </View>
        {this.wordCount()}
        <View style={styles.buttonBox}>
          <Text style={styles.saved}>
            {this.state.text}
          </Text>
          {this.button(this.postData, 'white', styles.buttonHighlight, "Save", styles.button)}
        </View>
        <View style={styles.logout}>
          <FBSDKLoginButton
            onLoginFinished={() => {
              alert("Logged out.");
            }}
            onLogoutFinished={() => {
              this.handleLogout();  
            }}/>
        </View>
      </ScrollView>
    )
  }

  handleLogout() {
    this.props.navigator.replace({
      component: Splash
    });
  }

  header (text, additionalBoxStyling, additionalTextStyling) {
    return (
      <View style={[styles.header, additionalBoxStyling]}>
        <Text style={[styles.headerText, additionalTextStyling]}> {text} </Text>{/*I don't like "Bio". We should think of other things it could be*/}
      </View>
    );
  }

  textInput (style, onChangeText, value, maxLength, multiline) {
    return (
      <TextInput
          style={style}
          onChangeText={onChangeText}
          value={value}
          maxLength={maxLength}
          multiline={multiline}
      />
    );
  }

  button (onPress, underlayColor, highlightStyle, buttonText, textStyle) {
    return (
      <TouchableHighlight onPress={onPress} underlayColor={underlayColor} style={highlightStyle}>
        <Text style={textStyle}>
          {buttonText}
        </Text>
      </TouchableHighlight> 
    );
  }

  wordCount () {
    return (
      <View style={styles.wordCount}>
        <Text>{50 - this.state.bio.length} characters remaining</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff'
  },
  imageBox: {
    marginLeft: 20, 
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 5,
    shadowColor: "#3cae8e", 
    shadowOpacity: 1, 
    shadowRadius: 5, 
    shadowOffset: {height: 2,width: 2}
  },
  headline: {
    paddingLeft: 5,
    height: 40, 
    borderColor: '#3cae8e', 
    borderWidth: 1,
    marginRight: 50,
    marginLeft: 30,
    borderRadius: 5
  },
  infoBox: {
    marginLeft: 20, 
    marginRight: 20,
  },
  bigBox:{
    flex: 1,
    paddingLeft: 5,
    height: 25, 
    borderColor: '#3cae8e',
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: 'white',
    fontSize: 15,
    fontFamily: "HelveticaNeue-Light"  ,
  },
  smallBox:{
    flex: 1,
    height: 25,
    paddingLeft: 5,
    borderColor: '#3cae8e', 
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: 'white',
    fontSize: 15,
    fontFamily: "HelveticaNeue-Light"  
  },
  smallerBox: {
    flex:1,
    height: 25,
    width: 100,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#3cae8e',
    borderWidth: 2,
    paddingLeft: 5,
    fontSize: 15,
    fontFamily: "HelveticaNeue-Light"  
  },
  smallestBox:{
    height: 25,
    width: 50,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#3cae8e',
    borderWidth: 2,
    paddingLeft: 5,
    fontSize: 15,
    fontFamily: "HelveticaNeue-Light"  
  },
  inputsBox: {
    flexDirection:'row',
    marginTop: 5
  },
  image: {
    height: 300,
    width: 300,
    marginTop: 20,
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 20
  },
  header: {
    marginTop: 5,
    marginLeft: 2,
  },
  pickUp: {
    flexDirection: "row",
    alignSelf: 'center',
  },
  headerText: {
    fontFamily: "HelveticaNeue-Medium"
  },
  pickUpHeaderText: {
    fontSize: 25
  },
  buttonBox:{
    flexDirection: 'row',
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingRight:20,
  },
  button:{
    fontSize:15,
    fontFamily: "HelveticaNeue-Medium",
    color:'white',
    shadowRadius: 5, 
    shadowOffset: {height: 2,width: 2}
  },
  buttonHighlight: {
    borderRadius:10,
    borderWidth: 1, 
    borderColor: '#339B7E',
    padding: 10,
    backgroundColor: '##3cae8e',
  },
  wordCount: {
    alignItems: 'flex-end',
    paddingRight: 50
  },
  saved: {
    padding: 10,
    color: '#3cae8e',
    fontStyle: 'italic',
    paddingRight: 10
  },
  logout: {
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 40
  }
});





