import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import ReactGA from 'react-ga';
import {VelocityTransitionGroup} from 'velocity-react';
import {Page} from '@machete-platform/core-bundle/components/layout';
import {transition} from '@machete-platform/core-bundle/controllers/Transition';
import {dismiss} from '@vitruvian-tech/machete-bundle/controllers/Nav';
import {Footer} from '@vitruvian-tech/machete-bundle/components/layout';
import {create} from '@machete-platform/core-bundle/controllers/Contact';
import * as forms from '@machete-platform/core-bundle/components/forms';
import NukaCarousel from 'nuka-carousel';

const SECTIONS = {
  home: { index: 0, header: 0, slide: 0, param: '', next: 'missions' },
  missions: { index: 1, header: 0, slide: 1, param: 'missions', next: 'services', prev: 'home' },
  services: { index: 2, header: 0, slide: 2, param: 'services', next: 'plans', prev: 'missions' },
  plans: { index: 3, header: 0, slide: 3, param: 'plans', next: 'rates', prev: 'services' },
  rates: { index: 4, header: 0, slide: 4, param: 'rates', next: 'hosting', prev: 'plans' },
  hosting: { index: 5, header: 0, slide: 5, param: 'hosting', next: 'leadership', prev: 'rates' },
  leadership: { index: 6, header: 0, slide: 6, param: 'leadership', next: 'network', prev: 'hosting' },
  network: { index: 7, header: 0, slide: 7, param: 'network', next: 'communications', prev: 'leadership' },
  communications: { index: 8, header: 1, slide: 0, param: 'communications', next: 'headquarters', prev: 'network' },
  headquarters: { index: 9, header: 1, slide: 1, param: 'headquarters', prev: 'communications' }
};

@connect(state => {
  const { header = 0, slide = 0 } = state['@machete-platform/core-bundle'].Transition;
  return ({ param: state.router.params, header, slide });
}, {transition, dismiss, create})

export default class extends Page {
  static propTypes = {
    transition: PropTypes.func.isRequired,
    dismiss: PropTypes.func.isRequired,
    classNames: PropTypes.object,
    param: PropTypes.object,
    header: PropTypes.number.isRequired,
    slide: PropTypes.number.isRequired,
    section: PropTypes.string,
    hide: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    classNames: {}
  };

  state = {
    animating: false,
    contact: null,
    form: {
      message: null
    }
  };

  componentDidMount = () => document.querySelector('#app .nav + span > .page').addEventListener('click', this.props.dismiss);

  componentWillMount = () => this.updateHeader();

  componentWillUnmount = () => document.querySelector('#app .nav + span > .page').removeEventListener('click', this.props.dismiss);

  componentWillUpdate = props => {
    if (this.props.param.section !== props.param.section) {
      this.updateHeader(props);
    }
  };

  scrollTo = () => {
    if (global.scrollTo) {
      global.scrollTo(0, document.querySelector('.section.container').offsetTop - 40);
    }
  };

  submit = values => {
    const { create } = this.props;
    const ga = { category: 'Quote Form', action: 'Submit' };

    if (values.email) {
      ReactGA.event({ ...ga, label: `Attempt` });

      create({ ...values, quote: true, newsletter: !(values.newsletter === false) })
        .then(contact => this.setState({ contact, form: { message: null } }))
        .then(() => ReactGA.event({ ...ga, label: `Success` }))
        .catch(({message}) => this.setState({ form: { message } }));
    }
  };

  updateHeader = (props = this.props) => {
    const { transition } = this;
    const { header, slide } = SECTIONS[props.section || props.param.section] || SECTIONS.home;
    transition('header', header).then(() => transition('slide', slide));
  };

  transition = (type, index) => this.props[type] === index ? Promise.resolve() : this.props.transition({ [type]: index });

  afterSlide = header => this.transition('slide', 0).then(() => this.transition('header', header));

  // begin = () => this.setState({ animating: true });
  //
  // complete = () => this.setState({ animating: false });

  wrap = sections => sections.map((section, i) => <div key={String(i)}>{section}</div>);

  render() {
    const { headers, sections, className, classNames = {}, param, header, section, hide } = this.props;
    const { index/*, prev, next*/ } = SECTIONS[section || param.section] || SECTIONS.home;
    const single = headers.length === 1;
    const { animating, contact } = this.state;
    const { message } = this.state.form;

    return (
        <Page {...this.props} className={`home ${className} ${animating ? `${classNames.animating || ''} animating` : ''}`}>
          {headers.length ? (
            <section className={`${single ? 'single' : ''} header container`}>
              {single ? headers : (
                <NukaCarousel initialSlideWidth={2000} afterSlide={this.afterSlide} slideIndex={header}>
                  {headers}
                </NukaCarousel>
              )}
            </section>
          ) : <span/>}
          {!hide && (
            <section className="section container">
              {this.wrap(sections)[!section && index <= 1 ? index : 0]}
              {/*<VelocityTransitionGroup enter={{ easing: [ 0.17, 0.67, 0.83, 0.67 ], animation: 'transition.fadeIn', duration: 350, begin: this.begin, complete: this.complete }}>
                {this.wrap(sections)[section ? 0 : index]}
              </VelocityTransitionGroup>
              <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 5 }}>
                {prev && <Link to={`/home/${SECTIONS[prev].param}`} onClick={this.scrollTo}>&larr; Previous</Link>} {next && <Link to={`/home/${SECTIONS[next].param}`} onClick={this.scrollTo}>Next &rarr;</Link>}
              </div>*/}
            </section>
          )}
          <section className="quote">
            <div>
              <h3>Get a Quote</h3>
              <p>Interested in our products or services? Connect with us to learn more about how we can help your business!</p>
              {contact ?
                <div className="success"><strong>Thank you, {contact.firstName}, for your inquiry!</strong><br />We will contact you within 24 hours.</div> :
                <forms.Contact quote submitText="Submit" newsletterText="Join the VitruvianNation newsletter!" onSubmit={this.submit}/>}
              {message && <div className="error">{message}</div>}
            </div>
          </section>
          <Footer/>
        </Page>
    );
  }
}
