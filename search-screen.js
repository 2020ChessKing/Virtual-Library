import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MyHeader from '../header.js';

export default class Search extends React.Component
{
  render(){
    return (
      <View>
        <MyHeader title = 'Search'/>
        <Text style = {{textAlign : 'center'}}>SearchApp here!</Text>
      </View>
    );
  }
}