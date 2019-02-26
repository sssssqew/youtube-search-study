import React, { Component } from 'react';
import SearchBar from './Components/SearchBar';
import VideoList from './Components/VideoList';
import VideoDetails from './Components/VideoDetails';
import YTSearch from 'youtube-api-search';
import './App.css';
import { Icon, notification } from 'antd';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.REACT_APP_API_KEY;
console.log(API_KEY);

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      videos: [],
      search: true,
      selectedVideo: {}
    };
    this.welcome();
  }

  welcome = () => {
    notification.open({
      message: 'Hey nice to see you here',
      description:'Let us start by searching for some videos',
      icon: <Icon type="smile" style={{ color: '#108ee9' }} />
    })
  };

  videoSearch( term ) {
    if(this.state.search){
      YTSearch({ key: API_KEY, term }, (data) => {
        try{
          if(data && data.data && data.data.error.message){
            console.log(data);
            throw ('error')
          }
          this.setState({ videos: data, selectedVideo: data[0] });
          console.log(this.state.videos);
        }catch(err){
          notification['error']({
            message: "Daily Limit Exceeded",
            description: "Youtube data API daily limit have exceeded. Quota will be recahrged at 1:30pm IST. Wait till then.",
          })
        }
      });
    }
  }

  // SearchBar에서 검색하면 여기서(부모 컴포넌트 App.js의 videoSearch함수) videos와 selectedVideo 상태를 변경한 다음
  // SearchBar로 비디오 목록(videos)을 넘겨줌
  handleChange = (value) => {
    console.log(value);
    setTimeout( () => {
      if(value === ''){
        this.setState({ videos: [], selectedVideo: null});
        return;
      }
      if(this.state.search){
        this.videoSearch(value);
      }
      setTimeout( () => {
        this.setState({ search: true });
      }, 5000);
    }, 2000);
  }

  render() {
    return (
      <div style={{ "display": "flex", "flexDirection": "column" }}>
        <div style={{ "display": "flex", "justifyContent": "spaceBetween", "background": "#123456" }}>
          <h1 style={{ "color": "#fff", "alignSelf": "center", "flexBasis": "4", "paddingTop": "20px", "paddingLeft": "30px" }}>YTSearch <Icon type={"search"}/></h1>
          <SearchBar videos={ this.state.videos } video={ this.state.selectedVideo } onChange={this.handleChange}
          /* 유저가 검색할때 아래에 뜨는 실시간 목록중에 특정 비디오를 클릭하면 아래 함수가 실행됨 */
          // 유저가 클릭한 비디오로 selectedVideo 상태를 업데이트함
          // 결과적으로 검색창 아래에 뜨는 실시간 비디오 목록 중에서 하나를 선택하면 왼쪽의 VideoDetails 컴포넌트가 업데이트됨
          handleSearch={ (video) => { this.setState({ selectedVideo: this.state.videos[video], search: false }) }}/>
        </div>
        <div style={{ "display": "flex"}}>
          <VideoDetails video={ this.state.selectedVideo }/>
          <VideoList videos={this.state.videos}
          // onVideoSelect 에 this와 index를 바인딩해서 VideoListItem 컴포넌트로 들어감
          // index === userSelected
          // 결과적으로 아래 함수를 실행하면 오른쪽 비디오 목록 중에서 하나를 클릭하면 왼쪽의 VideoDetails 컴포넌트가 업데이트됨
            onVideoSelect={ (userSelected ) => { this.setState({ selectedVideo: this.state.videos[userSelected] }) }}/>
        </div>
      </div>
    );
  }
}

export default App;
