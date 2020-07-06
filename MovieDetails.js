'use strict';

import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
  ScrollView,
  FlatList
} from 'react-native';

type Props = {};

class ListItem extends React.PureComponent {

  render() {
    const item = this.props.item;
    return (
        <View style={styles.textContainer}>
          <Text style={styles.genre}> {item.name} |</Text>
        </View>
    );
  }
}

export default class MovieDetails extends Component<Props> {
  constructor(props) {
      super(props);

      this.state = {
        data: [],
      };
    }

  componentDidMount(){
    const item = this.props.route.params.listings;
    this.setState({
        data: item.genres
      });
  }

  render() {
    const item = this.props.route.params.listings;
    var runhours = parseInt(item.runtime/60)
    var runmins = item.runtime%60

    return (
        <ScrollView>
          <View style={styles.releaseContainer}>
            <Text style={styles.release}>{item.status}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: "https://image.tmdb.org/t/p/w200/"+item.poster_path }} />
            <View style={styles.textContainer}>
              <Text style={styles.title}
                numberOfLines={3}>{item.title}</Text>
              <Text style={styles.runtime}>{runhours}h {runmins}m</Text>
            </View>
          </View>
          <FlatList
              horizontal={true}
              data={this.state.data}
              renderItem={({item, index}) =>
              <ListItem
                item={item}
                index={index}
              />}
              keyExtractor={(item, index) => index.toString()}
            />
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <View style={styles.separator}/>
              <Text style={styles.content}>Release Date: {item.release_date}</Text>
              <Text style={styles.content}>Language: {item.original_language}</Text>
              <Text style={styles.content}>Popularity: {item.popularity}</Text>
              <Text style={styles.content}>Rating: {item.vote_average}/10 ({item.vote_count} votes)</Text>
              <View style={styles.separator}/>
              <Text style={styles.overview}>{item.overview}</Text>
            </View>
          </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  releaseContainer: {
    margin: 10,
    padding: 5,
    backgroundColor: '#48BBEC',
    alignItems: 'center'
  },
  release: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#656565'
  },
  thumb: {
    width: 90,
    height: 120,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 3,
    backgroundColor: '#dddddd',
    marginTop: 10,
    marginBottom: 10
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#656565'
  },
  runtime: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#48BBEC'
  },
  genre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#656565'
  },
  content: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#48BBEC',
  },
  overview: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
});
