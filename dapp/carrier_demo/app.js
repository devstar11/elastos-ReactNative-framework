import React, {Component} from 'react';

import {AppRegistry, StyleSheet, View, Image, ActionSheetIOS, NativeModules} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Text } from 'native-base';

import dapp from '../shared/dapp';

import {plugin} from 'CR';
const Carrier = plugin.Carrier;


class App extends Component{
  constructor(){
    super();
    this.state = {
      log : [],
      error : ''
    };

    this.carrier = null;
  }
  render() {
    return (
      <Content style={styles.container}>
        <Text style={styles.log}>{this.state.log.join('\n')}</Text>
        <Text style={styles.error}>{this.state.error}</Text>

        <Button style={styles.btn} success block onPress={this.testFn.bind(this, 'getVersion')}>
          <Text>getVersion</Text>
        </Button>
        <Button style={styles.btn} success block onPress={this.testFn.bind(this, 'isValidAddress')}>
          <Text>isValidAddress</Text>
        </Button>
        <Button style={styles.btn} success block onPress={this.testFn.bind(this, 'getAddress')}>
          <Text>getAddress</Text>
        </Button>
        <Button style={styles.btn} success block onPress={this.testFn.bind(this, 'setSelfInfo')}>
          <Text>setSelfInfo</Text>
        </Button>
        <Button style={styles.btn} success block onPress={this.testFn.bind(this, 'getSelfInfo')}>
          <Text>getSelfInfo</Text>
        </Button>
        <Button style={styles.btn} success block onPress={this.testFn.bind(this, 'addFriend')}>
          <Text>addFriend</Text>
        </Button>
        
      </Content>
    );
  }

  async testFn(name){
    let rs = null;
    switch(name){
      case 'getVersion':
        rs = await Carrier.getVersion();
        break;
      case 'isValidAddress':
        rs = await Carrier.isValidAddress('aaabbb');
        break;
      case 'getAddress':
        rs = await this.carrier.getAddress();
        break;
      case 'setSelfInfo':
        const info = {
          name : 'bbb',
          email : 'aaa@bbb.com',
          phone : '123456',
          description : 'bbbbb',
          region : 'cccc',
          gender : 'male'
        };
        rs = await this.carrier.setSelfInfo(info);
        break;
      case 'getSelfInfo':
        const tmp = await this.carrier.getSelfInfo();
        rs = JSON.stringify(tmp);
        break;
      case 'addFriend':
        try{
          rs = await this.carrier.addFriend('Dg3h2TecXGzBU5NruvdYaMJoCdxGc3etPmJ6GVynKpLUm1whnQyE', 'hello');
          console.log(rs);
        }catch(e){
          this.setError(e);
        }
        break;
    }
    if(rs || _.isString(rs)){
      this.setLog(rs.toString());
    }
    
  }

  setLog(log){
    const mlog = this.state.log;
    mlog.unshift(log)
    this.setState({log : mlog});
  }
  setError(error){
    this.setState({error});
  }

  async componentDidMount(){
    this.carrier = new Carrier('carrier_demo', {
      onReady : ()=>{
        this.setLog('carrier is ready');
      },
      onConnection : (status)=>{
        this.setLog('carrier connection status : '+Carrier.config.CONNECTION_STATUS[status]);
      },
      onFriends : (list)=>{
        this.setLog('carrier connection status : '+JSON.stringify(list));
      },
    });
    await this.carrier.start();
    this.setLog('carrier init success');
  }
    
      
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 50
    },
    btn : {
      marginTop: 12
    },
    log : {
      backgroundColor: '#000',
      color: 'green',
      fontSize:14, 
      width:"100%"
    },
    error : {
      marginTop: 10,
      backgroundColor: '#000',
      color: 'red',
      fontSize:14, 
      width:"100%"
    }
  });

dapp.start(App);