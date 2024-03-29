import React from 'react';
import {Link} from 'react-router';
import DocumentTitle from 'react-document-title';

import CityListStore from '../stores/CityListStore'
import CityListActions from '../actions/CityListActions';

class CityList extends React.Component {
	constructor(props) {
        super(props);
        this.state = CityListStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    onChange(state) {
        this.setState(state);
    }

    componentDidMount() {
        CityListStore.listen(this.onChange);
        CityListActions.getCityList();
        this.setState({
        	currCity: localStorage.getItem('city') 
        });
    }

    componentWillUnmount() {
        CityListStore.unlisten(this.onChange);
    }

	render() {
		let currCity = this.state.currCity || '北京市';
		let list = this.state.list.filter((city) => {
			return city.name != currCity;
		}).map((city, index) => {
			if(index%2 == 0)
				return (
					<Link to={city.name + '/schools'} key={city.id} className="item">{city.name}</Link>
				);
			else {
				return (
					<span key={city.id} >
						<Link to={city.name + '/schools'} className="item">{city.name}</Link>
						<br />
					</span>
				);
			}
		});

		return (
			<div className="cl-wrap">
				<DocumentTitle title="城市列表"></DocumentTitle>
				<ul className="list-group city-list-group">
					<li className="list-group-item">
		            	<span className="title">定位城市：</span>
		            	<div className="items">
		            		<Link to={'/' + currCity + '/schools'} className="item">{currCity}</Link>
		            	</div>
					</li>
					<li className="list-group-item">
		            	<span className="title">热门城市：</span>
		            	<div className="items">
		            		{list}
		            	</div>
					</li>
				</ul>
			</div>
		);
	}
}

export default CityList;