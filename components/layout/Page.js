import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import NukaCarousel from 'nuka-carousel';
import {Page} from '@machete-platform/core-bundle/components/layout';
import {transition} from '@machete-platform/core-bundle/controllers/Transition';
import {Footer} from '@vitruvian-tech/machete-bundle/components/layout';

@connect(state => {
  const { header = 0, slide = 0 } = state['@machete-platform/core-bundle'].Transition;
  return { header, slide };
}, {transition})

export default class extends Page {
  static propTypes = {
    transition: PropTypes.func.isRequired,
    header: PropTypes.number.isRequired,
    slide: PropTypes.number.isRequired
  };

  componentWillMount = () => this.transition('slide', 0);

  transition = (type, index) => this.props[type] === index ? Promise.resolve() : this.props.transition({ [type]: index });

  afterSlide = header => this.transition('slide', 0).then(() => this.transition('header', header));

  render() {
    const { sections, headers, header } = this.props;
    const single = headers.length === 1;

    return (
      <Page {...this.props}>
        {headers.length ? (
          <section className={`${single ? 'single' : ''} header container`}>
            {single ? headers : (
              <NukaCarousel
                initialSlideWidth={2000}
                afterSlide={this.afterSlide}
                slideIndex={header}>
                {headers}
              </NukaCarousel>
            )}
          </section>
        ) : <span/>}
        <section className="section container">
          {sections}
        </section>
        <Footer/>
      </Page>
    );
  }
}
