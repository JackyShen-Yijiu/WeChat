import React from 'react';

class Swiper extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var mySwiper = new Swiper('.swiper-container', {
            loop: true
        });
    }

    render() {
        return (
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    <div className="swiper-slide">000001</div>
                    <div className="swiper-slide">000002</div>
                    <div className="swiper-slide">000003</div>
                </div>
                <div className="swiper-pagination"></div>
            </div>
        );
    }
}

export default Swiper;
