import React from 'react';

class SortBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortType: this.props.sortType
        }
    }

    handleClick(index) {
        this.setState({ sortType: index });
        this.props.handleSort(index);
    }

    render() {
        let sortBtns = ['距离最近', '评分最高', '价格最低'].map((sort, index) => {
            let isActive = this.state.sortType == index ? 'active' : '';
            return (
                <a key={index} 
                    className={'btn btn-default ' + isActive}
                    onClick={this.handleClick.bind(this, index)}>{sort}</a>
            );
        });

        return (
            <div className="sl-sortbar">
	            <div className="btn-group btn-group-justified">
	                {sortBtns}
	            </div>
	        </div>
        );
    }
}

export default SortBar;
