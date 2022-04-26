import React, { useState } from 'react';
import * as Progress from 'react-native-progress';
import { TouchableOpacity, Image, SafeAreaView, Text, View, FlatList } from 'react-native';
import style from '../style/PhotosList'

const PhotosList = (props) => {
  const [layout, setLayout] = useState('portrait')

  const getLoadingValue = () => {
    const totalImagesNr = props.totalImagesNr
    const processedImagesNr = props.images.length
    const comparisionsToDo = totalImagesNr * (totalImagesNr - 1) / 2

    // totalImagesNr-1 + totalImagesNr-2 + ... + totalImagesNr-processedImagesNr
    const comparisionsDone = (totalImagesNr-1 + totalImagesNr-processedImagesNr) * processedImagesNr / 2

    return comparisionsDone / comparisionsToDo
  }

  const getLoadingPercent = () => {
    const value = getLoadingValue()

    return Math.floor(value * 100).toString() + '%'
  }

  const getSimilarPhotosNr = () => {
    if (props.images.length === 0) {
      return 0
    }
    const groupsNr = props.images[props.images.length-1].groupId + 1

    return props.images.length - groupsNr
  }

  const getSavableSpaceFormatted = () => {
    const space = props.savableSpace
    if (space > 1000000000) {
      return (space / 1000000000).toFixed(2) + ' GB'
    }
    
    return (space / 1000000).toFixed(0) + ' MB'
  }

  const groupColors = ['#FD367E', '#FFF56D', '#99FFCD', '#3E4377', 
                       '#FF9900', '#125B50', '#E0D8B0', '#4700D8']
  return (
    <View style={style.container} onLayout={(event) => {
      const { width, height } = event.nativeEvent.layout
      setLayout(height > width ? 'portrait' : 'landscape')
    }}>
      <FlatList
        data={props.images ?? []}
        renderItem={({ item }) => (
          <SafeAreaView style={style.imageContainer[layout]}>
            <TouchableOpacity onPress={() => {
              props.setGroupSelected(item.groupId)
              props.navigation.navigate('Select photos')
            }}>
              <Image 
                style={{ 
                  ...style.image,
                  borderColor: groupColors[item.groupId % groupColors.length]
                }} 
                source={{ uri: item.url }} 
              />
            </TouchableOpacity>
          </SafeAreaView>
        )}
        key={'flatlist-' + layout}
        numColumns={layout === 'portrait' ? 4 : 7}
        keyExtractor={(_, index) => index}
      /> 
      <View style={getLoadingValue() == 1 ? style.footer : style.footerWithLoading}>
        {getLoadingValue() != 1 &&
          <Progress.Bar 
            progress={getLoadingValue()}
            showsText={true} 
            width={null} 
            borderRadius={0}
          />
        }
        <View style={style.footerPercentAndText}>
          { getLoadingValue() != 1 && 
            <Text style={style.footerPercent}>
              {getLoadingPercent()}
            </Text>
          }
          <Text style={style.footerText}>
            Similar photos: 
            <Text style={style.footerTextBold}>
              &nbsp;{getSimilarPhotosNr()} ({getSavableSpaceFormatted()})
            </Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

export default PhotosList;
