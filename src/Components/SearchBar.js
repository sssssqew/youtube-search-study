import React, { Component } from 'react';
import  { AutoComplete, Button, Icon } from 'antd';
const Option = AutoComplete.Option;
class SearchBar extends Component {

    state = {
      videos: []
    };

    componentDidUpdate( prevProps ) {
      if( this.props.video && prevProps.video !== this.props.video ) {
          this.setState({ videos: this.props.videos })
      }
    }

	// 유저가 검색시 실시간 목록으로 뜨는 비디오 중에서 하나를 선택하면 selectedVideo 상태를 업데이트하는 함수
    onSelect = (value, index ) => {
        let val = parseInt(index.key, 10);
        this.props.handleSearch( val );
    };

    render() {
        return(
            <div style={{ "textAlign": "center", "background": "#123456", "padding": "35px" }}>
                <AutoComplete
                    size={"large"}
                    style={{ width: 400 }}
                    onSelect={ this.onSelect }
                    onChange={ this.props.onChange }
                    placeholder="Search Video"
                >
		            {/* 검색할 때 아래에 실시간 검색목록을 보여줌 */}
                    { this.state.videos.map((video, index)  => <Option key={ index } >{ video.snippet.title }</Option> ) }
                }
                </AutoComplete>
                <Button style={{ "marginLeft":"5px" }} size={"large"}><Icon type={"search"}/></Button>
            </div>
        );
    }
}

export default SearchBar;