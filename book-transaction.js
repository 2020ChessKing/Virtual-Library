import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Alert, Image, ToastAndroid, Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import MyHeader from '../header.js';
import * as firebase from 'firebase';
import db from '../config.js';

export default class BookTrans extends React.Component {
    constructor()
    {
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        BookID : '',
        StudentID : '',
        buttonState: 'normal',
        transactionMessage : '',
      }
    }

    getCameraPermissions = async (id) =>
    {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async ({type, data}) =>
    {
      const buttonState = this.state.buttonState;
      if(buttonState === 'BookID')
      {
        this.setState({
          scanned: true,
          BookID : data,
          buttonState: 'normal'
        });
      }
      else if(buttonState === 'StudentID')
      {
        this.setState({
          scanned: true,
          StudentID : data,
          buttonState: 'normal'
        });
      }
    }

    handleTransaction = async () => 
    {
      var transactionMessage;

      db.collection("books").doc(this.state.BookID).get()
      .then((doc) => {
        var book = doc.data();

        if(book.Availability)
        {
          this.issueBook();
          transactionMessage = 'Book Issued Succesfully';
          Alert.alert(transactionMessage);
          if(Platform.OS === 'iOS')
          {
            Alert.alert(transactionMessage);
          }
          else
          {
            ToastAndroid.show(transactionMessage, ToastAndroid.LONG);
          }
        }
        else
        {
          this.returnBook();
          transactionMessage = 'Book Returned Succesfully';
          Alert.alert(transactionMessage);
          if(Platform.OS === 'iOS')
          {
            Alert.alert(transactionMessage);
          }
          else
          {
            ToastAndroid.show(transactionMessage, ToastAndroid.LONG);
          }
        }

      })

      this.setState({
        transactionMessage : transactionMessage,
      })
    }

    issueBook = async () =>
    {
      db.collection('transactions').add({
        'StudentId' : this.state.StudentID,
        'BookId' : this.state.BookID,
        'date' : firebase.firestore.Timestamp.now().toDate(),
        'TransactionType' : 'issued', 
      })

      db.collection('books').doc(this.state.BookID).update({
        'Availability' : false,
      })

      db.collection('students').doc(this.state.StudentID).update({
        'BooksIssued' : firebase.firestore.FieldValue.increment(1),
      })
    }

    returnBook = async () =>
    {
      db.collection('transactions').add({
        'StudentId' : this.state.StudentID,
        'BookId' : this.state.BookID,
        'date' : firebase.firestore.Timestamp.now().toDate(),
        'TransactionType' : 'ruturned', 
      })

      db.collection('books').doc(this.state.BookID).update({
        'Availability' : true,
      })

      db.collection('students').doc(this.state.StudentID).update({
        'BooksIssued' : firebase.firestore.FieldValue.increment(-1),
      })
    }

    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== 'normal' && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style = { StyleSheet.absoluteFillObject }
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <KeyboardAvoidingView style = {styles.container} behaviour = 'padding' enabled = {true}>
            <View>
              <Image style = {{width : 200, height : 200}} source = {require('../assets/booklogo.jpg')}/>
              <MyHeader title = 'Book-Transaction'/>
            </View>

            <View style = {styles.inputView}>
              <TextInput 
                placeholder = 'Book Id' 
                value = {this.state.BookID} 
                style = {styles.inputBox} 
                onChangeText = {(data) => {this.setState({ 
                  BookID : data,
            })}}/>
              <TouchableOpacity
                onPress = {() => {this.getCameraPermissions('BookID')}}
                style={styles.scanButton}>
                <Text style={styles.buttonText}>Scan QR Code</Text>
              </TouchableOpacity>
            </View>

            <View style = {styles.inputView}>
              <TextInput 
                placeholder = 'Student Id' 
                value = {this.state.StudentID} 
                style = {styles.inputBox}
                onChangeText = {(data) => {this.setState({ 
                  StudentID : data,
              })}}/>
                <TouchableOpacity
                onPress = {() => {this.getCameraPermissions('StudentID')}}
                style={styles.scanButton}>
                  <Text style={styles.buttonText}>Scan QR Code</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress = { async () => {
              var transactionMessage = await this.handleTransaction();

              this.setState({
                BookID : '',
                StudentID : '',
              })
            }}>
              <Text>Submit</Text>
            </TouchableOpacity>
         </KeyboardAvoidingView>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 4,
      margin: 0,
    },
    buttonText:{
      fontSize: 20,
    },
    inputView:{
      flexDirection: 'row',
      margin: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20,
    },
  });