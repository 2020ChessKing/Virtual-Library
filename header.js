import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from 'react-native-elements';

const MyHeader = props => {
    return (
    <Header
        backgroundColor = '#1197D5'
        centerComponent = {{text : props.title, style : {color : 'white', fontSize : 30}}}
    />
    );
}

export default MyHeader;
