import React from 'react';

class Stars extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        let level = this.props.level * 1 || 0; // 0
        let stars = [];
        for (var i = 1; i <= 5; i++) {
        	if(i <= level)
	        	stars.push(
	        		<i key={i} className="icon-star_fill"></i>
	        	);
	        else 
	        	stars.push(
	        		<i key={i} className="icon-star"></i>
	        	);
        }

        return (
            <div className="stars">
                {stars}
            </div>
        );
    }
}

export default Stars;
