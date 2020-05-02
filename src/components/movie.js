import React, { Component }  from 'react';
import {connect} from "react-redux";
import { Glyphicon, Panel, ListGroup, ListGroupItem, Form, FormGroup, FormControl, Col, ControlLabel, Button } from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import {fetchMovie} from "../actions/movieActions";
import {submitReview} from "../actions/reviewActions";

//support routing by creating a new component

class Movie extends Component {

    // constructor for reviews
    constructor(props) {
        super(props);

        this.updateDetails = this.updateDetails.bind(this);     // bind state to these functions
        this.submitReview = this.submitReview.bind(this);       // called to make a new review

        this.state = {
            details: {
                quote:'',
                rating:''
            }
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));
        }
    }

    updateDetails(event) {
        let updateDetails = Object.assign({}, this.state.details);

        updateDetails[event.target.id] = event.target.value;
        this.setState( {
            details: updateDetails
        });
    }

    submitReview() {
        const {dispatch} = this.props;
        let review = {
            title: this.props.selectedMovie.title,
            quote: this.state.details.quote,
            rating: this.state.details.rating
        }
        dispatch(submitReview(review, this.props.movieId));
    }

    render() {
        const ActorInfo = ({actors}) => {
            return actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor.actorName}</b> {actor.characterName}
                </p>
            )
        }

        const ReviewInfo = ({reviews}) => {
            return reviews.map((review, i) =>
                <p key={i}>
                    <b>{review.reviewer_name}</b> {review.quote}
                    <Glyphicon glyph={'star'} /> {review.rating}
                </p>
            )
        }

        const DetailInfo = ({currentMovie}) => {
            if (!currentMovie) { //if not could still be fetching the movie
                return <div>Loading...</div>;
            }
            return (
              <Panel>
                  <Panel.Heading>Movie Detail</Panel.Heading>
                  <Panel.Body><Image className="image" src={currentMovie.imageUrl} thumbnail /></Panel.Body>
                  <ListGroup>
                      <ListGroupItem>{currentMovie.title}</ListGroupItem>
                      <ListGroupItem><ActorInfo actors={currentMovie.actors} /></ListGroupItem>
                      <ListGroupItem><h4><Glyphicon glyph={'star'}/> {currentMovie.avgRating} </h4></ListGroupItem>
                  </ListGroup>
                  <Panel.Body><ReviewInfo reviews={currentMovie.reviews} /></Panel.Body>
              </Panel>
            );
        }

        return (
            <div>
                <DetailInfo currentMovie={this.props.selectedMovie} />

                <Form horizontal>
                    <FormGroup controlId="quote">
                        <Col componentClass={ControlLabel} sm={4}> Write a Review: </Col>
                        <Col sm={8}>
                            <FormControl componentClass="textarea" rows="3" onChange={this.updateDetails} value={this.state.details.quote} type="text" placeholder="Comment" />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="rating">
                        <Col componentClass={ControlLabel} sm={4}> Rating </Col>
                        <Col sm={8}>
                            <FormControl onChange={this.updateDetails} value={this.state.details.rating} type="number" min="1" max="5" placeholder="Rating" />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={4} sm={8}> <Button onClick={this.submitReview}>Submit</Button></Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(ownProps);
    return {
        selectedMovie: state.movie.selectedMovie,
        movieId: ownProps.match.params.movieId
    }
}

export default withRouter(connect(mapStateToProps)(Movie));