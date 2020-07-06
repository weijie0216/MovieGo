'use strict';

import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  FlatList,
  ScrollView
} from 'react-native';

type Props = {};

class ListItem extends React.PureComponent {

  _onPress = () => {
    this.props.onPressItem(this.props.index);
  }

  render() {
    const item = this.props.item;
    return (
      <TouchableHighlight
        onPress={this._onPress}
        underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Image style={styles.thumb} source={{ uri: "https://image.tmdb.org/t/p/w200/"+item.poster_path }} />
              <Text style={styles.title}
                numberOfLines={2}>{item.title}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }
}

export default class SearchPage extends React.Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      message: '',
      data: [],
      rated: [],
    };
  }

  _onSearchTextChanged = (event) => {
    this.setState({ searchString: event.nativeEvent.text });
  };

  _executeQuery = (query) => {
    this.setState({ isLoading: true });
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.results))
      .catch(error =>
         this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
       }));
  };

  _onSearchPressed = () => {
    console.log(this.state.searchString)
    if(typeof(this.state.searchString) !== 'undefined'){
      if(Object.keys(this.state.searchString).length !== 0){
           const query = 'https://api.themoviedb.org/3/search/movie?api_key=f1b25b63c5b2b25ae4284b7073bc235e&query='+this.state.searchString;
           this._executeQuery(query);
      }else{
        alert('Please enter movie name')
      }
    }else{
        alert('Please enter movie name')
    }
  };

  _handleResponse = (response) => {
    this.setState({ isLoading: false , message: '' });
    if (response != {}) {
      this.props.navigation.navigate('Results', {listings: response})
    } else {
      this.setState({ message: 'Movie not recognized; please try again.'});
    }
  };

  _onPopular = () => {
    const url = 'https://api.themoviedb.org/3/discover/movie?api_key=f1b25b63c5b2b25ae4284b7073bc235e&sort_by=popularity.desc';
    fetch(url)
      .then(res => res.json())
      .then(json => {
        this.setState({
          data: json.results
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  _onRated = () => {
    const url = 'https://api.themoviedb.org/3/discover/movie?api_key=f1b25b63c5b2b25ae4284b7073bc235e&sort_by=vote_count.desc';
    fetch(url)
    .then(res => res.json())
    .then(json => {
      this.setState({
        rated: json.results
      });
    })
    .catch(error => {
      this.setState({ error, loading: false });
    });
  };

  _onPopularPressed = (index) => {
    var query = 'https://api.themoviedb.org/3/movie/'+this.state.data[index].id+'?api_key=f1b25b63c5b2b25ae4284b7073bc235e';
    this.setState({ isLoading: true });
        fetch(query)
          .then(response => response.json())
          .then(json => this._showDetails(json))
          .catch(error =>
             this.setState({
              isLoading: false,
              message: 'Something bad happened ' + error
           }));
  };

  _onRatedPressed = (index) => {
    var query = 'https://api.themoviedb.org/3/movie/'+this.state.rated[index].id+'?api_key=f1b25b63c5b2b25ae4284b7073bc235e';
    this.setState({ isLoading: true });
       fetch(query)
         .then(response => response.json())
         .then(json => this._showDetails(json))
         .catch(error =>
            this.setState({
             isLoading: false,
             message: 'Something bad happened ' + error
          }));
  };

  _showDetails = (response) => {
    this.setState({ isLoading: false , message: '' });
    if (response != {}) {
      this.props.navigation.navigate('Details', {listings: response})
    } else {
      this.setState({ message: 'Location not recognized; please try again.'});
    }
  };

  componentDidMount(){
    this._onPopular();
    this._onRated();
  }

  render() {
    const spinner = this.state.isLoading ?
      <ActivityIndicator size='large'/> : null;

    return (
      <View style={styles.container}>
        <View style={styles.flowRight}>
          <TextInput
            underlineColorAndroid={'transparent'}
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this._onSearchTextChanged}
            placeholder='Search via movie name'/>
          <Button
            onPress={this._onSearchPressed}
            color='#48BBEC'
            title='Go'
          />
        </View>
        <Text style={styles.titles}>{"\n"}Popular Movies</Text>
          <FlatList
            horizontal={true}
            data={this.state.data}
            renderItem={({item, index}) =>
            <ListItem
              item={item}
              index={index}
              onPressItem={this._onPopularPressed}
            />}
            keyExtractor={(item, index) => index.toString()}
          />
        <Text style={styles.titles}>{"\n"}High Rating Movies</Text>
          <FlatList
            horizontal={true}
            data={this.state.rated}
            renderItem={({item, index}) =>
            <ListItem
              item={item}
              index={index}
              onPressItem={this._onRatedPressed}
            />}
            keyExtractor={(item, index) => index.toString()}
          />
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  thumb: {
    width: 90,
    height: 120
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 5
  },
  textContainer: {
    width: 90,
    alignItems: 'center',
  },
  titles: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#656565'
  },
});