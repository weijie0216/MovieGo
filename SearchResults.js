'use strict';

import React, { Component, PureComponent } from 'react'
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  FlatList,
  Text,
} from 'react-native';

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
            <Image style={styles.thumb} source={{ uri: "https://image.tmdb.org/t/p/w200/"+item.poster_path }} />
            <View style={styles.textContainer}>
              <Text style={styles.title}
                numberOfLines={2}>{item.title}</Text>
              <Text style={styles.rating}>Rating: {item.vote_average}/10</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }
}

type Props = {};
export default class SearchResults extends React.Component<Props> {

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item, index}) => (
    <ListItem
      item={item}
      index={index}
      onPressItem={this._onSearchPressed}
    />
  );

  _onSearchPressed = (index) => {
    var query = 'https://api.themoviedb.org/3/movie/'+this.props.route.params.listings[index].id+'?api_key=f1b25b63c5b2b25ae4284b7073bc235e';
    this.setState({ isLoading: true });
      fetch(query)
        .then(response => response.json())
        .then(json => this._handleResponse(json))
        .catch(error =>
           this.setState({
            isLoading: false,
            message: 'Something bad happened ' + error
        }));
  };

  _handleResponse = (response) => {
    this.setState({ isLoading: false , message: '' });
    if (response != {}) {
      this.props.navigation.navigate('Details', {listings: response})
    } else {
      this.setState({ message: 'Location not recognized; please try again.'});
    }
  };

  _onPressItem = (index) => {
    console.log("Pressed row: "+index);
  };

  render() {
    const { params } = this.props.route;
    return (
      <FlatList
        data={params.listings}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 110,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rating: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
});

