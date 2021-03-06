import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TopBarTextExample from './src/TopBarTextExample';
import TopBarIconExample from './src/TopBarIconExample';
import TopBarIconTextExample from './src/TopBarIconTextExample';
import BottomBarIconExample from './src/BottomBarIconExample';
import BottomBarIconTextExample from './src/BottomBarIconTextExample';
import NoAnimationExample from './src/NoAnimationExample';
import ScrollViewsExample from './src/ScrollViewsExample';
import CoverflowExample from './src/CoverflowExample';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  example: {
    elevation: 4,
  },
  statusbar: {
    backgroundColor: '#2196f3',
    height: Platform.OS === 'ios' ? 20 : 0,
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 44 : 56,
    backgroundColor: '#2196f3',
    elevation: 4,
  },
  title: {
    flex: 1,
    margin: 16,
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    fontSize: Platform.OS === 'ios' ? 20 : 18,
    color: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 56,
    padding: Platform.OS === 'ios' ? 12 : 16,
  },
  touchable: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .06)',
  },
  item: {
    fontSize: 14,
    color: '#333',
  },
});

const PERSISTENCE_KEY = 'index_persistence';

export default class ExampleList extends Component {
  state = {
    title: 'Examples',
    index: -1,
    items: [
      'Text only top bar',
      'Icon only top bar',
      'Icon + Text top bar',
      'Icon only bottom bar',
      'Icon + Text bottom bar',
      'No animation',
      'Scroll views',
      'Coverflow',
    ],
    restoring: false,
  };

  componentWillMount() {
    this._restoreNavigationState();
  }

  _persistNavigationState = async (currentIndex: number) => {
    await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(currentIndex));
  };

  _restoreNavigationState = async () => {
    this.setState({
      restoring: true,
    });

    const savedIndexString = await AsyncStorage.getItem(PERSISTENCE_KEY);

    try {
      const savedIndex = JSON.parse(savedIndexString);
      if (typeof savedIndex === 'number' && !isNaN(savedIndex)) {
        this.setState({
          index: savedIndex,
        });
      }
    } catch (e) {
      // ignore
    }

    this.setState({
      restoring: false,
    });
  };

  _handleNavigate = index => {
    this.setState({
      index,
    });
    this._persistNavigationState(index);
  };

  _handleNavigateBack = () => {
    this._handleNavigate(-1);
  };

  _renderItem = (title, i) => {
    return (
      <TouchableOpacity
        key={i}
        style={styles.touchable}
        onPress={() => this._handleNavigate(i)}
      >
        <Text style={styles.item}>{i + 1}. {title}</Text>
      </TouchableOpacity>
    );
  };

  _renderExample = i => {
    switch (i) {
    case 0:
      return <TopBarTextExample style={styles.example} />;
    case 1:
      return <TopBarIconExample style={styles.example} />;
    case 2:
      return <TopBarIconTextExample style={styles.example} />;
    case 3:
      return <BottomBarIconExample />;
    case 4:
      return <BottomBarIconTextExample />;
    case 5:
      return <NoAnimationExample />;
    case 6:
      return <ScrollViewsExample style={styles.example} />;
    case 7:
      return <CoverflowExample />;
    default:
      return null;
    }
  }

  render() {
    if (this.state.restoring) {
      return null;
    }

    const { index, items } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#1b7dcb' />
        <View style={styles.statusbar} />
        <View style={styles.appbar}>
          {index > -1 ?
            <TouchableOpacity style={styles.button} onPress={this._handleNavigateBack}>
              <Image source={require('./assets/back-button.png')} />
            </TouchableOpacity> : null
          }
          <Text style={styles.title}>
            {index > -1 ? items[index] : this.state.title}
          </Text>
          {index > -1 ? <View style={styles.button} /> : null}
        </View>
        {index === -1 ? (
          <ScrollView>
            {items.map(this._renderItem)}
          </ScrollView>
        ) : this._renderExample(index)}
      </View>
    );
  }
}

AppRegistry.registerComponent('tabviewexample', () => ExampleList);
