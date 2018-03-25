import React, { Component } from 'react'
import { Text, View, TouchableHighlight, Alert, Dimensions } from 'react-native'
import Expo from 'expo'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from 'react-native-chart-kit'
import { List, ListItem } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import axios from 'axios'

import {SpeechList} from '../components'
import styles from '../../assets/stylesheet'
import API_ROOT from '../../IP_addresses'
import ReplayAudio from '../components/ReplayAudio'

// import { List, ListItem } from 'react-native-elements'
let soundObject

export default class SingleReport extends Component {
  static navigationOptions = {
    title: 'SingleReport',
  };

  constructor(props) {
    super(props)
    this.state = {
        speechId: this.props.navigation.state.params.speechId,
        awsData: null,
        playing: false,
        started: false,
    }
  }

  componentDidMount() {
    axios.get(`${API_ROOT}/api/speech/aws-data/${this.state.speechId}`)
    .then(res => res.data)
    .then((awsData) => {
      this.setState({
        awsData
      })
    })
  }

  _playAudio = async () => {
    soundObject = new Expo.Audio.Sound()

    try {
      await soundObject.loadAsync({ uri: `${this.state.awsData.url}`})
      await soundObject.playAsync()
    } catch (error) {
        console.log(error)
    }
    this.setState({playing: true, started: true})
    this.setState(this.state)
  }

  forceChange(){
    this.setState({working: !this.state.working})
 }
  _pauseAudio = async () => {
    let playing = this.state.playing

    if (playing) {
      this.setState({playing: false})
      try {
        await soundObject.pauseAsync()
      } catch (error) {
        console.log(error)
      }
    } else {
      this.setState({playing: true})
      await soundObject.playAsync()
    }
  }
  _replayAudio = async () => {
    let playing = this.state.playing

    if (playing) {
      this.setState({playing: false})
      try {
        await soundObject.replayAsync()
        soundObject.playAsync()
      } catch (error) {
        console.log(error)
      }
    } else {
      this.setState({playing: true})
      await soundObject.replayAsync()
      await soundObject.playAsync()
    }
  }


  render() {
    // console.log('DATA IS', this.state.awsData)
    // console.log('asfdasfas', this.props.navigation.state.params)
    return (
    <View style={styles.resultsContainer}>
      {this.state.speechId &&
        <View style={styles.resultsContainer}>
          <SpeechList speechId={this.state.speechId} />
        </View>
      }

      <View style={styles.resultsBottomContainer}>
        <ReplayAudio start={this.state.start} playing={this.state.playing} replayAudio={this._replayAudio.bind(this)} pauseAudio={this._pauseAudio.bind(this)} playAudio={this._playAudio.bind(this)} />
        <View style={{flex: 1}}>
        {/* { this.state.speechId &&
          // <Text style={{color: 'white', fontSize: 30}}> {this.props.navigation.state.params.speech.transcript} </Text>
        } */}
        </View>
      </View>
    </View>
    )
  }
}

{/* <BarChart
data={{
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [{
    data: [ 20, 45, 28, 80, 99, 43 ]
  }]
}}
width={Dimensions.get('window').width}
height={220}
chartConfig={{
  backgroundColor: 'red',
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'lightgrey',
  marginRight:20,
  paddingRight:20,
  marginLeft:-20,
  paddingLeft:-20,
  color: (opacity = 1) => `#12092f`,
  style: {
    borderRadius: 16,
    marginRight:20,
    marginLeft:-20,
  paddingLeft:-20,
  paddingRight:20,
  }
}}
style={{
  marginVertical: 8,
  borderRadius: 16,
  marginRight:20,
  paddingRight:20,
  // marginLeft:-5,
  // paddingLeft:-5,
}}        /> */}
